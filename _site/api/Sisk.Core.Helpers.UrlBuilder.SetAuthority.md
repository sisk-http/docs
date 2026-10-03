# UrlBuilder.SetAuthority

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.SetAuthority.html

## SetAuthority(string) {#Sisk_Core_Helpers_UrlBuilder_SetAuthority_System_String_}

Sets the authority part of the URL.

```csharp
public UrlBuilder SetAuthority(string authority)
```

### Parameters

`authority` [string](https://learn.microsoft.com/dotnet/api/system.string)

The authority to set.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown if `authority` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).
