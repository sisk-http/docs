# RegexRouteAttribute constructor

Kind: Constructor  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRouteAttribute.-ctor.html

## RegexRouteAttribute(RouteMethod, string) {#Sisk_Core_Routing_RegexRouteAttribute__ctor_Sisk_Core_Routing_RouteMethod_System_String_}

Creates an new [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md) attribute instance with given path.

```csharp
public RegexRouteAttribute(RouteMethod method, string pattern)
```

### Parameters

`method` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The route entry point method.

`pattern` [string](https://learn.microsoft.com/dotnet/api/system.string)

The Regex pattern which will match the route.
