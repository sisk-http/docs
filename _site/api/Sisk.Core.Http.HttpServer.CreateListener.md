# HttpServer.CreateListener

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateListener.html

## CreateListener() {#Sisk_Core_Http_HttpServer_CreateListener}

Gets an listening and running HTTP server in an random port.

```csharp
public static HttpServer CreateListener()
```

### Returns

[HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

## CreateListener(ushort) {#Sisk_Core_Http_HttpServer_CreateListener_System_UInt16_}

Gets an listening and running HTTP server in the specified port.

```csharp
public static HttpServer CreateListener(ushort port)
```

### Parameters

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The listening port of the HTTP server.

### Returns

[HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)

## CreateListener(ushort, out HttpServerConfiguration, out ListeningHost, out Router) {#Sisk_Core_Http_HttpServer_CreateListener_System_UInt16_Sisk_Core_Http_HttpServerConfiguration__Sisk_Core_Http_ListeningHost__Sisk_Core_Routing_Router__}

Gets an listening and running HTTP server in the specified port.

```csharp
public static HttpServer CreateListener(ushort insecureHttpPort, out HttpServerConfiguration configuration, out ListeningHost host, out Router router)
```

### Parameters

`insecureHttpPort` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The insecure port where the HTTP server will listen.

`configuration` [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md)

The [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md) object issued from this method.

`host` [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md)

The [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) object issued from this method.

`router` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) object issued from this method.

### Returns

[HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md)
