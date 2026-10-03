# Route.Query

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Query.html

## Query(string, Delegate?) {#Sisk_Core_Routing_Route_Query_System_String_System_Delegate_}

Creates a route that responds to HTTP QUERY requests.

```csharp
public static Route Query(string path, Delegate? action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL path for the route.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)?

The action to be executed when the route is matched.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

A [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) object configured for QUERY requests.

## Query(string, RouteAction) {#Sisk_Core_Routing_Route_Query_System_String_Sisk_Core_Routing_RouteAction_}

Creates a route that responds to HTTP QUERY requests.

```csharp
public static Route Query(string path, RouteAction action)
```

### Parameters

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL path for the route.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The action to be executed when the route is matched.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

A [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) object configured for QUERY requests.
