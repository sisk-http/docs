# UrlBuilder.AddSegment

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.AddSegment.html

## AddSegment(string?[], bool) {#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String___System_Boolean_}

Adds one or more segments to the URL path.

```csharp
public UrlBuilder AddSegment(string?[] segments, bool allowRelativeReturns = false)
```

### Parameters

`segments` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The segments to add, or an array containing [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) values to indicate relative URLs.

`allowRelativeReturns` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

If [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool), allows the addition of relative URLs that return to a parent directory.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.

## AddSegment(params string?[]) {#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String___}

Adds one or more segments to the URL path.

```csharp
public UrlBuilder AddSegment(params string?[] segments)
```

### Parameters

`segments` [string](https://learn.microsoft.com/dotnet/api/system.string)?\[\]

The segments to add.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.

### Exceptions

[ArgumentNullException](https://learn.microsoft.com/dotnet/api/system.argumentnullexception)

Thrown if `segments` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

## AddSegment(string?) {#Sisk_Core_Helpers_UrlBuilder_AddSegment_System_String_}

Adds a single segment to the URL path.

```csharp
public UrlBuilder AddSegment(string? segment)
```

### Parameters

`segment` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The segment to add.

### Returns

[UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md)

The current [UrlBuilder](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.UrlBuilder.md) instance.
