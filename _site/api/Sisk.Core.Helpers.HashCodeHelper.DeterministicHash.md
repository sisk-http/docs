# HashCodeHelper.DeterministicHash

Kind: Method  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.DeterministicHash.html

## DeterministicHash(ReadOnlySpan&lt;char>, ulong, ulong, int) {#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_ReadOnlySpan_System_Char__System_UInt64_System_UInt64_System_Int32_}

Computes a deterministic 64‑bit hash for the supplied [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan) of characters
using the specified seed, prime, and step values.

```csharp
public static ulong DeterministicHash(ReadOnlySpan<char> s, ulong eseed, ulong eprime, int step)
```

### Parameters

`s` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The span of characters to hash.

`eseed` [ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

The initial seed value for the hash algorithm.

`eprime` [ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

The prime multiplier used in the hash algorithm.

`step` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The step increment for iterating over the span.

### Returns

[ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

A 64‑bit hash value representing the input characters.

## DeterministicHash(ReadOnlySpan&lt;char>) {#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_ReadOnlySpan_System_Char__}

Computes a deterministic 64‑bit hash for the supplied [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan) of characters.

```csharp
public static ulong DeterministicHash(ReadOnlySpan<char> s)
```

### Parameters

`s` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[char](https://learn.microsoft.com/dotnet/api/system.char)\>

The span of characters to hash.

### Returns

[ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

A 64‑bit hash value representing the input characters.

## DeterministicHash(string?) {#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_String_}

Computes a deterministic 64‑bit hash for the supplied [String](https://learn.microsoft.com/dotnet/api/system.string).

```csharp
public static ulong DeterministicHash(string? s)
```

### Parameters

`s` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The string to hash. May be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) or empty.

### Returns

[ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

The hash of the string, or `0` if `s` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) or empty.

## DeterministicHash(object?) {#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_Object_}

Computes a deterministic 64‑bit hash for an arbitrary [Object](https://learn.microsoft.com/dotnet/api/system.object).

```csharp
public static ulong DeterministicHash(object? data)
```

### Parameters

`data` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object to hash. May be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[ulong](https://learn.microsoft.com/dotnet/api/system.uint64)

If `data` is [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null), returns `0`;
if it is a [String](https://learn.microsoft.com/dotnet/api/system.string), returns the hash of that string;
otherwise returns the 64‑bit representation of [GetHashCode](https://learn.microsoft.com/dotnet/api/system.object.gethashcode).
