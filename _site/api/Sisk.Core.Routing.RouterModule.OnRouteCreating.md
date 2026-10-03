# RouterModule.OnRouteCreating

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnRouteCreating.html

## OnRouteCreating(Route) {#Sisk_Core_Routing_RouterModule_OnRouteCreating_Sisk_Core_Routing_Route_}

This method is called before a route is defined in the router and after it
is created in this class, so its attributes and parameters can be modified. This method must
be overloaded in the extending class and must not be called directly.

```csharp
protected virtual void OnRouteCreating(Route configuringRoute)
```

### Parameters

`configuringRoute` [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

The route being defined on the router.
