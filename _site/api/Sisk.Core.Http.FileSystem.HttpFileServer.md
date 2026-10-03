# HttpFileServer

Kind: Class  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.html

Provides static factory methods for creating route actions that serve files and directories from the local file system.

```csharp
public static class HttpFileServer
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpFileServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Methods

| Name | Description |
| --- | --- |
| [CreateFileSystemRouteAction\(HttpFileServerHandler\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateFileSystemRouteAction.md#Sisk_Core_Http_FileSystem_HttpFileServer_CreateFileSystemRouteAction_Sisk_Core_Http_FileSystem_HttpFileServerHandler_) | Creates a [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) delegate that uses the specified [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md) to handle requests. |
| [CreateFileSystemRouteAction\(string, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateFileSystemRouteAction.md#Sisk_Core_Http_FileSystem_HttpFileServer_CreateFileSystemRouteAction_System_String_System_Boolean_) | Creates a [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) delegate that serves files from the specified root directory, optionally allowing directory listings when no index file is present. |
| [CreateServingRoute\(string, HttpFileServerHandler, IRequestHandler\[\]?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateServingRoute.md#Sisk_Core_Http_FileSystem_HttpFileServer_CreateServingRoute_System_String_Sisk_Core_Http_FileSystem_HttpFileServerHandler_Sisk_Core_Routing_IRequestHandler___) | Creates a [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) that serves files and directories from the specified base path using the provided [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md). |
| [CreateServingRoute\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateServingRoute.md#Sisk_Core_Http_FileSystem_HttpFileServer_CreateServingRoute_System_String_System_String_) | Creates a [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) that serves files and directories from the specified base path and root directory. |
