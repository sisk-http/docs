# UrlBuilder.AddQueryIf

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddQueryIf.html

## AddQueryIf(string, string?[], bool) {#Sisk_Core_Helpers_UrlBuilder_AddQueryIf_System_String_System_String___System_Boolean_}

Conditionally adds a query parameter with multiple values to the URL.

```csharp
public UrlBuilder AddQueryIf(string key, string?[] values, bool condition)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`values` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The values of the query parameter, or an array containing [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) values to add empty values.

`condition` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The condition under which the query parameter should be added.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the query parameter added if `condition` is [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
