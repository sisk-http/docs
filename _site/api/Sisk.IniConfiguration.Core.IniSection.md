# IniSection

Kind: Class  
Namespace: `Sisk.IniConfiguration.Core`  
Assembly: `Sisk.IniConfiguration.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.html

Represents an INI section, which contains it's own properties.

```csharp
public sealed class IniSection : IDictionary<string, string[]>, ICollection<KeyValuePair<string, string[]>>, IEnumerable<KeyValuePair<string, string[]>>, IEnumerable, IEquatable<IniSection>
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md)

#### Implements

[IDictionary<string, string\[\]\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2), 
[ICollection<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable), 
[IEquatable<IniSection\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1)

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
| [IniSection\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.-ctor.md#Sisk_IniConfiguration_Core_IniSection__ctor_System_String_) | Initializes a new instance of the [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) class with the specified name. |
| [IniSection\(string, IEnumerable<KeyValuePair<string, string\>\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.-ctor.md#Sisk_IniConfiguration_Core_IniSection__ctor_System_String_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String___) | Initializes a new instance of the [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md) class with the specified name and items. |

## Properties

| Name | Description |
| --- | --- |
| [Count](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Count.md#Sisk_IniConfiguration_Core_IniSection_Count) | Gets the number of properties in this INI section. |
| [IsReadOnly](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.IsReadOnly.md#Sisk_IniConfiguration_Core_IniSection_IsReadOnly) |  |
| [Keys](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Keys.md#Sisk_IniConfiguration_Core_IniSection_Keys) | Gets all keys defined in this INI section, without duplicates. |
| [Name](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Name.md#Sisk_IniConfiguration_Core_IniSection_Name) | Gets the INI section name. |
| [Values](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Values.md#Sisk_IniConfiguration_Core_IniSection_Values) | Gets all values defined in this INI section. |
| [this\[string\]](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Item.md#Sisk_IniConfiguration_Core_IniSection_Item_System_String_) | Gets all values associated with the specified property name, performing an case-insensitive search. |

## Methods

| Name | Description |
| --- | --- |
| [Add\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Add.md#Sisk_IniConfiguration_Core_IniSection_Add_System_String_System_String___) |  |
| [Add\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Add.md#Sisk_IniConfiguration_Core_IniSection_Add_System_String_System_String_) | Adds a new key-value pair to the INI section. |
| [Add\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Add.md#Sisk_IniConfiguration_Core_IniSection_Add_System_Collections_Generic_KeyValuePair_System_String_System_String____) |  |
| [Clear\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Clear.md#Sisk_IniConfiguration_Core_IniSection_Clear) |  |
| [Contains\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Contains.md#Sisk_IniConfiguration_Core_IniSection_Contains_System_Collections_Generic_KeyValuePair_System_String_System_String____) |  |
| [ContainsKey\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.ContainsKey.md#Sisk_IniConfiguration_Core_IniSection_ContainsKey_System_String_) | Gets an boolean indicating if the specified key/property name is defined in this [IniSection](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.md). |
| [CopyTo\(KeyValuePair<string, string\[\]\>\[\], int\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.CopyTo.md#Sisk_IniConfiguration_Core_IniSection_CopyTo_System_Collections_Generic_KeyValuePair_System_String_System_String______System_Int32_) | This method is not supported and will throw an [NotSupportedException](https://learn.microsoft.com/dotnet/api/system.notsupportedexception). |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Equals.md#Sisk_IniConfiguration_Core_IniSection_Equals_System_Object_) |  |
| [Equals\(IniSection?\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Equals.md#Sisk_IniConfiguration_Core_IniSection_Equals_Sisk_IniConfiguration_Core_IniSection_) |  |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.GetEnumerator.md#Sisk_IniConfiguration_Core_IniSection_GetEnumerator) |  |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.GetHashCode.md#Sisk_IniConfiguration_Core_IniSection_GetHashCode) |  |
| [GetMany\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.GetMany.md#Sisk_IniConfiguration_Core_IniSection_GetMany_System_String_) | Gets all values defined in this INI section by their property name. |
| [GetOne\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.GetOne.md#Sisk_IniConfiguration_Core_IniSection_GetOne_System_String_) | Gets the last value defined in this INI section by their property name. |
| [Remove\(string\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Remove.md#Sisk_IniConfiguration_Core_IniSection_Remove_System_String_) |  |
| [Remove\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.Remove.md#Sisk_IniConfiguration_Core_IniSection_Remove_System_Collections_Generic_KeyValuePair_System_String_System_String____) |  |
| [TryGetValue\(string, out string\[\]\)](https://docs.sisk-framework.org/api/Sisk.IniConfiguration.Core.IniSection.TryGetValue.md#Sisk_IniConfiguration_Core_IniSection_TryGetValue_System_String_System_String____) |  |
