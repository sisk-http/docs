# HttpHostContext

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.html

Represents an HTTP session that manages the request and response for a single connection.

```csharp
public sealed class HttpHostContext
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHostContext](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.md)

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
| [Client](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.Client.md#Sisk_Cadente_HttpHostContext_Client) | Gets the associated [HttpHostClient](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostClient.md) with this HTTP context. |
| [Host](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.Host.md#Sisk_Cadente_HttpHostContext_Host) | Gets the associated [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) which created this HTTP context. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.KeepAlive.md#Sisk_Cadente_HttpHostContext_KeepAlive) | Gets or sets a value indicating whether the connection should be kept alive. |
| [Request](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.Request.md#Sisk_Cadente_HttpHostContext_Request) | Gets the HTTP request associated with this session. |
| [Response](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.Response.md#Sisk_Cadente_HttpHostContext_Response) | Gets the HTTP response associated with this session. |

## Methods

| Name | Description |
| --- | --- |
| [Abort\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.Abort.md#Sisk_Cadente_HttpHostContext_Abort) | Aborts the underlying network stream, forcibly closing the connection. |
