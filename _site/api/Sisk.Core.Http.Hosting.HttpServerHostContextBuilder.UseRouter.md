# HttpServerHostContextBuilder.UseRouter

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseRouter.html

## UseRouter(Action&lt;Router>) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseRouter_System_Action_Sisk_Core_Routing_Router__}

Calls an action that has an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance from the host HTTP server.

```csharp
public HttpServerHostContextBuilder UseRouter(Action<Router> handler)
```

### Parameters

`handler` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)\>

An action where the first argument is the main [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) object.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

## UseRouter(Router) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseRouter_Sisk_Core_Routing_Router_}

Sets an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) instance in the current listening host.

```csharp
public HttpServerHostContextBuilder UseRouter(Router r)
```

### Parameters

`r` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) to the current host builder.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)
