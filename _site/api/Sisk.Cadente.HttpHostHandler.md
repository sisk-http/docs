# HttpHostHandler

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.html

Provides a base class for handling HTTP host events.

```csharp
public abstract class HttpHostHandler
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHostHandler](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.md)

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
| [HttpHostHandler\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.-ctor.md#Sisk_Cadente_HttpHostHandler__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [OnClientConnectedAsync\(HttpHost, HttpHostClient\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnClientConnectedAsync.md#Sisk_Cadente_HttpHostHandler_OnClientConnectedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostClient_) | Called when a new client connects to the specified HTTP host. |
| [OnClientDisconnectedAsync\(HttpHost, HttpHostClient\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnClientDisconnectedAsync.md#Sisk_Cadente_HttpHostHandler_OnClientDisconnectedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostClient_) | Called when a client disconnects from the specified HTTP host. |
| [OnContextCreatedAsync\(HttpHost, HttpHostContext\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnContextCreatedAsync.md#Sisk_Cadente_HttpHostHandler_OnContextCreatedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostContext_) | Called when a new context is created for the specified HTTP host. |
