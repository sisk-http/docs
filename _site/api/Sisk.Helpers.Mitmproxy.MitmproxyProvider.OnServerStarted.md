# MitmproxyProvider.OnServerStarted

Kind: Method  
Namespace: `Sisk.Helpers.Mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStarted.html

## OnServerStarted(HttpServer) {#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStarted_Sisk_Core_Http_HttpServer_}

Event that is called immediately after starting the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md), when it's
ready and listening.

```csharp
protected override void OnServerStarted(HttpServer server)
```

### Parameters

`server` HttpServer

The HTTP server entity which is ready.
