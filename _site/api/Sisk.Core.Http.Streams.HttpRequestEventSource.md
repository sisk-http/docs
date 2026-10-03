# HttpRequestEventSource

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.html

An [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instance opens a persistent connection to the request, which sends events in text/event-stream format.

```csharp
public sealed class HttpRequestEventSource : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)

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
| [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.HttpRequest.md#Sisk_Core_Http_Streams_HttpRequestEventSource_HttpRequest) | Gets the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object which created this Event Source instance. |
| [Identifier](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Identifier.md#Sisk_Core_Http_Streams_HttpRequestEventSource_Identifier) | Gets an unique identifier label to this EventStream connection, useful for finding this connection's reference later. |
| [IsActive](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.IsActive.md#Sisk_Core_Http_Streams_HttpRequestEventSource_IsActive) | Gets an boolean indicating if this connection is open and this instance can send messages. |
| [PingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.PingPolicy.md#Sisk_Core_Http_Streams_HttpRequestEventSource_PingPolicy) | Gets the [HttpStreamPingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.md) for this HTTP event source connection. |
| [SentContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SentContentLength.md#Sisk_Core_Http_Streams_HttpRequestEventSource_SentContentLength) | Gets an integer indicating the total bytes sent by this instance to the client. |

## Methods

| Name | Description |
| --- | --- |
| [AppendHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader.md#Sisk_Core_Http_Streams_HttpRequestEventSource_AppendHeader_System_String_System_String_) | Sends an header to the streaming context. |
| [Cancel\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel.md#Sisk_Core_Http_Streams_HttpRequestEventSource_Cancel) | Cancels the sending queue from sending pending messages and clears the queue. |
| [Close\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Close.md#Sisk_Core_Http_Streams_HttpRequestEventSource_Close) | Closes the event listener and it's connection. |
| [CloseAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync.md#Sisk_Core_Http_Streams_HttpRequestEventSource_CloseAsync) | Asynchronously closes the event listener and its connection. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Dispose.md#Sisk_Core_Http_Streams_HttpRequestEventSource_Dispose) | Releases the used resources of this class instance. |
| [KeepAlive\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.KeepAlive.md#Sisk_Core_Http_Streams_HttpRequestEventSource_KeepAlive) | Keeps the event source alive indefinitely. |
| [Send\(string?, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Send.md#Sisk_Core_Http_Streams_HttpRequestEventSource_Send_System_String_System_String_) | Sends an event to the client over the HTTP connection. |
| [SendAsync\(string?, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync.md#Sisk_Core_Http_Streams_HttpRequestEventSource_SendAsync_System_String_System_String_) | Asynchronously sends an event to the client over the HTTP connection. |
| [WaitForFail\(TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail.md#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFail_System_TimeSpan_) | Waits for the event source to fail or reach the specified idle tolerance. |
| [WaitForFailAsync\(TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFailAsync.md#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFailAsync_System_TimeSpan_) | Asynchronously waits for the event source to fail or reach the specified idle tolerance. |
| [WaitForFailAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFailAsync.md#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFailAsync_System_Threading_CancellationToken_) | Asynchronously waits for the event source to fail or be canceled. |
| [WithPing\(Action<HttpStreamPingPolicy\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WithPing.md#Sisk_Core_Http_Streams_HttpRequestEventSource_WithPing_System_Action_Sisk_Core_Http_Streams_HttpStreamPingPolicy__) | Configures the ping policy for this instance of HTTP Event Source. |
