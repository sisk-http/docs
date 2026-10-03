# IniDocument.FromFile

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.FromFile.html

## FromFile(string, Encoding?, bool) {#Sisk_IniConfiguration_Core_IniDocument_FromFile_System_String_System_Text_Encoding_System_Boolean_}

Creates an new [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md) document from the specified
file using the specified encoding.

```csharp
public static IniDocument FromFile(string filePath, Encoding? encoding = null, bool throwIfNotExists = true)
```

### Parameters

`filePath` [string](https://learn.microsoft.com/dotnet/api/system.string)

The absolute or relative file path to the INI document.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)?

Optional. The encoding used to read the file. Defaults to UTF-8.

`throwIfNotExists` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

Optional. Defines whether this method should throw if the specified file doens't exists or return an empty INI document.

### Returns

[IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md)
