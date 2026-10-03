# HttpStreamPingPolicy

Kind: Class  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.html

Provides an automatic ping sender for HTTP Event Source connections.

```csharp
public sealed class HttpStreamPingPolicy : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpStreamPingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.md)

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
| [DataMessage](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.DataMessage.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_DataMessage) | Gets or sets the payload message that is sent to the server as a ping message. |
| [Interval](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Interval.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Interval) | Gets or sets the sending interval for each ping message. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Dispose.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Dispose) |  |
| [\~HttpStreamPingPolicy\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Finalize.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Finalize) |  |
| [Start\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Start.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Start) | Starts sending periodic pings to the client. |
| [Start\(string, TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Start.md#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Start_System_String_System_TimeSpan_) | Configures and starts sending periodic pings to the client. |
