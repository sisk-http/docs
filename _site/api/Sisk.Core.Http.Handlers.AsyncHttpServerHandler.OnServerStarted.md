# AsyncHttpServerHandler.OnServerStarted

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnServerStarted.html

## OnServerStarted(HttpServer) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnServerStarted_Sisk_Core_Http_HttpServer_}

Event that is called immediately after starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), when it's
ready and listening.

```csharp
protected override sealed void OnServerStarted(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is ready.
