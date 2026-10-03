# UrlBuilder.SetQuery

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetQuery.html

## SetQuery(string, params string?[]) {#Sisk_Core_Helpers_UrlBuilder_SetQuery_System_String_System_String___}

Sets (removes and adds) a query parameter with multiple values in the URL.

```csharp
public UrlBuilder SetQuery(string key, params string?[] values)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`values` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The values of the query parameter.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the query parameter set.

## SetQuery(string, string?) {#Sisk_Core_Helpers_UrlBuilder_SetQuery_System_String_System_String_}

Sets (removes and adds) a query parameter with a single value in the URL.

```csharp
public UrlBuilder SetQuery(string key, string? value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value of the query parameter, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to add an empty value.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the query parameter set.
