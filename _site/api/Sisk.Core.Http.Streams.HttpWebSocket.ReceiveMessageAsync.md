# HttpWebSocket.ReceiveMessageAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.ReceiveMessageAsync.html

## ReceiveMessageAsync(CancellationToken) {#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync_System_Threading_CancellationToken_}

Receives a message from the WebSocket endpoint asynchronously.

```csharp
public ValueTask<WebSocketMessage?> ReceiveMessageAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to use for cancellation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md)?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous receive operation, 
            which returns a [WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md) if a message is received; otherwise, `null`.

## ReceiveMessageAsync(TimeSpan) {#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync_System_TimeSpan_}

Receives a message from the WebSocket endpoint asynchronously with a specified timeout.

```csharp
public ValueTask<WebSocketMessage?> ReceiveMessageAsync(TimeSpan timeout)
```

### Parameters

`timeout` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time to wait for a message before timing out.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md)?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous receive operation, 
            which returns a [WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md) if a message is received; otherwise, `null`.

## ReceiveMessageAsync() {#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync}

Receives a message from the WebSocket endpoint asynchronously with a default timeout of 30 seconds.

```csharp
public ValueTask<WebSocketMessage?> ReceiveMessageAsync()
```

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md)?\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous receive operation, 
            which returns a [WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md) if a message is received; otherwise, `null`.
