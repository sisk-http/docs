# HttpServerHostContextBuilder.UseAutoScan<TModule>

Kind: Method  
Namespace: `Sisk.Core.Http.Hosting`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.UseAutoScan.html

## UseAutoScan&lt;TModule>() {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseAutoScan__1}

This method is an shortcut for calling [AutoScanModules](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md).

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming.")]
public HttpServerHostContextBuilder UseAutoScan<TModule>() where TModule : RouterModule
```

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

### Type Parameters

`TModule` 

An class which implements [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md), or the router module itself.

## UseAutoScan&lt;TModule>(Assembly) {#Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_UseAutoScan__1_System_Reflection_Assembly_}

This method is an shortcut for calling [AutoScanModules](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.md).

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming.")]
public HttpServerHostContextBuilder UseAutoScan<TModule>(Assembly t) where TModule : RouterModule
```

### Parameters

`t` [Assembly](https://learn.microsoft.com/dotnet/api/system.reflection.assembly)

The assembly where the scanning types are.

### Returns

[HttpServerHostContextBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.HttpServerHostContextBuilder.md)

### Type Parameters

`TModule` 

An class which implements [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md), or the router module itself.
