# MitmproxyProvider.OnServerStopped

Kind: Method  
Namespace: `Sisk.Helpers.Mitmproxy`  
Assembly: `Sisk.Helpers.mitmproxy.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Helpers.Mitmproxy.MitmproxyProvider.OnServerStopped.html

## OnServerStopped(HttpServer) {#Sisk_Helpers_Mitmproxy_MitmproxyProvider_OnServerStopped_Sisk_Core_Http_HttpServer_}

Event that is called after the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is stopped, meaning
it has stopped from listening to requests.

```csharp
protected override void OnServerStopped(HttpServer server)
```

### Parameters

`server` HttpServer

The HTTP server entity which has stopped.
