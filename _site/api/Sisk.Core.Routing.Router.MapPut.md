# Router.MapPut

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapPut.html

## MapPut(string, Delegate) {#Sisk_Core_Routing_Router_MapPut_System_String_System_Delegate_}

Maps an PUT route using the specified path and action function.

```csharp
public void MapPut(string path, Delegate action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

## MapPut(string, RouteAction) {#Sisk_Core_Routing_Router_MapPut_System_String_Sisk_Core_Routing_RouteAction_}

Maps an PUT route using the specified path and action function.

```csharp
public void MapPut(string path, RouteAction action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The route function to be called after matched.
