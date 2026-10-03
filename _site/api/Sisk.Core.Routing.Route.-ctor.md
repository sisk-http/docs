# Route constructor

Kind: Constructor  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.-ctor.html

## Route(RouteMethod, string, Delegate?) {#Sisk_Core_Routing_Route__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_Delegate_}

Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with given parameters.

```csharp
public Route(RouteMethod method, string path, Delegate? action)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The matching HTTP method. If it is "Any", the route will just use the path expression to be matched, not the HTTP method.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path expression that will be interpreted by the router and validated by the requests.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)?

The function that is called after the route is matched with the request.

## Route(RouteMethod, string, string?, Delegate?, IRequestHandler[]?) {#Sisk_Core_Routing_Route__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_String_System_Delegate_Sisk_Core_Routing_IRequestHandler___}

Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with given parameters.

```csharp
public Route(RouteMethod method, string path, string? name, Delegate? action, IRequestHandler[]? handlers)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The matching HTTP method. If it is "Any", the route will just use the path expression to be matched, not the HTTP method.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path expression that will be interpreted by the router and validated by the requests.

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The route name. It allows it to be found by other routes and makes it easier to create links.

`action` [Delegate](https://learn.microsoft.com/dotnet/api/system.delegate)?

The function that is called after the route is matched with the request.

`handlers` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

The RequestHandlers to run before the route's Action.

## Route() {#Sisk_Core_Routing_Route__ctor}

Creates an new [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instance with no parameters.

```csharp
public Route()
```
