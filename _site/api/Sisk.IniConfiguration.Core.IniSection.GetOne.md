# IniSection.GetOne

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.GetOne.html

## GetOne(string) {#Sisk_IniConfiguration_Core_IniSection_GetOne_System_String_}

Gets the last value defined in this INI section by their property name.

```csharp
public string? GetOne(string key)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The property name.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)?

The last value associated with the specified property name, or null if nothing is found.
