# HttpFileServer.CreateFileSystemRouteAction

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateFileSystemRouteAction.html

## CreateFileSystemRouteAction(HttpFileServerHandler) {#Sisk_Core_Http_FileSystem_HttpFileServer_CreateFileSystemRouteAction_Sisk_Core_Http_FileSystem_HttpFileServerHandler_}

Creates a [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) delegate that uses the specified [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md) to handle requests.

```csharp
public static RouteAction CreateFileSystemRouteAction(HttpFileServerHandler ioHandler)
```

### Parameters

`ioHandler` [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)

The handler responsible for processing file-system requests.

### Returns

[RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

A [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) that invokes [HandleRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.HandleRequest.md).

## CreateFileSystemRouteAction(string, bool) {#Sisk_Core_Http_FileSystem_HttpFileServer_CreateFileSystemRouteAction_System_String_System_Boolean_}

Creates a [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) delegate that serves files from the specified root directory,
optionally allowing directory listings when no index file is present.

```csharp
public static RouteAction CreateFileSystemRouteAction(string rootDirectory, bool allowDirectoryListing = false)
```

### Parameters

`rootDirectory` [string](https://learn.microsoft.com/dotnet/api/system.string)

The root directory path to serve files from.

`allowDirectoryListing` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) to enable directory listing; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

### Returns

[RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

A [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) configured to handle file-system requests.
