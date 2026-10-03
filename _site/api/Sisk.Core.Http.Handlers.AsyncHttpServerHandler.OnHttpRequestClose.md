# AsyncHttpServerHandler.OnHttpRequestClose

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnHttpRequestClose.html

## OnHttpRequestClose(HttpServerExecutionResult) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnHttpRequestClose_Sisk_Core_Http_HttpServerExecutionResult_}

Event that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is closed in the
HTTP server.

```csharp
protected override sealed void OnHttpRequestClose(HttpServerExecutionResult result)
```

### Parameters

`result` [HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

The result of the execution of the request.
