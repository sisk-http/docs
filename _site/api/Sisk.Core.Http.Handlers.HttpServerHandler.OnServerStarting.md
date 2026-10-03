# HttpServerHandler.OnServerStarting

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.OnServerStarting.html

## OnServerStarting(HttpServer) {#Sisk_Core_Http_Handlers_HttpServerHandler_OnServerStarting_Sisk_Core_Http_HttpServer_}

Event that is called immediately before starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md).

```csharp
protected virtual void OnServerStarting(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is starting.
