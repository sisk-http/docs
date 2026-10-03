# PathHelper

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.html

Provides useful path-dedicated helper members.

```csharp
public sealed class PathHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[PathHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.md)

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
| [PathHelper\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.-ctor.md#Sisk_Core_Helpers_PathHelper__ctor) |  |

## Methods

| Name | Description |
| --- | --- |
| [CombinePaths\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.CombinePaths.md#Sisk_Core_Helpers_PathHelper_CombinePaths_System_String___) | Combines the specified URL paths into one. |
| [EnsureDirectoryExistance\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.EnsureDirectoryExistance.md#Sisk_Core_Helpers_PathHelper_EnsureDirectoryExistance_System_String_) | Ensures that the specified directory exists, creating it if necessary. |
| [EnsureFileDirectoryExistance\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.EnsureFileDirectoryExistance.md#Sisk_Core_Helpers_PathHelper_EnsureFileDirectoryExistance_System_String_) | Ensures that the directory for the specified file path exists, creating it if necessary. |
| [FilesystemCombinePaths\(bool, char, params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.FilesystemCombinePaths.md#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_Boolean_System_Char_System_String___) | Normalizes and combines the specified file-system paths into one. |
| [FilesystemCombinePaths\(bool, char, ReadOnlySpan<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.FilesystemCombinePaths.md#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_Boolean_System_Char_System_ReadOnlySpan_System_String__) | Normalizes and combines the specified file-system paths into one. |
| [FilesystemCombinePaths\(params string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.FilesystemCombinePaths.md#Sisk_Core_Helpers_PathHelper_FilesystemCombinePaths_System_String___) | Normalizes and combines the specified file-system paths into one, using the default environment directory separator char. |
| [IsPathAllowed\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.IsPathAllowed.md#Sisk_Core_Helpers_PathHelper_IsPathAllowed_System_String_) | Determines whether the specified path contains only valid path and file-name characters. |
| [NormalizePath\(string, char, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.NormalizePath.md#Sisk_Core_Helpers_PathHelper_NormalizePath_System_String_System_Char_System_Boolean_) | Normalize the given path to use the specified directory separator, trim the last separator and remove empty entries. |
| [Pop\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.Pop.md#Sisk_Core_Helpers_PathHelper_Pop_System_String_) | Removes the last segment from the specified path. |
| [Split\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.PathHelper.Split.md#Sisk_Core_Helpers_PathHelper_Split_System_String_) | Splits the specified path into its individual segments, removing empty entries and trimming whitespace. |
