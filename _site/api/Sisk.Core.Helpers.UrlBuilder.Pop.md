# UrlBuilder.Pop

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.Pop.html

## Pop(int) {#Sisk_Core_Helpers_UrlBuilder_Pop_System_Int32_}

Removes the last segment(s) from the URL path.

```csharp
public UrlBuilder Pop(int amount = 1)
```

### Parameters

`amount` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The number of segments to remove. Defaults to 1 if not specified.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.

### Exceptions

[ArgumentOutOfRangeException](https://learn.microsoft.com/dotnet/api/system.argumentoutofrangeexception)

Thrown if `amount` is negative.
