# IniDocument.GetSection

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetSection.html

## GetSection(string) {#Sisk_IniConfiguration_Core_IniDocument_GetSection_System_String_}

Gets an defined INI section from this document. The search is case-insensitive.

```csharp
public IniSection? GetSection(string sectionName)
```

### Parameters

`sectionName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The section name.

### Returns

[IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md)?

The [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) object if found, or null if not defined.
