# AsyncHttpServerHandler.OnHttpRequestCloseAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnHttpRequestCloseAsync.html

## OnHttpRequestCloseAsync(HttpServerExecutionResult) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnHttpRequestCloseAsync_Sisk_Core_Http_HttpServerExecutionResult_}

Method that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is closed in the
HTTP server.

```csharp
protected virtual Task OnHttpRequestCloseAsync(HttpServerExecutionResult result)
```

### Parameters

`result` [HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

The result of the execution of the request.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
