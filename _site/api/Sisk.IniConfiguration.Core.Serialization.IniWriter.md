# IniWriter

Kind: Class  
Namespace: `Sisk.IniConfiguration.Core.Serialization`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.html

Represents a writer for INI files.

```csharp
public sealed class IniWriter : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[IniWriter](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

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
| [IniWriter\(TextWriter\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.-ctor.md#Sisk_IniConfiguration_Core_Serialization_IniWriter__ctor_System_IO_TextWriter_) | Initializes a new instance of the [IniWriter](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [CommentChar](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.CommentChar.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_CommentChar) | Gets or sets the default comment character. |
| [NewLineBehavior](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.NewLineBehavior.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_NewLineBehavior) | Gets or sets the behavior for writing new lines inside properties values. |
| [Writer](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Writer.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Writer) | Gets the underlying text writer. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Dispose.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Dispose) | Releases all resources used by the [IniWriter](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.md) object. |
| [Write\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Write.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_System_String_System_String_) | Writes a key-value pair to the INI file. |
| [Write\(in KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Write.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_System_Collections_Generic_KeyValuePair_System_String_System_String_____) | Writes a key-value pair to the INI file, where the value is an array of strings. |
| [Write\(IniSection\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Write.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_Sisk_IniConfiguration_Core_IniSection_) | Writes an INI section to the INI file. |
| [Write\(IniDocument\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Write.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_Sisk_IniConfiguration_Core_IniDocument_) | Writes an INI document to the INI file. |
| [WriteComment\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.WriteComment.md#Sisk_IniConfiguration_Core_Serialization_IniWriter_WriteComment_System_String_) | Writes a comment to the INI file. |
