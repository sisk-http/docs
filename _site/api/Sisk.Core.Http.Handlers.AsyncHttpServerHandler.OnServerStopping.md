# AsyncHttpServerHandler.OnServerStopping

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnServerStopping.html

## OnServerStopping(HttpServer) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnServerStopping_Sisk_Core_Http_HttpServer_}

Event that is called before the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) stop, when it is
stopping from listening requests.

```csharp
protected override sealed void OnServerStopping(HttpServer server)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The HTTP server entity which is stopping.
