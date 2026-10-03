# AsyncHttpServerHandler.OnServerStartedAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnServerStartedAsync.html

## OnServerStartedAsync(HttpServer) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnServerStartedAsync_Sisk_Core_Http_HttpServer_}

Method that is called immediately after starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), when it's
ready and listening.

```csharp
protected virtual Task OnServerStartedAsync(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is ready.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
