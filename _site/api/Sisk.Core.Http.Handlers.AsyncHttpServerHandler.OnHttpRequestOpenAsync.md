# AsyncHttpServerHandler.OnHttpRequestOpenAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnHttpRequestOpenAsync.html

## OnHttpRequestOpenAsync(HttpRequest) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnHttpRequestOpenAsync_Sisk_Core_Http_HttpRequest_}

Method that is called when an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) is received in the
HTTP server.

```csharp
protected virtual Task OnHttpRequestOpenAsync(HttpRequest request)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The connecting HTTP request entity.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
