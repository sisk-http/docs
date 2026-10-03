# IniSection.Add

Kind: Method  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Add.html

## Add(string, string[]) {#Sisk_IniConfiguration_Core_IniSection_Add_System_String_System_String___}

```csharp
public void Add(string key, string[] value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

## Add(string, string?) {#Sisk_IniConfiguration_Core_IniSection_Add_System_String_System_String_}

Adds a new key-value pair to the INI section.

```csharp
public void Add(string key, string? value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key to be added.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The value associated with the key, or `null` to set an empty value.

## Add(KeyValuePair&lt;string, string[]>) {#Sisk_IniConfiguration_Core_IniSection_Add_System_Collections_Generic_KeyValuePair_System_String_System_String____}

```csharp
public void Add(KeyValuePair<string, string[]> item)
```

### Parameters

`item` [KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]\>
