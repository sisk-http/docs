# Sintaxis de descarte

Source: https://docs.sisk-framework.org/es/docs/features/discard-syntax.html

El servidor HTTP se puede utilizar para escuchar una solicitud de devolución de llamada desde una acción, como la autenticación OAuth, y se puede descartar después de recibir esa solicitud. Esto puede ser útil en casos donde necesite una acción en segundo plano pero no desee configurar una aplicación HTTP completa para ello.

El siguiente ejemplo muestra cómo crear un servidor HTTP de escucha en el puerto 5555 con [CreateListener](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.md) y esperar el siguiente contexto:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // esperar la siguiente solicitud http
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Ruta solicitada: {context.Request.Path}");
}
```

La función [WaitNext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNext.md) espera el siguiente contexto de un procesamiento de solicitud completado. Una vez que se obtiene el resultado de esta operación, el servidor ya ha manejado completamente la solicitud y ha enviado la respuesta al cliente.
