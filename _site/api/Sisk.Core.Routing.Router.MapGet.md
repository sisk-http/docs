# Router.MapGet

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapGet.html

## MapGet(string, Delegate) {#Sisk_Core_Routing_Router_MapGet_System_String_System_Delegate_}

Maps an GET route using the specified path and action function.

```csharp
public void MapGet(string path, Delegate action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

## MapGet(string, RouteAction) {#Sisk_Core_Routing_Router_MapGet_System_String_Sisk_Core_Routing_RouteAction_}

Maps an GET route using the specified path and action function.

```csharp
public void MapGet(string path, RouteAction action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The route function to be called after matched.
