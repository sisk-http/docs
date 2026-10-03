# HttpServer.HandleContext

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.HandleContext.html

## HandleContext(HttpServerEngineContext) {#Sisk_Core_Http_HttpServer_HandleContext_Sisk_Core_Http_Engine_HttpServerEngineContext_}

Handles a single [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md) request.

```csharp
public void HandleContext(HttpServerEngineContext context)
```

### Parameters

`context` [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md)

The engine context containing request and response objects.

### Remarks

The method processes the request, performs routing, applies CORS headers,
compresses content when appropriate, and writes the response back to the client.
It also logs the request and response details and executes any deferred actions.
