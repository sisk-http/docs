# Route.Match

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.Match.html

## Match(string, Router) {#Sisk_Core_Routing_Route_Match_System_String_Sisk_Core_Routing_Router_}

Tests if the specified request path matches this route path. The HTTP method is validated
by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) after the path matches.

```csharp
public virtual RouteMatch Match(string requestPath, Router router)
```

### Parameters

`requestPath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The request path to test.

`router` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The router which is matching this route.

### Returns

[RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md)

A [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) with the match result and the captured route parameters.
