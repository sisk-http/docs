# HttpServerEngineWebSocket.CloseAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.CloseAsync.html

## CloseAsync(WebSocketCloseStatus, string?, CancellationToken) {#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_CloseAsync_System_Net_WebSockets_WebSocketCloseStatus_System_String_System_Threading_CancellationToken_}

Closes the WebSocket connection asynchronously.

```csharp
public abstract Task CloseAsync(WebSocketCloseStatus closeStatus, string? reason, CancellationToken cancellation)
```

### Parameters

`closeStatus` [WebSocketCloseStatus](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocketclosestatus)

The status code for closing the WebSocket.

`reason` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The reason for closing the WebSocket.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) representing the asynchronous operation.
