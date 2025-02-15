# Sintaxis de descarte

El servidor HTTP se puede utilizar para escuchar una solicitud de devolución de llamada desde una acción, como la autenticación OAuth, y se puede descartar después de recibir esa solicitud. Esto puede ser útil en casos donde necesite una acción en segundo plano pero no desee configurar una aplicación HTTP completa para ello.

El siguiente ejemplo muestra cómo crear un servidor HTTP de escucha en el puerto 5555 con [CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) y esperar el siguiente contexto:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // espera la próxima solicitud HTTP
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Ruta solicitada: {context.Request.Path}");
}
```

La función [WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext) espera el próximo contexto de un procesamiento de solicitud completado. Una vez que se obtiene el resultado de esta operación, el servidor ya ha procesado completamente la solicitud y ha enviado la respuesta al cliente.