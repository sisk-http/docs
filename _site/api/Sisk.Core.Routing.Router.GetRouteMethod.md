# Router.GetRouteMethod

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.GetRouteMethod.html

## GetRouteMethod(HttpMethod, RouteMethod) {#Sisk_Core_Routing_Router_GetRouteMethod_System_Net_Http_HttpMethod_Sisk_Core_Routing_RouteMethod_}

Gets the corresponding [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) for a given [HttpMethod](https://learn.microsoft.com/dotnet/api/system.net.http.httpmethod), with a fallback option.

```csharp
public static RouteMethod GetRouteMethod(HttpMethod httpMethod, RouteMethod fallback = RouteMethod.Get)
```

### Parameters

`httpMethod` [HttpMethod](https://learn.microsoft.com/dotnet/api/system.net.http.httpmethod)

The [HttpMethod](https://learn.microsoft.com/dotnet/api/system.net.http.httpmethod) to convert.

`fallback` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) to return if no direct mapping is found. Defaults to [Get](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md).

### Returns

[RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The mapped [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) or the fallback value.

## GetRouteMethod(string, RouteMethod) {#Sisk_Core_Routing_Router_GetRouteMethod_System_String_Sisk_Core_Routing_RouteMethod_}

Gets the corresponding [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) for a given HTTP method string, with a fallback option.

```csharp
public static RouteMethod GetRouteMethod(string httpMethod, RouteMethod fallback = RouteMethod.Get)
```

### Parameters

`httpMethod` [string](https://learn.microsoft.com/dotnet/api/system.string)

The HTTP method string (e.g., "GET", "POST") to convert.

`fallback` [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) to return if no direct mapping is found. Defaults to [Get](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md).

### Returns

[RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md)

The mapped [RouteMethod](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) or the fallback value.
