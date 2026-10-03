# IniDocument

Kind: Class  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.html

Represents an INI document.

```csharp
public sealed class IniDocument
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md)

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
| [IniDocument\(IEnumerable<IniSection\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.-ctor.md#Sisk_IniConfiguration_Core_IniDocument__ctor_System_Collections_Generic_IEnumerable_Sisk_IniConfiguration_Core_IniSection__) | Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) instance from the specified [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) collection. |
| [IniDocument\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.-ctor.md#Sisk_IniConfiguration_Core_IniDocument__ctor) | Creates an new empty [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) instance with no INI sections added to it. |

## Properties

| Name | Description |
| --- | --- |
| [Global](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.Global.md#Sisk_IniConfiguration_Core_IniDocument_Global) | Gets the global INI section, which is the primary section in the document. |
| [Sections](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.Sections.md#Sisk_IniConfiguration_Core_IniDocument_Sections) | Gets all INI sections defined in this INI document. |

## Methods

| Name | Description |
| --- | --- |
| [FromFile\(string, Encoding?, bool\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromFile.md#Sisk_IniConfiguration_Core_IniDocument_FromFile_System_String_System_Text_Encoding_System_Boolean_) | Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified file using the specified encoding. |
| [FromStream\(Stream, Encoding?\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromStream.md#Sisk_IniConfiguration_Core_IniDocument_FromStream_System_IO_Stream_System_Text_Encoding_) | Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified stream using the specified encoding. |
| [FromStream\(TextReader\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromStream.md#Sisk_IniConfiguration_Core_IniDocument_FromStream_System_IO_TextReader_) | Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified [TextReader](https://learn.microsoft.com/dotnet/api/system.io.textreader). |
| [FromString\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromString.md#Sisk_IniConfiguration_Core_IniDocument_FromString_System_String_) | Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified string, reading it as an UTF-8 string. |
| [GetEntries\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetEntries.md#Sisk_IniConfiguration_Core_IniDocument_GetEntries) | Retrieves all entries in the INI document. |
| [GetEntry\(string, StringComparison\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetEntry.md#Sisk_IniConfiguration_Core_IniDocument_GetEntry_System_String_System_StringComparison_) | Retrieves the values of a specific entry in the INI document. |
| [GetSection\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetSection.md#Sisk_IniConfiguration_Core_IniDocument_GetSection_System_String_) | Gets an defined INI section from this document. The search is case-insensitive. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.ToString.md#Sisk_IniConfiguration_Core_IniDocument_ToString) | Gets the INI document string from this [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md). |
