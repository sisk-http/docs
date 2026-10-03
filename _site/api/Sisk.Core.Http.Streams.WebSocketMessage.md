# WebSocketMessage

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.html

Represents an websocket request message received by an websocket server.

```csharp
public sealed class WebSocketMessage
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[WebSocketMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.md)

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
| [Length](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.Length.md#Sisk_Core_Http_Streams_WebSocketMessage_Length) | Gets the message length in byte count. |
| [MessageBytes](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.MessageBytes.md#Sisk_Core_Http_Streams_WebSocketMessage_MessageBytes) | Gets an byte array with the message contents. |
| [Sender](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.Sender.md#Sisk_Core_Http_Streams_WebSocketMessage_Sender) | Gets the sender [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) object instance which received this message. |

## Methods

| Name | Description |
| --- | --- |
| [GetString\(Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.GetString.md#Sisk_Core_Http_Streams_WebSocketMessage_GetString_System_Text_Encoding_) | Reads the message bytes as string using the specified encoding. |
| [GetString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.WebSocketMessage.GetString.md#Sisk_Core_Http_Streams_WebSocketMessage_GetString) | Reads the message bytes as string using the HTTP request encoding. |
