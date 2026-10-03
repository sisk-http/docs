# AsyncHttpServerHandler.OnServerStoppingAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnServerStoppingAsync.html

## OnServerStoppingAsync(HttpServer) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnServerStoppingAsync_Sisk_Core_Http_HttpServer_}

Method that is called before the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) stop, when it is
stopping from listening requests.

```csharp
protected virtual Task OnServerStoppingAsync(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is stopping.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
