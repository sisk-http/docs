# HttpServerEngineWebSocket

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.html

Provides an abstract base class for WebSocket contexts.

```csharp
public abstract class HttpServerEngineWebSocket : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpServerEngineWebSocket\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.-ctor.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [State](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.State.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_State) | Gets the state of the WebSocket. |

## Methods

| Name | Description |
| --- | --- |
| [CloseAsync\(WebSocketCloseStatus, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.CloseAsync.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_CloseAsync_System_Net_WebSockets_WebSocketCloseStatus_System_String_System_Threading_CancellationToken_) | Closes the WebSocket connection asynchronously. |
| [CloseOutputAsync\(WebSocketCloseStatus, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.CloseOutputAsync.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_CloseOutputAsync_System_Net_WebSockets_WebSocketCloseStatus_System_String_System_Threading_CancellationToken_) | Closes the output stream of the WebSocket asynchronously. |
| [CreateFromWebSocket\(WebSocket\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.CreateFromWebSocket.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_CreateFromWebSocket_System_Net_WebSockets_WebSocket_) | Creates a concrete [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md) instance from the specified [WebSocket](https://learn.microsoft.com/dotnet/api/system.net.websockets.websocket). |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.Dispose.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_Dispose) | Releases the resources associated with this WebSocket context. |
| [ReceiveAsync\(Memory<byte\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.ReceiveAsync.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_ReceiveAsync_System_Memory_System_Byte__System_Threading_CancellationToken_) | Receives data from the WebSocket asynchronously. |
| [SendAsync\(ReadOnlyMemory<byte\>, WebSocketMessageType, bool, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.SendAsync.md#Sisk_Core_Http_Engine_HttpServerEngineWebSocket_SendAsync_System_ReadOnlyMemory_System_Byte__System_Net_WebSockets_WebSocketMessageType_System_Boolean_System_Threading_CancellationToken_) | Sends data over the WebSocket asynchronously. |
