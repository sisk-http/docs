# IniDocument.GetEntries

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniDocument.GetEntries.html

## GetEntries() {#Sisk_IniConfiguration_Core_IniDocument_GetEntries}

Retrieves all entries in the INI document.

```csharp
public IEnumerable<KeyValuePair<string, string[]>> GetEntries()
```

### Returns

[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>\>

An enumerable collection of key-value pairs, where each key is the entry name and each value is an array of strings representing the entry values.
