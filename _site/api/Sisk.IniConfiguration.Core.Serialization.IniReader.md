# IniReader

Kind: Class  
Namespace: `Sisk.IniConfiguration.Core.Serialization`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.html

Provides an INI-document reader and parser.

```csharp
public sealed class IniReader : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[IniReader](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.md)

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
| [IniReader\(TextReader\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.-ctor.md#Sisk_IniConfiguration_Core_Serialization_IniReader__ctor_System_IO_TextReader_) | Creates an new [IniReader](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.md) with the specified text reader. |

## Properties

| Name | Description |
| --- | --- |
| [IniNamingComparer](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.IniNamingComparer.md#Sisk_IniConfiguration_Core_Serialization_IniReader_IniNamingComparer) | Gets or sets the default [StringComparer](https://learn.microsoft.com/dotnet/api/system.stringcomparer) used by the INI reader and instances to compare key names. |
| [Reader](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.Reader.md#Sisk_IniConfiguration_Core_Serialization_IniReader_Reader) | Gets the [TextReader](https://learn.microsoft.com/dotnet/api/system.io.textreader) which is providing data to this INI reader. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.Dispose.md#Sisk_IniConfiguration_Core_Serialization_IniReader_Dispose) |  |
| [Read\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniReader.Read.md#Sisk_IniConfiguration_Core_Serialization_IniReader_Read) | Reads the INI document from the input stream. |
