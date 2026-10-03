# UrlBuilder.FromCombined

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.FromCombined.html

## FromCombined(params string[]) {#Sisk_Core_Helpers_UrlBuilder_FromCombined_System_String___}

Creates a new [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance from one or more combined URLs and/or paths.

```csharp
public static UrlBuilder FromCombined(params string[] urls)
```

### Parameters

`urls` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

The URLs to combine.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

A new [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance initialized with the combined URL.
