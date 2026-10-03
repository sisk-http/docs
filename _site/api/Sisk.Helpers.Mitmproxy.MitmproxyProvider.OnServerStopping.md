# MitmproxyProvider.OnServerStopping

Kind: Method  
Namespace: `Sisk.Helpers.Mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStopping.html

## OnServerStopping(HttpServer) {#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStopping_Sisk_Core_Http_HttpServer_}

Event that is called before the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) stop, when it is
stopping from listening requests.

```csharp
protected override void OnServerStopping(HttpServer server)
```

### Parameters

`server` HttpServer

The HTTP server entity which is stopping.
