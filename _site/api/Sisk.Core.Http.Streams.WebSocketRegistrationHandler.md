# WebSocketRegistrationHandler

Kind: Delegate  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketRegistrationHandler.html

Represents an function that is called when an [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) registers an new web socket connection.

```csharp
public delegate void WebSocketRegistrationHandler(object sender, HttpWebSocket ws)
```

#### Parameters

`sender` [object](https://learn.microsoft.com/dotnet/api/system.object)

Represents the caller [HttpWebSocketConnectionCollection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocketConnectionCollection.md) object.

`ws` [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)

Represents the registered [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) web socket connection.
