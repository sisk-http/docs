# Router.GetRouteFromPath

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteFromPath.html

## GetRouteFromPath(RouteMethod, string) {#Sisk_Core_Routing_Router_GetRouteFromPath_Sisk_Core_Routing_RouteMethod_System_String_}

Gets the first matched [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) by their HTTP method and path.

```csharp
public Route? GetRouteFromPath(RouteMethod method, string uri)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The HTTP method to match.

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL expression.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)?

## GetRouteFromPath(string) {#Sisk_Core_Routing_Router_GetRouteFromPath_System_String_}

Gets the first matched [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) by their URL path.

```csharp
public Route? GetRouteFromPath(string uri)
```

### Parameters

`uri` [string](https://learn.microsoft.com/dotnet/api/system.string)

The URL expression.

### Returns

[Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)?
