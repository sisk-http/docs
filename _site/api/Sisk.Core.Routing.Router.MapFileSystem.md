# Router.MapFileSystem

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapFileSystem.html

## MapFileSystem(string, string) {#Sisk_Core_Routing_Router_MapFileSystem_System_String_System_String_}

Maps a file system route.

```csharp
public void MapFileSystem(string routePath, string rootDirectory)
```

### Parameters

`routePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path that exposes the file system handler.

`rootDirectory` [string](https://learn.microsoft.com/dotnet/api/system.string)

The root directory to serve.

## MapFileSystem(string, HttpFileServerHandler, IRequestHandler[]?) {#Sisk_Core_Routing_Router_MapFileSystem_System_String_Sisk_Core_Http_FileSystem_HttpFileServerHandler_Sisk_Core_Routing_IRequestHandler___}

Maps a file system route using a custom handler.

```csharp
public void MapFileSystem(string routePath, HttpFileServerHandler fileServerHandler, IRequestHandler[]? requestHandlers = null)
```

### Parameters

`routePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path that exposes the file system handler.

`fileServerHandler` [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)

The file system handler.

`requestHandlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

Handlers that run before or after the route action.
