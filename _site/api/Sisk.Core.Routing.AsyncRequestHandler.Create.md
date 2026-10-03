# AsyncRequestHandler.Create

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.Create.html

## Create(Func&lt;HttpRequest, HttpContext, Task&lt;HttpResponse?>>, RequestHandlerExecutionMode) {#Sisk_Core_Routing_AsyncRequestHandler_Create_System_Func_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_System_Threading_Tasks_Task_Sisk_Core_Http_HttpResponse___Sisk_Core_Routing_RequestHandlerExecutionMode_}

Gets an inline [AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md) that resolves to the specified function.

```csharp
public static AsyncRequestHandler Create(Func<HttpRequest, HttpContext, Task<HttpResponse?>> execute, RequestHandlerExecutionMode executionMode = RequestHandlerExecutionMode.BeforeResponse)
```

### Parameters

`execute` [Func](https://learn.microsoft.com/dotnet/api/system.func\-3)<[HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md), [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md), [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?\>\>

The function that the [AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md) will run.

`executionMode` [RequestHandlerExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RequestHandlerExecutionMode.md)

Optional. Determines where the request handler will be executed.

### Returns

[AsyncRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.AsyncRequestHandler.md)
