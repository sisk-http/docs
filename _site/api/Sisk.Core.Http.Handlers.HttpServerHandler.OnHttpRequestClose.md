# HttpServerHandler.OnHttpRequestClose

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnHttpRequestClose.html

## OnHttpRequestClose(HttpServerExecutionResult) {#Sisk_Core_Http_Handlers_HttpServerHandler_OnHttpRequestClose_Sisk_Core_Http_HttpServerExecutionResult_}

Event that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is closed in the
HTTP server.

```csharp
protected virtual void OnHttpRequestClose(HttpServerExecutionResult result)
```

### Parameters

`result` [HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

The result of the execution of the request.
