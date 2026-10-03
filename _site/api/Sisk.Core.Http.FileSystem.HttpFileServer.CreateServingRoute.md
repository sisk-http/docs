# HttpFileServer.CreateServingRoute

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServer.CreateServingRoute.html

## CreateServingRoute(string, HttpFileServerHandler, IRequestHandler[]?) {#Sisk_Core_Http_FileSystem_HttpFileServer_CreateServingRoute_System_String_Sisk_Core_Http_FileSystem_HttpFileServerHandler_Sisk_Core_Routing_IRequestHandler___}

Creates a [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) that serves files and directories from the specified base path using the provided [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md).

```csharp
public static Route CreateServingRoute(string basePath, HttpFileServerHandler ioHandler, IRequestHandler[]? requestHandlers = null)
```

### Parameters

`basePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The base path under which the route will respond.

`ioHandler` [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)

The handler responsible for processing file-system requests.

`requestHandlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

Optional array of additional request handlers to apply to the route.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

A configured [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance.

## CreateServingRoute(string, string) {#Sisk_Core_Http_FileSystem_HttpFileServer_CreateServingRoute_System_String_System_String_}

Creates a [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) that serves files and directories from the specified base path and root directory.

```csharp
public static Route CreateServingRoute(string basePath, string rootDirectory)
```

### Parameters

`basePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The base path under which the route will respond.

`rootDirectory` [string](https://learn.microsoft.com/dotnet/api/system.string)

The root directory path to serve files from.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

A configured [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance.
