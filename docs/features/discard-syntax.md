# Discard syntax

The HTTP server can be used to listen for a callback request from an action, such as OAuth authentication, and can be discarded after receiving that request. This can be useful in cases where you need a background action but do not want to set up an entire HTTP application for it.

The following example show us how to create an listening HTTP server at port 5555 with [CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) and wait the next context:

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // wait for the next http request
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Requested path: {context.Request.Path}");
}
```

The [WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext) function waits for the next context of a completed request processing. Once the result of this operation is obtained, the server has already fully handled the request and sent the response to the client.