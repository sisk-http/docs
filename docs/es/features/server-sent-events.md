# Eventos Enviados por el Servidor

Sisk admite el envío de mensajes a través de Eventos Enviados por el Servidor de forma predeterminada. Puedes crear conexiones desechables y persistentes, obtener las conexiones durante la ejecución y utilizarlas.

Esta función tiene algunas limitaciones impuestas por los navegadores, como el envío solo de mensajes de texto y no poder cerrar permanentemente una conexión. Una conexión cerrada en el servidor tendrá un cliente que intentará reconectar cada 5 segundos (3 para algunos navegadores).

Estas conexiones son útiles para enviar eventos desde el servidor al cliente sin que el cliente tenga que solicitar la información cada vez.

## Crear una conexión SSE

Una conexión SSE funciona como una solicitud HTTP regular, pero en lugar de enviar una respuesta y cerrar la conexión inmediatamente, la conexión se mantiene abierta para enviar mensajes.

Al llamar al método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), la solicitud se pone en un estado de espera mientras se crea la instancia SSE.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hola, mundo!");

    return sse.Close();
});
```

En el código anterior, creamos una conexión SSE y enviamos un mensaje "Hola, mundo", luego cerramos la conexión SSE desde el servidor.

> [!NOTE]
> Cuando se cierra una conexión en el servidor, por defecto el cliente intentará conectarse de nuevo y la conexión se reiniciará, ejecutando el método de nuevo, indefinidamente.
>
> Es común enviar un mensaje de terminación desde el servidor cada vez que se cierra la conexión desde el servidor para evitar que el cliente intente reconectar de nuevo.

## Agregar encabezados

Si necesitas enviar encabezados, puedes utilizar el método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar cualquier mensaje.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hola!");

    return sse.Close();
});
```

Tenga en cuenta que es necesario enviar los encabezados antes de enviar cualquier mensaje.

## Conexiones de espera por fallo

Las conexiones normalmente se terminan cuando el servidor ya no puede enviar mensajes debido a una posible desconexión del cliente. Con esto, la conexión se termina automáticamente y la instancia de la clase se descarta.

Incluso con una reconexión, la instancia de la clase no funcionará, ya que está vinculada a la conexión anterior. En algunas situaciones, es posible que necesites esta conexión más adelante y no quieras administrarla a través del método de devolución de llamada de la ruta.

Para esto, podemos identificar las conexiones SSE con un identificador y obtenerlas utilizando este identificador más adelante, incluso fuera del método de devolución de llamada de la ruta. Además, marcamos la conexión con [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para no terminar la ruta y terminar la conexión automáticamente.

Una conexión SSE en KeepAlive esperará a que se produzca un error de envío (causado por una desconexión) para reanudar la ejecución del método. También es posible establecer un tiempo de espera para esto. Después del tiempo, si no se ha enviado ningún mensaje, la conexión se termina y se reanuda la ejecución.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource("mi-conexion-index");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // esperar 15 segundos sin ningún mensaje antes de terminar la conexión

    return sse.Close();
});
```

El método anterior creará la conexión, la administrará y esperará a que se produzca una desconexión o un error.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("mi-conexion-index");
if (evs != null)
{
    // la conexión todavía está viva
    evs.Send("Hola de nuevo!");
}
```

Y el fragmento de código anterior intentará buscar la conexión recién creada, y si existe, enviará un mensaje a ella.

Todas las conexiones de servidor activas que estén identificadas estarán disponibles en la colección [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Esta colección solo almacena conexiones activas e identificadas. Las conexiones cerradas se eliminan de la colección.

> [!NOTE]
> Es importante tener en cuenta que el mantenimiento de la conexión tiene un límite establecido por componentes que pueden estar conectados a Sisk de una manera no controlable, como un proxy web, un kernel HTTP o un controlador de red, y que cierran las conexiones inactivas después de un cierto período de tiempo.
>
> Por lo tanto, es importante mantener la conexión abierta enviando pings periódicos o extendiendo el tiempo máximo antes de que se cierre la conexión. Lea la siguiente sección para comprender mejor el envío de pings periódicos.

## Configurar la política de ping de las conexiones

La política de ping es una forma automatizada de enviar mensajes periódicos al cliente. Esta función permite al servidor entender cuándo el cliente se ha desconectado de la conexión sin tener que mantener la conexión abierta indefinidamente.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    using var sse = request.GetEventSource();
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    sse.KeepAlive();
    return sse.Close();
}
```

En el código anterior, cada 5 segundos, se enviará un nuevo mensaje de ping al cliente. Esto mantendrá la conexión TCP abierta y evitará que se cierre debido a la inactividad. Además, cuando un mensaje no se pueda enviar, la conexión se cerrará automáticamente, liberando los recursos utilizados por la conexión.

## Consultar conexiones

Puedes buscar conexiones activas utilizando un predicado en el identificador de la conexión, para poder difundir, por ejemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("mi-conexion-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Difundiendo a todas las fuentes de eventos que comienzan con 'mi-conexion-'");
}
```

También puedes utilizar el método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obtener todas las conexiones SSE activas.