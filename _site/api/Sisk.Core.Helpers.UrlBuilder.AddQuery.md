# UrlBuilder.AddQuery

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddQuery.html

## AddQuery(string, string?) {#Sisk_Core_Helpers_UrlBuilder_AddQuery_System_String_System_String_}

Adds a query parameter to the URL.

```csharp
public UrlBuilder AddQuery(string key, string? value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value of the query parameter, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to add an empty value.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.

## AddQuery(string, params string?[]) {#Sisk_Core_Helpers_UrlBuilder_AddQuery_System_String_System_String___}

Adds a query parameter with multiple values to the URL.

```csharp
public UrlBuilder AddQuery(string key, params string?[] values)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the query parameter.

`values` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The values of the query parameter, or an array containing [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) values to add empty values.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.
