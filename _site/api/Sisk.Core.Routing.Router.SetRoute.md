# Router.SetRoute

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.SetRoute.html

## SetRoute(RouteMethod, string, RouteAction) {#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_Sisk_Core_Routing_RouteAction_}

Defines an route with their method, path and action function.

```csharp
public void SetRoute(RouteMethod method, string path, RouteAction action)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to be matched. "Any" means any method that matches their path.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The route function to be called after matched.

## SetRoute(RouteMethod, string, Delegate) {#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_}

Defines an route with their method, path and action function.

```csharp
public void SetRoute(RouteMethod method, string path, Delegate action)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to be matched. "Any" means any method that matches their path.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

## SetRoute(RouteMethod, string, Delegate, string?) {#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_System_String_}

Defines an route with their method, path, action function and name.

```csharp
public void SetRoute(RouteMethod method, string path, Delegate action, string? name)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to be matched. "Any" means any method that matches their path.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The route name.

## SetRoute(RouteMethod, string, Delegate, string?, IRequestHandler[]) {#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_System_String_Sisk_Core_Routing_IRequestHandler___}

Defines an route with their method, path, action function, name and request handlers.

```csharp
public void SetRoute(RouteMethod method, string path, Delegate action, string? name, IRequestHandler[] middlewares)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route method to be matched. "Any" means any method that matches their path.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route path.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)

The route function to be called after matched.

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The route name.

`middlewares` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]

Handlers that run before calling your route action.

## SetRoute(Route) {#Sisk_Core_Routing_Router_SetRoute_Sisk_Core_Routing_Route_}

Defines an route in this Router instance.

```csharp
public void SetRoute(Route r)
```

### Parameters

`r` [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md)

The route to be defined in the Router.
