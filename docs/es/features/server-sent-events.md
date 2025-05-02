# Eventos Enviados por Servidor

Sisk admite el envío de mensajes a través de Eventos Enviados por Servidor de forma predeterminada. Puedes crear conexiones desechables y persistentes, obtener las conexiones durante el tiempo de ejecución y utilizarlas.

Esta característica tiene algunas limitaciones impuestas por los navegadores, como el envío de solo mensajes de texto y no poder cerrar permanentemente una conexión. Una conexión cerrada en el lado del servidor hará que un cliente intente reconectar periódicamente cada 5 segundos (3 para algunos navegadores).

Estas conexiones son útiles para enviar eventos desde el servidor al cliente sin que el cliente solicite la información cada vez.

## Creando una conexión SSE

Una conexión SSE funciona como una solicitud HTTP regular, pero en lugar de enviar una respuesta y cerrar inmediatamente la conexión, la conexión se mantiene abierta para enviar mensajes.

Al llamar al método [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource), la solicitud se pone en un estado de espera mientras se crea la instancia de SSE.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();

 sse.Send("Hola, mundo!");

 return sse.Close();
});
```

En el código anterior, creamos una conexión SSE y enviamos un mensaje "Hola, mundo", luego cerramos la conexión SSE desde el lado del servidor.

> [!NOTE]
> Al cerrar una conexión en el lado del servidor, por defecto el cliente intentará conectarse de nuevo en ese extremo y la conexión se reiniciará, ejecutando el método de nuevo, por siempre.
> 
> Es común reenviar un mensaje de terminación desde el servidor cada vez que la conexión se cierra desde el servidor para evitar que el cliente intente reconectar de nuevo.

## Agregando encabezados

Si necesitas enviar encabezados, puedes utilizar el método [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) antes de enviar cualquier mensaje.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();
 sse.AppendHeader("Clave-Encabezado", "Valor-Encabezado");

 sse.Send("Hola!");

 return sse.Close();
});
```

Ten en cuenta que es necesario enviar los encabezados antes de enviar cualquier mensaje.

## Conexiones Wait-For-Fail

Las conexiones normalmente se terminan cuando el servidor ya no puede enviar mensajes debido a una posible desconexión en el lado del cliente. De esta manera, la conexión se termina automáticamente y la instancia de la clase se descarta.

Incluso con una reconexión, la instancia de la clase no funcionará, ya que está vinculada a la conexión anterior. En algunas situaciones, es posible que necesites esta conexión más adelante y no quieras administrarla a través del método de devolución de llamada de la ruta.

Para esto, podemos identificar las conexiones SSE con un identificador y obtenerlas utilizando más tarde, incluso fuera de la devolución de llamada de la ruta. Además, marcamos la conexión con [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) para no terminar la ruta y terminar la conexión automáticamente.

Una conexión SSE en KeepAlive esperará un error de envío (causado por la desconexión) para reanudar la ejecución del método. También es posible establecer un tiempo de espera para esto. Después del tiempo, si no se ha enviado ningún mensaje, la conexión se termina y la ejecución se reanuda.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource("mi-indice-conexion");

 sse.WaitForFail(TimeSpan.FromSeconds(15)); // esperar 15 segundos sin ningún mensaje antes de terminar la conexión

 return sse.Close();
});
```

El método anterior creará la conexión, la manejará y esperará una desconexión o error.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("mi-indice-conexion");
if (evs != null)
{
 // la conexión todavía está viva
 evs.Send("Hola de nuevo!");
}
```

Y el fragmento de código anterior intentará buscar la conexión recién creada y, si existe, enviará un mensaje a ella.

Todas las conexiones activas del servidor que estén identificadas estarán disponibles en la colección [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources). Esta colección solo almacena conexiones activas e identificadas. Las conexiones cerradas se eliminan de la colección.

> [!NOTE]
> Es importante tener en cuenta que Keep Alive tiene un límite establecido por componentes que pueden estar conectados a Sisk de una manera incontrolable, como un proxy web, un kernel HTTP o un controlador de red, y cierran las conexiones inactivas después de un período determinado de tiempo.
> 
> Por lo tanto, es importante mantener la conexión abierta enviando pings periódicos o extendiendo el tiempo máximo antes de que se cierre la conexión. Lee la siguiente sección para comprender mejor el envío de pings periódicos.

## Configurar política de pings de conexión

La política de pings es una forma automatizada de enviar mensajes periódicos a tu cliente. Esta función permite al servidor comprender cuándo el cliente se ha desconectado de esa conexión sin tener que mantener la conexión abierta indefinidamente.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
 using var sse = request.GetEventSource();
 sse.WithPing(ping =>
 {
 ping.DataMessage = "mensaje-ping";
 ping.Interval = TimeSpan.FromSeconds(5);
 ping.Start();
 });
    
 sse.KeepAlive();
 return sse.Close();
}
```

En el código anterior, cada 5 segundos, se enviará un nuevo mensaje de ping al cliente. Esto mantendrá viva la conexión TCP y evitará que se cierre debido a la inactividad. Además, cuando un mensaje falla al enviarse, la conexión se cierra automáticamente, liberando los recursos utilizados por la conexión.

## Consultar conexiones

Puedes buscar conexiones activas utilizando un predicado en el identificador de conexión, para poder transmitir, por ejemplo.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("mi-conexion-"));
foreach (HttpRequestEventSource e in evs)
{
 e.Send("Transmisión a todas las fuentes de eventos que comienzan con 'mi-conexion-'");
}
```

También puedes utilizar el método [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) para obtener todas las conexiones SSE activas.