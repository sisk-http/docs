# HttpHost

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.html

Represents an HTTP host that listens for incoming TCP connections and handles HTTP requests.

```csharp
public sealed class HttpHost : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpHost\(IPEndPoint\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.-ctor.md#Sisk_Cadente_HttpHost__ctor_System_Net_IPEndPoint_) | Initializes a new instance of the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) class using the specified [IPEndPoint](https://learn.microsoft.com/dotnet/api/system.net.ipendpoint). |
| [HttpHost\(int\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.-ctor.md#Sisk_Cadente_HttpHost__ctor_System_Int32_) | Initializes a new instance of the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) class using the specified port on the loopback address. |

## Properties

| Name | Description |
| --- | --- |
| [Endpoint](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Endpoint.md#Sisk_Cadente_HttpHost_Endpoint) | Gets the endpoint of the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md). |
| [Handler](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Handler.md#Sisk_Cadente_HttpHost_Handler) | Gets or sets an [HttpHostHandler](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.md) instance for this [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md). |
| [HttpsOptions](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.HttpsOptions.md#Sisk_Cadente_HttpHost_HttpsOptions) | Gets or sets the HTTPS options for secure connections. Setting an [HttpsOptions](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpsOptions.md) object in this property, the [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) will use HTTPS instead of HTTP. |
| [IsDisposed](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.IsDisposed.md#Sisk_Cadente_HttpHost_IsDisposed) | Gets a value indicating whether this [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md) has been disposed. |
| [ServerNameHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.ServerNameHeader.md#Sisk_Cadente_HttpHost_ServerNameHeader) | Gets or sets the name of the server in the header name. |
| [TimeoutManager](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.TimeoutManager.md#Sisk_Cadente_HttpHost_TimeoutManager) | Gets the [HttpHostTimeoutManager](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.md) for this [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md). |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Dispose.md#Sisk_Cadente_HttpHost_Dispose) |  |
| [\~HttpHost\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Finalize.md#Sisk_Cadente_HttpHost_Finalize) |  |
| [Start\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Start.md#Sisk_Cadente_HttpHost_Start) | Starts the HTTP host and begins listening for incoming connections. |
| [Stop\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.Stop.md#Sisk_Cadente_HttpHost_Stop) | Stops the HTTP host from listening for incoming HTTP requests. |
