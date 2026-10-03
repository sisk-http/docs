# WebSocketUnregistrationHandler

Kind: Delegate  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketUnregistrationHandler.html

Represents an function that is called when an [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) is removed and had it's connection closed.

```csharp
public delegate void WebSocketUnregistrationHandler(object sender, HttpWebSocket ws)
```

#### Parameters

`sender` [object](https://learn.microsoft.com/dotnet/api/system.object)

Represents the caller [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) object.

`ws` [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)

Represents the closed [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) web socket connection.
