# AsyncHttpServerHandler.OnServerStartingAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnServerStartingAsync.html

## OnServerStartingAsync(HttpServer) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnServerStartingAsync_Sisk_Core_Http_HttpServer_}

Method that is called immediately before starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md).

```csharp
protected virtual Task OnServerStartingAsync(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is starting.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
