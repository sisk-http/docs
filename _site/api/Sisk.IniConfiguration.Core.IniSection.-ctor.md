# IniSection constructor

Kind: Constructor  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.-ctor.html

## IniSection(string) {#Sisk_IniConfiguration_Core_IniSection__ctor_System_String_}

Initializes a new instance of the [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) class with the specified name.

```csharp
public IniSection(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the INI section.

## IniSection(string, IEnumerable&lt;KeyValuePair&lt;string, string>>) {#Sisk_IniConfiguration_Core_IniSection__ctor_System_String_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String___}

Initializes a new instance of the [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) class with the specified name and items.

```csharp
public IniSection(string name, IEnumerable<KeyValuePair<string, string>> items)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the INI section.

`items` [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1)<[KeyValuePair](https://learn.microsoft.com/dotnet/api/system.collections.generic.keyvaluepair\-2)<[string](https://learn.microsoft.com/dotnet/api/system.string), [string](https://learn.microsoft.com/dotnet/api/system.string)\>\>

A collection of key-value pairs to be added to the section.
