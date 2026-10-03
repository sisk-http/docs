# HttpServerHostContext

Kind: Class  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.html

Represents the class that hosts most of the components needed to run a Sisk application.

```csharp
public sealed class HttpServerHostContext : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md)

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
| [AccessLogs](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.AccessLogs.md#Sisk_Core_Http_Hosting_HttpServerHostContext_AccessLogs) | Gets the configured access log stream. This property is inherited from [ServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.ServerConfiguration.md). |
| [CrossOriginResourceSharingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.CrossOriginResourceSharingPolicy.md#Sisk_Core_Http_Hosting_HttpServerHostContext_CrossOriginResourceSharingPolicy) | Gets the host [CrossOriginResourceSharingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.CrossOriginResourceSharingPolicy.md). |
| [ErrorLogs](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.ErrorLogs.md#Sisk_Core_Http_Hosting_HttpServerHostContext_ErrorLogs) | Gets the configured error log stream. This property is inherited from [ServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.ServerConfiguration.md). |
| [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.HttpServer.md#Sisk_Core_Http_Hosting_HttpServerHostContext_HttpServer) | Gets the host HTTP server. |
| [Parameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.Parameters.md#Sisk_Core_Http_Hosting_HttpServerHostContext_Parameters) | Gets the initialization parameters from the portable configuration file. |
| [Router](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.Router.md#Sisk_Core_Http_Hosting_HttpServerHostContext_Router) | Gets the host router. |
| [ServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.ServerConfiguration.md#Sisk_Core_Http_Hosting_HttpServerHostContext_ServerConfiguration) | Gets the host server configuration. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.Dispose.md#Sisk_Core_Http_Hosting_HttpServerHostContext_Dispose) | Invalidates this class and releases the resources used by it, and permanently closes the HTTP server. |
| [Start\(bool, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.Start.md#Sisk_Core_Http_Hosting_HttpServerHostContext_Start_System_Boolean_System_Boolean_) | Starts the HTTP server. |
| [StartAsync\(bool, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.StartAsync.md#Sisk_Core_Http_Hosting_HttpServerHostContext_StartAsync_System_Boolean_System_Boolean_) | Asynchronously starts the HTTP server. |
