---
title: "Eventos enviados por el servidor"
weight: 20
aliases:
  - "/docs/es/features/server-sent-events.html"
sourceHash: "18ad303896f08f69"
---

Sisk admite el envío de mensajes a través de Server Sent Events de forma nativa. Puedes crear conexiones desechables y persistentes, obtener las conexiones durante el tiempo de ejecución y utilizarlas.

Esta característica tiene algunas limitaciones impuestas por los navegadores, como el envío solo de mensajes de texto y la imposibilidad de cerrar permanentemente una conexión. Una conexión cerrada del lado del servidor hará que el cliente intente reconectarse periódicamente cada 5 segundos (3 en algunos navegadores).

Estas conexiones son útiles para enviar eventos del servidor al cliente sin que el cliente tenga que solicitar la información cada vez.

## Creando una conexión SSE

Una conexión SSE funciona como una solicitud HTTP normal, pero en lugar de enviar una respuesta y cerrar inmediatamente la conexión, la conexión se mantiene abierta para enviar mensajes.

Al llamar al método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), la solicitud queda en estado de espera mientras se crea la instancia SSE.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

En el código anterior, creamos una conexión SSE y enviamos un mensaje "Hello, world", luego cerramos la conexión SSE del lado del servidor.

> [!NOTE]
> Al cerrar una conexión del lado del servidor, por defecto el cliente intentará conectarse nuevamente en ese extremo y la conexión se reiniciará, ejecutando el método de nuevo, indefinidamente.
>
> Es común reenviar un mensaje de terminación desde el servidor siempre que la conexión se cierre desde el servidor para evitar que el cliente intente reconectarse nuevamente.

## Añadiendo encabezados

Si necesitas enviar encabezados, puedes usar el método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar cualquier mensaje.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

Ten en cuenta que es necesario enviar los encabezados antes de enviar cualquier mensaje.

## Conexiones Wait-For-Fail

Las conexiones se terminan normalmente cuando el servidor ya no puede enviar mensajes debido a una posible desconexión del cliente. Con ello, la conexión se termina automáticamente y la instancia de la clase se descarta.

Incluso con una reconexión, la instancia de la clase no funcionará, ya que está vinculada a la conexión anterior. En algunas situaciones, puedes necesitar esta conexión más adelante y no deseas gestionarla mediante el método de devolución de llamada de la ruta.

Para ello, podemos identificar las conexiones SSE con un identificador y obtenerlas más tarde usando dicho identificador, incluso fuera de la devolución de llamada de la ruta. Además, marcamos la conexión con [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para no terminar la ruta y terminar la conexión automáticamente.

Una conexión SSE en `WaitForFail` espera a que ocurra un error de envío causado por una desconexión, o a que transcurra la tolerancia de inactividad configurada, antes de que la ruta se reanude y cierre la conexión.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // esperar 15 segundos sin ningún mensaje antes de terminar la conexión

    return sse.Close();
});
```

El método anterior creará la conexión, la gestionará y esperará a una desconexión o error.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // la conexión sigue viva
    evs.Send("Hello again!");
}
```

Y el fragmento anterior intentará buscar la conexión recién creada y, si existe, enviará un mensaje a ella.

Todas las conexiones activas del servidor que estén identificadas estarán disponibles en la colección [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Esta colección solo almacena conexiones activas e identificadas. Las conexiones cerradas se eliminan de la colección.

> [!NOTE]
> Es importante notar que el keep alive tiene un límite establecido por componentes que pueden estar conectados a Sisk de forma incontrolable, como un proxy web, un kernel HTTP o un controlador de red, y cierran las conexiones inactivas después de un cierto período de tiempo.
>
> Por lo tanto, es importante mantener la conexión abierta enviando pings periódicos o ampliando el tiempo máximo antes de que la conexión se cierre. Lee la siguiente sección para comprender mejor el envío de pings periódicos.

## Configurar la política de ping de conexiones

La política de ping es una forma automatizada de enviar mensajes periódicos a tu cliente. Esta función permite al servidor saber cuándo el cliente se ha desconectado de esa conexión sin tener que mantener la conexión abierta indefinidamente.

```cs
[RouteGet("/sse")]
public async Task<HttpResponse> Events(HttpRequest request)
{
    using var sse = await request.GetEventSourceAsync("user-events");
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    await sse.WaitForFailAsync(TimeSpan.FromMinutes(10));
    return await sse.CloseAsync();
}
```

En el código anterior, cada 5 segundos se enviará un nuevo mensaje de ping al cliente. Esto mantendrá viva la conexión TCP y evitará que se cierre por inactividad. Además, cuando un mensaje no se puede enviar, la conexión se cierra automáticamente, liberando los recursos utilizados por la conexión.

Utiliza [SendAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync) y [CloseAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync) en rutas asíncronas. Si necesitas descartar eventos en cola antes de cerrar, llama a [Cancel](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel).

## Consultar conexiones

Puedes buscar conexiones activas usando un predicado sobre el identificador de la conexión, para poder difundir, por ejemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

También puedes usar el método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obtener todas las conexiones SSE activas.
