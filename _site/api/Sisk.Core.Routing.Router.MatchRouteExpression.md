# Router.MatchRouteExpression

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRouteExpression.html

## MatchRouteExpression(in ReadOnlySpan&lt;char>, in ReadOnlySpan&lt;char>, StringComparison) {#Sisk_Core_Routing_Router_MatchRouteExpression_System_ReadOnlySpan_System_Char___System_ReadOnlySpan_System_Char___System_StringComparison_}

Attempts to match the specified route expression against the given path.

```csharp
public static RouteMatch MatchRouteExpression(in ReadOnlySpan<char> routeExpression, in ReadOnlySpan<char> path, StringComparison stringComparer = StringComparison.Ordinal)
```

### Parameters

`routeExpression` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The route expression to match.

`path` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The path to match against the route expression.

`stringComparer` [StringComparison](https://learn.microsoft.com/dotnet/api/system.stringcomparison)

The string comparison to use when matching the route expression. Defaults to [Ordinal](https://learn.microsoft.com/dotnet/api/system.stringcomparison.ordinal).

### Returns

[RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md)

A [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) object indicating the result of the match.

## MatchRouteExpression(string, string, StringComparison) {#Sisk_Core_Routing_Router_MatchRouteExpression_System_String_System_String_System_StringComparison_}

Attempts to match the specified route expression against the given path.

```csharp
public static RouteMatch MatchRouteExpression(string routeExpression, string path, StringComparison stringComparer = StringComparison.Ordinal)
```

### Parameters

`routeExpression` [string](https://learn.microsoft.com/dotnet/api/system.string)

The route expression to match.

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)

The path to match against the route expression.

`stringComparer` [StringComparison](https://learn.microsoft.com/dotnet/api/system.stringcomparison)

The string comparison to use when matching the route expression. Defaults to [Ordinal](https://learn.microsoft.com/dotnet/api/system.stringcomparison.ordinal).

### Returns

[RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md)

A [RouteMatch](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMatch.md) object indicating the result of the match.
