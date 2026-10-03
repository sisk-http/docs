# HttpWebSocket

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.html

Provides an persistent bi-directional socket between the client and the HTTP server.

```csharp
public sealed class HttpWebSocket : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.HttpRequest.md#Sisk_Core_Http_Streams_HttpWebSocket_HttpRequest) | Gets the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object which created this Web Socket instance. |
| [Identifier](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.Identifier.md#Sisk_Core_Http_Streams_HttpWebSocket_Identifier) | Gets an unique identifier label to this Web Socket connection, useful for finding this connection's reference later. |
| [IsClosed](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.IsClosed.md#Sisk_Core_Http_Streams_HttpWebSocket_IsClosed) | Gets an boolean indicating if this Web Socket connection is closed. |
| [PingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.PingPolicy.md#Sisk_Core_Http_Streams_HttpWebSocket_PingPolicy) | Gets the [HttpStreamPingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.md) for this HTTP web socket connection. |
| [State](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.State.md#Sisk_Core_Http_Streams_HttpWebSocket_State) | Gets or sets an object linked with this [WebSocket](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocket) session. |

## Methods

| Name | Description |
| --- | --- |
| [CloseAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.CloseAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_CloseAsync_System_Threading_CancellationToken_) | Closes the WebSocket connection asynchronously. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.Dispose.md#Sisk_Core_Http_Streams_HttpWebSocket_Dispose) |  |
| [ReceiveMessageAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.ReceiveMessageAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync_System_Threading_CancellationToken_) | Receives a message from the WebSocket endpoint asynchronously. |
| [ReceiveMessageAsync\(TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.ReceiveMessageAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync_System_TimeSpan_) | Receives a message from the WebSocket endpoint asynchronously with a specified timeout. |
| [ReceiveMessageAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.ReceiveMessageAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_ReceiveMessageAsync) | Receives a message from the WebSocket endpoint asynchronously with a default timeout of 30 seconds. |
| [SendAsync\(string, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.SendAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_SendAsync_System_String_System_Threading_CancellationToken_) | Sends an asynchronous text message to the WebSocket endpoint. |
| [SendAsync\(ReadOnlyMemory<byte\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.SendAsync.md#Sisk_Core_Http_Streams_HttpWebSocket_SendAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_) | Sends an asynchronous binary message to the WebSocket endpoint. |
