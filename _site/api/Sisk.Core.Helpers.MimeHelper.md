# MimeHelper

Kind: Class  
Namespace: `Sisk.Core.Helpers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.html

Provides useful helper methods for resolving mime-types from common formats.

```csharp
public static class MimeHelper
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[MimeHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [DefaultMimeType](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.DefaultMimeType.md#Sisk_Core_Helpers_MimeHelper_DefaultMimeType) | Gets or sets the [MimeHelper](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.md) default fallback mime-type. |

## Methods

| Name | Description |
| --- | --- |
| [GetFileExtension\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.GetFileExtension.md#Sisk_Core_Helpers_MimeHelper_GetFileExtension_System_String_System_String_) | Gets the file extension for the specified MIME type. |
| [GetMimeType\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.GetMimeType.md#Sisk_Core_Helpers_MimeHelper_GetMimeType_System_String_System_String_) | Gets the content mime-type from the specified file extension. |
| [IsBrowserKnownInlineMimeType\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.IsBrowserKnownInlineMimeType.md#Sisk_Core_Helpers_MimeHelper_IsBrowserKnownInlineMimeType_System_String_) | Determines whether the specified mime-type is considered an inline content type that can be displayed directly in most browsers. |
| [IsPlainTextFile\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.IsPlainTextFile.md#Sisk_Core_Helpers_MimeHelper_IsPlainTextFile_System_String_) | Gets an boolean indicating if the specified file is an well-known plain text file. |
| [IsPlainTextMimeType\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.MimeHelper.IsPlainTextMimeType.md#Sisk_Core_Helpers_MimeHelper_IsPlainTextMimeType_System_String_) | Gets a value indicating whether the specified MIME type is a plain text MIME type. |
