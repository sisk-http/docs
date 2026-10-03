# HttpServer.CreateBuilder

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.CreateBuilder.html

## CreateBuilder(Action&lt;HttpServerHostContextBuilder>) {#Sisk_Core_Http_HttpServer_CreateBuilder_System_Action_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder__}

Builds an [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context invoking the handler on it.

```csharp
public static HttpServerHostContextBuilder CreateBuilder(Action<HttpServerHostContextBuilder> handler)
```

### Parameters

`handler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)\>

The action which will configure the host context.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## CreateBuilder(ushort) {#Sisk_Core_Http_HttpServer_CreateBuilder_System_UInt16_}

Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context with predefined listening port.

```csharp
public static HttpServerHostContextBuilder CreateBuilder(ushort port)
```

### Parameters

`port` [ushort](https://learn.microsoft.com/dotnet/api/system.uint16)

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## CreateBuilder(string) {#Sisk_Core_Http_HttpServer_CreateBuilder_System_String_}

Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context with predefined listening host string.

```csharp
public static HttpServerHostContextBuilder CreateBuilder(string listeningHost)
```

### Parameters

`listeningHost` [string](https://learn.microsoft.com/dotnet/api/system.string)

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## CreateBuilder() {#Sisk_Core_Http_HttpServer_CreateBuilder}

Builds an empty [HttpServerHostContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContext.md) context.

```csharp
public static HttpServerHostContextBuilder CreateBuilder()
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
