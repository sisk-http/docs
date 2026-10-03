# HttpServerEngineWebSocket.CreateFromWebSocket

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.CreateFromWebSocket.html

## CreateFromWebSocket(WebSocket) {#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_CreateFromWebSocket_System_Net_WebSockets_WebSocket_}

Creates a concrete [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md) instance from the specified [WebSocket](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocket).

```csharp
public static HttpServerEngineWebSocket CreateFromWebSocket(WebSocket ws)
```

### Parameters

`ws` [WebSocket](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocket)

The [WebSocket](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocket) to wrap.

### Returns

[HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md)

A new [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md) instance that represents the supplied WebSocket.
