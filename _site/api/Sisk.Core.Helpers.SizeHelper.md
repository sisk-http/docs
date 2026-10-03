# SizeHelper

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.html

Provides useful size-dedicated helper members.

```csharp
public sealed class SizeHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[SizeHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [SizeHelper\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.-ctor.md#Sisk_Core_Helpers_SizeHelper__ctor) |  |

## Fields

| Name | Description |
| --- | --- |
| [UnitEb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitEb.md#Sisk_Core_Helpers_SizeHelper_UnitEb) | Represents the number of bytes in one exibibyte (EiB). This is calculated as 1024 pebibytes. |
| [UnitGb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitGb.md#Sisk_Core_Helpers_SizeHelper_UnitGb) | Represents the number of bytes in one gibibyte (GiB). This is calculated as 1024 mebibytes. |
| [UnitKb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitKb.md#Sisk_Core_Helpers_SizeHelper_UnitKb) | Represents the number of bytes in one kibibyte (KiB). This is calculated as 1024 bytes. |
| [UnitMb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitMb.md#Sisk_Core_Helpers_SizeHelper_UnitMb) | Represents the number of bytes in one mebibyte (MiB). This is calculated as 1024 kibibytes. |
| [UnitPb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitPb.md#Sisk_Core_Helpers_SizeHelper_UnitPb) | Represents the number of bytes in one pebibyte (PiB). This is calculated as 1024 tebibytes. |
| [UnitTb](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.UnitTb.md#Sisk_Core_Helpers_SizeHelper_UnitTb) | Represents the number of bytes in one tebibyte (TiB). This is calculated as 1024 gibibytes. |

## Methods

| Name | Description |
| --- | --- |
| [HumanReadableSize\(long\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.HumanReadableSize.md#Sisk_Core_Helpers_SizeHelper_HumanReadableSize_System_Int64_) | Converts a byte count into a human-readable string representation. |
| [HumanReadableSize\(double\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.HumanReadableSize.md#Sisk_Core_Helpers_SizeHelper_HumanReadableSize_System_Double_) | Converts a byte count into a human-readable string representation. |
| [Parse\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.SizeHelper.Parse.md#Sisk_Core_Helpers_SizeHelper_Parse_System_String_) | Parses a human-readable size string (e.g., "10 KB", "2.5 MB") into a long representing the number of bytes. |
