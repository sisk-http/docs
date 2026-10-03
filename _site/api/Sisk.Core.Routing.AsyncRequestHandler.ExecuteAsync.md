# AsyncRequestHandler.ExecuteAsync

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.ExecuteAsync.html

## ExecuteAsync(HttpRequest, HttpContext) {#Sisk_Core_Routing_AsyncRequestHandler_ExecuteAsync_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_}

This method is called by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) before executing a request when the [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instantiates an object that implements this interface. If it returns
a [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object, the route action is not called and all execution of the route is stopped. If it returns "null", the execution is continued.

```csharp
public abstract Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The entry HTTP request.

`context` [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)

The HTTP request context. It may contain information from other [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?\>
