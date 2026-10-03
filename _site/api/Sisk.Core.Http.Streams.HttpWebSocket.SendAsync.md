# HttpWebSocket.SendAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.SendAsync.html

## SendAsync(string, CancellationToken) {#Sisk_Core_Http_Streams_HttpWebSocket_SendAsync_System_String_System_Threading_CancellationToken_}

Sends an asynchronous text message to the WebSocket endpoint.

```csharp
public ValueTask<bool> SendAsync(string message, CancellationToken cancellation = default)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The text message to send.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to use for cancellation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous send operation, 
            which returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the message was sent successfully; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

## SendAsync(ReadOnlyMemory&lt;byte>, CancellationToken) {#Sisk_Core_Http_Streams_HttpWebSocket_SendAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_}

Sends an asynchronous binary message to the WebSocket endpoint.

```csharp
public ValueTask<bool> SendAsync(ReadOnlyMemory<byte> buffer, CancellationToken cancellation = default)
```

### Parameters

`buffer` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The binary data to send.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to use for cancellation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous send operation, 
            which returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the message was sent successfully; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
