# HashCodeHelper

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.html

Provides helper methods for deterministic hash code generation and combination.

```csharp
public static class HashCodeHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HashCodeHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Fields

| Name | Description |
| --- | --- |
| [FnvHash](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.FnvHash.md#Sisk_Core_Helpers_HashCodeHelper_FnvHash) | The offset basis used by the FNV‑1a algorithm. |
| [FnvPrime](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.FnvPrime.md#Sisk_Core_Helpers_HashCodeHelper_FnvPrime) | The prime multiplier used by the FNV‑1a algorithm. |

## Methods

| Name | Description |
| --- | --- |
| [Combine\(params ReadOnlySpan<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.Combine.md#Sisk_Core_Helpers_HashCodeHelper_Combine_System_ReadOnlySpan_System_Object__) | Combines the deterministic hash codes of a collection of objects into a single 64‑bit hash. |
| [DeterministicHash\(ReadOnlySpan<char\>, ulong, ulong, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.DeterministicHash.md#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_ReadOnlySpan_System_Char__System_UInt64_System_UInt64_System_Int32_) | Computes a deterministic 64‑bit hash for the supplied [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan) of characters using the specified seed, prime, and step values. |
| [DeterministicHash\(ReadOnlySpan<char\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.DeterministicHash.md#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_ReadOnlySpan_System_Char__) | Computes a deterministic 64‑bit hash for the supplied [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan) of characters. |
| [DeterministicHash\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.DeterministicHash.md#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_String_) | Computes a deterministic 64‑bit hash for the supplied [String](https://learn.microsoft.com/dotnet/api/system.string). |
| [DeterministicHash\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.HashCodeHelper.DeterministicHash.md#Sisk_Core_Helpers_HashCodeHelper_DeterministicHash_System_Object_) | Computes a deterministic 64‑bit hash for an arbitrary [Object](https://learn.microsoft.com/dotnet/api/system.object). |
