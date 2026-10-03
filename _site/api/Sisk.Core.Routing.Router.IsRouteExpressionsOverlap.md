# Router.IsRouteExpressionsOverlap

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.IsRouteExpressionsOverlap.html

## IsRouteExpressionsOverlap(in ReadOnlySpan&lt;char>, in ReadOnlySpan&lt;char>, StringComparison) {#Sisk_Core_Routing_Router_IsRouteExpressionsOverlap_System_ReadOnlySpan_System_Char___System_ReadOnlySpan_System_Char___System_StringComparison_}

Determines whether two route expressions overlap.

```csharp
public static bool IsRouteExpressionsOverlap(in ReadOnlySpan<char> routeExpression1, in ReadOnlySpan<char> routeExpression2, StringComparison stringComparer = StringComparison.Ordinal)
```

### Parameters

`routeExpression1` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The first route expression to compare.

`routeExpression2` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The second route expression to compare.

`stringComparer` [StringComparison](https://learn.microsoft.com/dotnet/api/system.stringcomparison)

The string comparison to use when comparing the route expressions. Defaults to [Ordinal](https://learn.microsoft.com/dotnet/api/system.stringcomparison.ordinal).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

`true` if the route expressions overlap; otherwise, `false`.

## IsRouteExpressionsOverlap(string, string, StringComparison) {#Sisk_Core_Routing_Router_IsRouteExpressionsOverlap_System_String_System_String_System_StringComparison_}

Determines whether two route expressions overlap.

```csharp
public static bool IsRouteExpressionsOverlap(string routeExpression1, string routeExpression2, StringComparison stringComparer = StringComparison.Ordinal)
```

### Parameters

`routeExpression1` [string](https://learn.microsoft.com/dotnet/api/system.string)

The first route expression to compare.

`routeExpression2` [string](https://learn.microsoft.com/dotnet/api/system.string)

The second route expression to compare.

`stringComparer` [StringComparison](https://learn.microsoft.com/dotnet/api/system.stringcomparison)

The string comparison to use when comparing the route expressions. Defaults to [Ordinal](https://learn.microsoft.com/dotnet/api/system.stringcomparison.ordinal).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

`true` if the route expressions overlap; otherwise, `false`.
