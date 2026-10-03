# IniDocument.GetEntry

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetEntry.html

## GetEntry(string, StringComparison) {#Sisk_IniConfiguration_Core_IniDocument_GetEntry_System_String_System_StringComparison_}

Retrieves the values of a specific entry in the INI document.

```csharp
public string[] GetEntry(string name, StringComparison stringComparison = StringComparison.OrdinalIgnoreCase)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the entry to retrieve.

`stringComparison` [StringComparison](https://learn.microsoft.com/dotnet/api/system.stringcomparison)

The string comparison to use when searching for the entry. Defaults to [OrdinalIgnoreCase](https://learn.microsoft.com/dotnet/api/system.stringcomparison.ordinalignorecase).

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

An array of strings representing the values of the entry, or an empty array if the entry is not found.
