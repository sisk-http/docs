# CadenteHttpServerEngine.OnConfiguring

Kind: Method  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.OnConfiguring.html

## OnConfiguring(HttpServer, HttpServerConfiguration) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_OnConfiguring_Sisk_Core_Http_HttpServer_Sisk_Core_Http_HttpServerConfiguration_}

Called when the server is being configured.

```csharp
public override void OnConfiguring(HttpServer server, HttpServerConfiguration configuration)
```

### Parameters

`server` HttpServer

The [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance that is being configured.

`configuration` HttpServerConfiguration

The [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md) that will be applied to the server.

### Remarks

Override this method to customize the configuration of the server before it starts.
The default implementation performs no action.
