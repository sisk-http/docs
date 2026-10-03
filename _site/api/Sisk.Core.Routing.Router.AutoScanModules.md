# Router.AutoScanModules

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.AutoScanModules.html

## AutoScanModules(Type, Assembly) {#Sisk_Core_Routing_Router_AutoScanModules_System_Type_System_Reflection_Assembly_}

Scans for all types that implements the specified module type and associates an instance of each type to the router.

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming.")]
public void AutoScanModules(Type moduleType, Assembly searchAssembly)
```

### Parameters

`moduleType` [Type](https://learn.microsoft.com/dotnet/api/system.type)

An class which implements [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md), or the router module itself.

`searchAssembly` [Assembly](https://learn.microsoft.com/dotnet/api/system.reflection.assembly)

The assembly to search the module type in.

## AutoScanModules&lt;TModule>(Assembly) {#Sisk_Core_Routing_Router_AutoScanModules__1_System_Reflection_Assembly_}

Scans for all types that implements `TModule` and associates an instance of each type to the router. Note that, `TModule` must be an [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) type and an accessible constructor
for each type must be present.

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming.")]
public void AutoScanModules<TModule>(Assembly assembly) where TModule : RouterModule
```

### Parameters

`assembly` [Assembly](https://learn.microsoft.com/dotnet/api/system.reflection.assembly)

The assembly to search `TModule` in.

### Type Parameters

`TModule` 

An class which implements [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md), or the router module itself.

## AutoScanModules&lt;TModule>() {#Sisk_Core_Routing_Router_AutoScanModules__1}

Scans for all types that implements `TModule` and associates an instance of each type to the router. Note
that, `TModule` must be an [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md) type and an accessible constructor
for each type must be present.

```csharp
[RequiresUnreferencedCode("This method requires access to unreferenced code, which may break AOT compilation and trimming.")]
public void AutoScanModules<TModule>() where TModule : RouterModule
```

### Type Parameters

`TModule` 

An class which implements [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md), or the router module itself.
