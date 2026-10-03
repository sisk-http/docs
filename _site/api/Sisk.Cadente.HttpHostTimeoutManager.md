# HttpHostTimeoutManager

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.html

Manages timeouts for HTTP hosts.

```csharp
public sealed class HttpHostTimeoutManager
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHostTimeoutManager](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.md)

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
| [BodyDrainTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.BodyDrainTimeout.md#Sisk_Cadente_HttpHostTimeoutManager_BodyDrainTimeout) | Gets or sets the maximum duration to wait for draining the request or response body before timing out. |
| [ClientReadTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.ClientReadTimeout.md#Sisk_Cadente_HttpHostTimeoutManager_ClientReadTimeout) | Gets or sets the timeout for client read operations. |
| [ClientWriteTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.ClientWriteTimeout.md#Sisk_Cadente_HttpHostTimeoutManager_ClientWriteTimeout) | Gets or sets the timeout for client write operations. |
| [HeaderParsingTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.HeaderParsingTimeout.md#Sisk_Cadente_HttpHostTimeoutManager_HeaderParsingTimeout) | Gets or sets the timeout for HTTP header parsing operations. |
| [SslHandshakeTimeout](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.SslHandshakeTimeout.md#Sisk_Cadente_HttpHostTimeoutManager_SslHandshakeTimeout) | Gets or sets the timeout for SSL/TLS handshake operations. |
