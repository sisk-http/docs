# UrlBuilder.SetQueryIf

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQueryIf.html

## SetQueryIf(bool, string, string?) {#Sisk_Core_Helpers_UrlBuilder_SetQueryIf_System_Boolean_System_String_System_String_}

Conditionally sets (removes and adds) a query parameter with a single value in the URL.

```csharp
public UrlBuilder SetQueryIf(bool condition, string key, string? value)
```

### Parameters

`condition` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The condition under which the query parameter should be set.

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value of the query parameter, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to add an empty value.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the query parameter set if `condition` is [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).

## SetQueryIf(bool, string, params string?[]) {#Sisk_Core_Helpers_UrlBuilder_SetQueryIf_System_Boolean_System_String_System_String___}

Conditionally sets (removes and adds) a query parameter with multiple values in the URL.

```csharp
public UrlBuilder SetQueryIf(bool condition, string key, params string?[] values)
```

### Parameters

`condition` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The condition under which the query parameter should be set.

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`values` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The values of the query parameter, or an array containing [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) values to add empty values.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the query parameter set if `condition` is [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
