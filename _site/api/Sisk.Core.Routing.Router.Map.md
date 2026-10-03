# Router.Map

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.Map.html

## Map(Route) {#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_Route_}

Maps a route into this router.

```csharp
public void Map(Route route)
```

### Parameters

`route` [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

The route to map.

## Map(IEnumerable&lt;Route>) {#Sisk_Core_Routing_Router_Map_System_Collections_Generic_IEnumerable_Sisk_Core_Routing_Route__}

Maps a collection of routes into this router.

```csharp
public void Map(IEnumerable<Route> routes)
```

### Parameters

`routes` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)\>

The routes to map.

## Map(RouteMethod, string, Delegate?) {#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_}

Maps a route using the specified method, path and action.

```csharp
public void Map(RouteMethod method, string path, Delegate? action)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to match.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)?

The route action.

## Map(RouteMethod, string, Delegate?, IRequestHandler[]?) {#Sisk_Core_Routing_Router_Map_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_Sisk_Core_Routing_IRequestHandler___}

Maps a route using the specified method, path, action and request handlers.

```csharp
public void Map(RouteMethod method, string path, Delegate? action, IRequestHandler[]? requestHandlers = null)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to match.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)?

The route action.

`requestHandlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

Handlers that run before or after the route action.
