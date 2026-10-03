# IniWriter.Write

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core.Serialization`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.Serialization.IniWriter.Write.html

## Write(string, string?) {#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_System_String_System_String_}

Writes a key-value pair to the INI file.

```csharp
public void Write(string key, string? value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key to write.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value to write.

## Write(in KeyValuePair&lt;string, string[]>) {#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_System_Collections_Generic_KeyValuePair_System_String_System_String_____}

Writes a key-value pair to the INI file, where the value is an array of strings.

```csharp
public void Write(in KeyValuePair<string, string[]> value)
```

### Parameters

`value` [KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>

The key-value pair to write.

## Write(IniSection) {#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_Sisk_IniConfiguration_Core_IniSection_}

Writes an INI section to the INI file.

```csharp
public void Write(IniSection section)
```

### Parameters

`section` [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md)

The section to write.

## Write(IniDocument) {#Sisk_IniConfiguration_Core_Serialization_IniWriter_Write_Sisk_IniConfiguration_Core_IniDocument_}

Writes an INI document to the INI file.

```csharp
public void Write(IniDocument document)
```

### Parameters

`document` [IniDocument](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.md)

The document to write.
