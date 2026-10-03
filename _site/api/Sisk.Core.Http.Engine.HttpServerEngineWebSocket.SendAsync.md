# HttpServerEngineWebSocket.SendAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.SendAsync.html

## SendAsync(ReadOnlyMemory&lt;byte>, WebSocketMessageType, bool, CancellationToken) {#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_SendAsync_System_ReadOnlyMemory_System_Byte__System_Net_WebSockets_WebSocketMessageType_System_Boolean_System_Threading_CancellationToken_}

Sends data over the WebSocket asynchronously.

```csharp
public abstract ValueTask SendAsync(ReadOnlyMemory<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken)
```

### Parameters

`buffer` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The buffer containing the data to send.

`messageType` [WebSocketMessageType](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocketmessagetype)

The type of message to send.

`endOfMessage` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

A value indicating whether this is the end of the message.

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) representing the asynchronous operation.
