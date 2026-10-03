# AsyncHttpServerHandler.OnHttpRequestOpen

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnHttpRequestOpen.html

## OnHttpRequestOpen(HttpRequest) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnHttpRequestOpen_Sisk_Core_Http_HttpRequest_}

Event that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is received in the
HTTP server.

```csharp
protected override sealed void OnHttpRequestOpen(HttpRequest request)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The connecting HTTP request entity.
