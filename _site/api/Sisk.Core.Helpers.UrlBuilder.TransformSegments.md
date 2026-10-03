# UrlBuilder.TransformSegments

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.TransformSegments.html

## TransformSegments(Func&lt;string, string?>) {#Sisk_Core_Helpers_UrlBuilder_TransformSegments_System_Func_System_String_System_String__}

Applies a transformation function to each URL segment.

```csharp
public UrlBuilder TransformSegments(Func<string, string?> fn)
```

### Parameters

`fn` [Func](https://learn.microsoft.com/dotnet/api/system.func\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)?\>

A function that takes a segment as input and returns the transformed segment, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to remove the segment.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance, with the segments transformed.
