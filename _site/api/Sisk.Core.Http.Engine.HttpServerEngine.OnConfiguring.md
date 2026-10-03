# HttpServerEngine.OnConfiguring

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.OnConfiguring.html

## OnConfiguring(HttpServer, HttpServerConfiguration) {#Sisk_Core_Http_Engine_HttpServerEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_}

Called when the server is being configured.

```csharp
public virtual void OnConfiguring(HttpServer server, HttpServerConfiguration configuration)
```

### Parameters

`server` [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

The [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance that is being configured.

`configuration` [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md)

The [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md) that will be applied to the server.

### Remarks

Override this method to customize the configuration of the server before it starts.
The default implementation performs no action.
