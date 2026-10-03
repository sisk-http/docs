# HttpServerHandler.OnServerStopped

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStopped.html

## OnServerStopped(HttpServer) {#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStopped_Sisk_Core_Http_HttpServer_}

Event that is called after the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is stopped, meaning
it has stopped from listening to requests.

```csharp
protected virtual void OnServerStopped(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which has stopped.
