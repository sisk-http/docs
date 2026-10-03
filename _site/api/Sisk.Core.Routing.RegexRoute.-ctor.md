# RegexRoute constructor

Kind: Constructor  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.-ctor.html

## RegexRoute() {#Sisk_Core_Routing_RegexRoute__ctor}

Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class with no parameters.

```csharp
public RegexRoute()
```

## RegexRoute(RouteMethod, string, RouteAction) {#Sisk_Core_Routing_RegexRoute__ctor_Sisk_Core_Routing_RouteMethod_System_String_Sisk_Core_Routing_RouteAction_}

Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class.

```csharp
public RegexRoute(RouteMethod method, string pattern, RouteAction action)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The HTTP method for this route.

`pattern` [string](https://learn.microsoft.com/dotnet/api/system.string)

The regular expression pattern for this route.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The action to be executed when this route is matched.

## RegexRoute(RouteMethod, string, string?, RouteAction, IRequestHandler[]?) {#Sisk_Core_Routing_RegexRoute__ctor_Sisk_Core_Routing_RouteMethod_System_String_System_String_Sisk_Core_Routing_RouteAction_Sisk_Core_Routing_IRequestHandler___}

Initializes a new instance of the [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class.

```csharp
public RegexRoute(RouteMethod method, string pattern, string? name, RouteAction action, IRequestHandler[]? beforeCallback)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The HTTP method for this route.

`pattern` [string](https://learn.microsoft.com/dotnet/api/system.string)

The regular expression pattern for this route.

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The name of this route.

`action` [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)

The action to be executed when this route is matched.

`beforeCallback` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)\[\]?

The callback to be executed before the action.
