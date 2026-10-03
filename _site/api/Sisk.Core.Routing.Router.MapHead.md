# Router.MapHead

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MapHead.html

## MapHead(string, Delegate) {#Sisk_Core_Routing_Router_MapHead_System_String_System_Delegate_}

Maps an HEAD route using the specified path and action function.

```csharp
public void MapHead(string path, Delegate action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

## MapHead(string, RouteAction) {#Sisk_Core_Routing_Router_MapHead_System_String_Sisk_Core_Routing_RouteAction_}

Maps an HEAD route using the specified path and action function.

```csharp
public void MapHead(string path, RouteAction action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The route function to be called after matched.
