# RequestHandler.Create

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.Create.html

## Create(Func&lt;HttpRequest, HttpContext, HttpResponse?>, RequestHandlerExecutionMode) {#Sisk_Core_Routing_RequestHandler_Create_System_Func_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_Sisk_Core_Http_HttpResponse__Sisk_Core_Routing_RequestHandlerExecutionMode_}

Gets an inline [RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md) that resolves to the specified function.

```csharp
public static RequestHandler Create(Func<HttpRequest, HttpContext, HttpResponse?> execute, RequestHandlerExecutionMode executionMode = RequestHandlerExecutionMode.BeforeResponse)
```

### Parameters

`execute` [Func](https://learn.microsoft.com/dotnet/api/system.func\-3)<[HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md), [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md), [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?\>

The function that the [RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md) will run.

`executionMode` [RequestHandlerExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerExecutionMode.md)

Optional. Determines where the request handler will be executed.

### Returns

[RequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandler.md)
