# HttpServerEngineWebSocket.ReceiveAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.ReceiveAsync.html

## ReceiveAsync(Memory&lt;byte>, CancellationToken) {#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_ReceiveAsync_System_Memory_System_Byte__System_Threading_CancellationToken_}

Receives data from the WebSocket asynchronously.

```csharp
public abstract ValueTask<ValueWebSocketReceiveResult> ReceiveAsync(Memory<byte> buffer, CancellationToken cancellationToken)
```

### Parameters

`buffer` [Memory](https://learn.microsoft.com/dotnet/api/system.memory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The buffer to receive the data into.

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[ValueWebSocketReceiveResult](https://learn.microsoft.com/dotnet/api/system.net.websockets.valuewebsocketreceiveresult)\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) representing the asynchronous operation. The result contains the [ValueWebSocketReceiveResult](https://learn.microsoft.com/dotnet/api/system.net.websockets.valuewebsocketreceiveresult).
