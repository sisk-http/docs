# UrlBuilder.AddSegmentIf

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegmentIf.html

## AddSegmentIf(string, bool) {#Sisk_Core_Helpers_UrlBuilder_AddSegmentIf_System_String_System_Boolean_}

Conditionally adds a segment to the URL path.

```csharp
public UrlBuilder AddSegmentIf(string segment, bool condition)
```

### Parameters

`segment` [string](https://learn.microsoft.com/dotnet/api/system.string)

The segment to add.

`condition` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

The condition under which the segment should be added.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the segment added if `condition` is [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
