# HashCodeHelper.Combine

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.Combine.html

## Combine(params ReadOnlySpan&lt;object?>) {#Sisk_Core_Helpers_HashCodeHelper_Combine_System_ReadOnlySpan_System_Object__}

Combines the deterministic hash codes of a collection of objects into a single 64‑bit hash.

```csharp
public static ulong Combine(params ReadOnlySpan<object?> objects)
```

### Parameters

`objects` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[object](https://learn.microsoft.com/dotnet/api/system.object)?\>

The objects whose hash codes should be combined. May contain [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) entries.

### Returns

[ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

A combined 64‑bit hash value representing the supplied objects.
