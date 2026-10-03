# StringValueCollection

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.html

Represents an collection of [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md).

```csharp
public sealed class StringValueCollection : StringKeyStoreCollection, IDictionary<string, string[]>, ICollection<KeyValuePair<string, string[]>>, IEnumerable<KeyValuePair<string, string[]>>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) ← 
[StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md)

#### Implements

[IDictionary<string, string\[\]\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2), 
[ICollection<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[StringKeyStoreCollection.FromQueryString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromQueryString.md#Sisk_Core_Entity_StringKeyStoreCollection_FromQueryString_System_String_), 
[StringKeyStoreCollection.FromCookieString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromCookieString.md#Sisk_Core_Entity_StringKeyStoreCollection_FromCookieString_System_String_), 
[StringKeyStoreCollection.FromNameValueCollection\(NameValueCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_FromNameValueCollection_System_Collections_Specialized_NameValueCollection_), 
[StringKeyStoreCollection.ImportNameValueCollection\(NameValueCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportNameValueCollection_System_Collections_Specialized_NameValueCollection_), 
[StringKeyStoreCollection.ImportQueryString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportQueryString.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportQueryString_System_String_), 
[StringKeyStoreCollection.ImportCookieString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportCookieString.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportCookieString_System_String_), 
[StringKeyStoreCollection.Add\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String___), 
[StringKeyStoreCollection.Add\(string, IEnumerable<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_Collections_Generic_IEnumerable_System_String__), 
[StringKeyStoreCollection.Add\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String_), 
[StringKeyStoreCollection.Add\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_Collections_Generic_KeyValuePair_System_String_System_String____), 
[StringKeyStoreCollection.AddRange\(IEnumerable<KeyValuePair<string, string\[\]\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AddRange.md#Sisk_Core_Entity_StringKeyStoreCollection_AddRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String_____), 
[StringKeyStoreCollection.AddRange\(IEnumerable<KeyValuePair<string, string?\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AddRange.md#Sisk_Core_Entity_StringKeyStoreCollection_AddRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String___), 
[StringKeyStoreCollection.SetRange\(IEnumerable<KeyValuePair<string, string\[\]\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.SetRange.md#Sisk_Core_Entity_StringKeyStoreCollection_SetRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String_____), 
[StringKeyStoreCollection.Set\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_Collections_Generic_KeyValuePair_System_String_System_String____), 
[StringKeyStoreCollection.Set\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_String_), 
[StringKeyStoreCollection.Set\(string, IEnumerable<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_Collections_Generic_IEnumerable_System_String__), 
[StringKeyStoreCollection.GetValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValue.md#Sisk_Core_Entity_StringKeyStoreCollection_GetValue_System_String_), 
[StringKeyStoreCollection.GetValues\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValues.md#Sisk_Core_Entity_StringKeyStoreCollection_GetValues_System_String_), 
[StringKeyStoreCollection.Clear\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Clear.md#Sisk_Core_Entity_StringKeyStoreCollection_Clear), 
[StringKeyStoreCollection.Remove\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Remove.md#Sisk_Core_Entity_StringKeyStoreCollection_Remove_System_String_), 
[StringKeyStoreCollection.MakeReadOnly\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.MakeReadOnly.md#Sisk_Core_Entity_StringKeyStoreCollection_MakeReadOnly), 
[StringKeyStoreCollection.ContainsKey\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ContainsKey.md#Sisk_Core_Entity_StringKeyStoreCollection_ContainsKey_System_String_), 
[StringKeyStoreCollection.GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetEnumerator.md#Sisk_Core_Entity_StringKeyStoreCollection_GetEnumerator), 
[StringKeyStoreCollection.TryGetValue\(string, out string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.TryGetValue.md#Sisk_Core_Entity_StringKeyStoreCollection_TryGetValue_System_String_System_String____), 
[StringKeyStoreCollection.AsDictionary\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsDictionary.md#Sisk_Core_Entity_StringKeyStoreCollection_AsDictionary), 
[StringKeyStoreCollection.AsNameValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_AsNameValueCollection), 
[StringKeyStoreCollection.AsStringValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsStringValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_AsStringValueCollection), 
[StringKeyStoreCollection.ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ToString.md#Sisk_Core_Entity_StringKeyStoreCollection_ToString), 
[StringKeyStoreCollection.ToString\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ToString.md#Sisk_Core_Entity_StringKeyStoreCollection_ToString_System_IFormatProvider_), 
[StringKeyStoreCollection.Comparer](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Comparer.md#Sisk_Core_Entity_StringKeyStoreCollection_Comparer), 
[StringKeyStoreCollection.this\[string\]](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Item.md#Sisk_Core_Entity_StringKeyStoreCollection_Item_System_String_), 
[StringKeyStoreCollection.Keys](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Keys.md#Sisk_Core_Entity_StringKeyStoreCollection_Keys), 
[StringKeyStoreCollection.Values](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Values.md#Sisk_Core_Entity_StringKeyStoreCollection_Values), 
[StringKeyStoreCollection.Count](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Count.md#Sisk_Core_Entity_StringKeyStoreCollection_Count), 
[StringKeyStoreCollection.IsReadOnly](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.IsReadOnly.md#Sisk_Core_Entity_StringKeyStoreCollection_IsReadOnly), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [StringValueCollection\(IDictionary<string, string?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.-ctor.md#Sisk_Core_Entity_StringValueCollection__ctor_System_Collections_Generic_IDictionary_System_String_System_String__) | Creates an new [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md) instance with values from another [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.idictionary) instance. |
| [StringValueCollection\(IDictionary<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.-ctor.md#Sisk_Core_Entity_StringValueCollection__ctor_System_Collections_Generic_IDictionary_System_String_System_String____) | Creates an new [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md) instance with values from another [IDictionary](https://learn.microsoft.com/dotnet/api/system.collections.idictionary) instance. |
| [StringValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.-ctor.md#Sisk_Core_Entity_StringValueCollection__ctor) | Creates an new empty [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md). |

## Properties

| Name | Description |
| --- | --- |
| [this\[string\]](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.Item.md#Sisk_Core_Entity_StringValueCollection_Item_System_String_) | Gets or sets an [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) item by their key name. |

## Methods

| Name | Description |
| --- | --- |
| [GetItem\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.GetItem.md#Sisk_Core_Entity_StringValueCollection_GetItem_System_String_) | Gets an [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) from their key name. If the object was not found by their name, an empty non-null [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) with no value is returned. |
| [GetItems\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.GetItems.md#Sisk_Core_Entity_StringValueCollection_GetItems_System_String_) | Gets an array of [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) from their key name. If the object was not found by their name, an empty array of [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) is returned. |
| [TryGetValue\(string, out StringValue\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.TryGetValue.md#Sisk_Core_Entity_StringValueCollection_TryGetValue_System_String_Sisk_Core_Entity_StringValue__) | Tries to get the last [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) associated with the specified key. |
