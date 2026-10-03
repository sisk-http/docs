# HttpServerHostContextBuilder.UseFileServer

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseFileServer.html

## UseFileServer(string, string) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseFileServer_System_String_System_String_}

Configures a file server to serve static files from the specified root directory for the given router path.

```csharp
public HttpServerHostContextBuilder UseFileServer(string routerPath, string fileServingRootDirectory)
```

### Parameters

`routerPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL path prefix for which the file server will respond.

`fileServingRootDirectory` [string](https://learn.microsoft.com/dotnet/api/system.string)

The local directory whose contents will be served.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance for method chaining.

## UseFileServer(string, string, IRequestHandler[]?) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseFileServer_System_String_System_String_Sisk_Core_Routing_IRequestHandler___}

Configures a file server to serve static files from the specified root directory for the given router path,
optionally applying custom request handlers.

```csharp
public HttpServerHostContextBuilder UseFileServer(string routerPath, string fileServingRootDirectory, IRequestHandler[]? requestHandlers = null)
```

### Parameters

`routerPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL path prefix for which the file server will respond.

`fileServingRootDirectory` [string](https://learn.microsoft.com/dotnet/api/system.string)

The local directory whose contents will be served.

`requestHandlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

Optional array of request handlers to process incoming requests.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance for method chaining.

## UseFileServer(string, HttpFileServerHandler, IRequestHandler[]?) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseFileServer_System_String_Sisk_Core_Http_FileSystem_HttpFileServerHandler_Sisk_Core_Routing_IRequestHandler___}

Configures a file server to serve static files using the specified [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)
for the given router path, optionally applying custom request handlers.

```csharp
public HttpServerHostContextBuilder UseFileServer(string routerPath, HttpFileServerHandler ioHandler, IRequestHandler[]? requestHandlers = null)
```

### Parameters

`routerPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL path prefix for which the file server will respond.

`ioHandler` [HttpFileServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.md)

The handler responsible for file I/O operations.

`requestHandlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

Optional array of request handlers to process incoming requests.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

The current [HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md) instance for method chaining.
