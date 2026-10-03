# Route.UseRegex

Kind: Property  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.UseRegex.html

## UseRegex {#Sisk_Core_Routing_Route_UseRegex}

Gets if this route is interpreted as an regular expression. This property is kept for compatibility
and is only [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) for [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) instances.

```csharp
[Obsolete("Use RegexRoute to create regex routes, or check if the route is an RegexRoute.")]
public bool UseRegex { get; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
