# HttpServerHostContextBuilder.UseListeningPort

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseListeningPort.html

## UseListeningPort(ushort) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseListeningPort_System_UInt16_}

Sets the main [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) of this host builder.

```csharp
public HttpServerHostContextBuilder UseListeningPort(ushort port)
```

### Parameters

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

The port the server will listen on.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseListeningPort(string) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseListeningPort_System_String_}

Sets the main [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) of this host builder.

```csharp
public HttpServerHostContextBuilder UseListeningPort(string uri)
```

### Parameters

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URI component that will be parsed to the listening port format.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseListeningPort(ListeningPort) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseListeningPort_Sisk_Core_Http_ListeningPort_}

Sets the main [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) of this host builder.

```csharp
public HttpServerHostContextBuilder UseListeningPort(ListeningPort listeningPort)
```

### Parameters

`listeningPort` [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md)

The [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) object which the HTTP server will listen to.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
