# StringKeyStoreCollection

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.html

Represents a collection of string keys associated with multiple string values.

```csharp
public class StringKeyStoreCollection : IDictionary<string, string[]>, ICollection<KeyValuePair<string, string[]>>, IEnumerable<KeyValuePair<string, string[]>>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md)

#### Derived

[HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md), 
[StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md)

#### Implements

[IDictionary<string, string\[\]\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.idictionary\-2), 
[ICollection<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<KeyValuePair<string, string\[\]\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [StringKeyStoreCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.-ctor.md#Sisk_Core_Entity_StringKeyStoreCollection__ctor) | Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class, |
| [StringKeyStoreCollection\(IEqualityComparer<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.-ctor.md#Sisk_Core_Entity_StringKeyStoreCollection__ctor_System_Collections_Generic_IEqualityComparer_System_String__) | Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class with a specified comparer. |
| [StringKeyStoreCollection\(IEqualityComparer<string\>, IDictionary<string, string\[\]\>?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.-ctor.md#Sisk_Core_Entity_StringKeyStoreCollection__ctor_System_Collections_Generic_IEqualityComparer_System_String__System_Collections_Generic_IDictionary_System_String_System_String____) | Initializes a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) class, |

## Properties

| Name | Description |
| --- | --- |
| [Comparer](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Comparer.md#Sisk_Core_Entity_StringKeyStoreCollection_Comparer) | Gets the [IEqualityComparer](https://learn.microsoft.com/dotnet/api/system.collections.generic.iequalitycomparer) used to compare keys in this [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Count.md#Sisk_Core_Entity_StringKeyStoreCollection_Count) | Gets the number of key-value pairs in the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). |
| [IsReadOnly](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.IsReadOnly.md#Sisk_Core_Entity_StringKeyStoreCollection_IsReadOnly) | Gets a value indicating whether the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) is read-only. |
| [Keys](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Keys.md#Sisk_Core_Entity_StringKeyStoreCollection_Keys) | Gets the collection of keys in the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). |
| [Values](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Values.md#Sisk_Core_Entity_StringKeyStoreCollection_Values) | Gets the collection of values in the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) as arrays. Each key may have multiple associated values. |
| [this\[string\]](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Item.md#Sisk_Core_Entity_StringKeyStoreCollection_Item_System_String_) | Gets or sets the array of values associated with the specified key. Returns [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the key does not exist in the store. |

## Methods

| Name | Description |
| --- | --- |
| [Add\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String___) | Adds an array of values associated with the specified key. |
| [Add\(string, IEnumerable<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_Collections_Generic_IEnumerable_System_String__) | Adds a collection of values associated with the specified key. |
| [Add\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_String_System_String_) | Adds a single value associated with the specified key. |
| [Add\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Add.md#Sisk_Core_Entity_StringKeyStoreCollection_Add_System_Collections_Generic_KeyValuePair_System_String_System_String____) | Adds a key-value pair to the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). |
| [AddRange\(IEnumerable<KeyValuePair<string, string\[\]\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AddRange.md#Sisk_Core_Entity_StringKeyStoreCollection_AddRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String_____) | Adds the elements of the specified collection to the end of this collection. |
| [AddRange\(IEnumerable<KeyValuePair<string, string?\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AddRange.md#Sisk_Core_Entity_StringKeyStoreCollection_AddRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String___) | Adds the elements of the specified collection to the end of this collection. |
| [AsDictionary\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsDictionary.md#Sisk_Core_Entity_StringKeyStoreCollection_AsDictionary) | Copies the contents of this [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) into an [Dictionary](https://learn.microsoft.com/dotnet/api/system.collections.generic.dictionary). |
| [AsNameValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_AsNameValueCollection) | Copies the contents of this [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) into an [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection), with values separated with an comma (,). |
| [AsStringValueCollection\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.AsStringValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_AsStringValueCollection) | Copies the contents of this [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) into an [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md). |
| [Clear\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Clear.md#Sisk_Core_Entity_StringKeyStoreCollection_Clear) | Removes all key-value pairs from the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). Throws an exception if the store is read-only. |
| [ContainsKey\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ContainsKey.md#Sisk_Core_Entity_StringKeyStoreCollection_ContainsKey_System_String_) | Determines whether the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) contains a specific key. |
| [FromCookieString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromCookieString.md#Sisk_Core_Entity_StringKeyStoreCollection_FromCookieString_System_String_) | Creates a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) from a cookie string. The query string should be in the format of "key1=value1; key2=value2". |
| [FromNameValueCollection\(NameValueCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_FromNameValueCollection_System_Collections_Specialized_NameValueCollection_) | Creates a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) from a [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection). |
| [FromQueryString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromQueryString.md#Sisk_Core_Entity_StringKeyStoreCollection_FromQueryString_System_String_) | Creates a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) from a query string. The query string should be in the format of "key1=value1&amp;key2=value2". |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetEnumerator.md#Sisk_Core_Entity_StringKeyStoreCollection_GetEnumerator) |  |
| [GetValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValue.md#Sisk_Core_Entity_StringKeyStoreCollection_GetValue_System_String_) | Retrieves the last value associated with the specified key. Returns [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the key does not exist. |
| [GetValues\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValues.md#Sisk_Core_Entity_StringKeyStoreCollection_GetValues_System_String_) | Retrieves all values associated with the specified key. Returns an empty array if the key does not exist. |
| [ImportCookieString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportCookieString.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportCookieString_System_String_) | Imports key-value pairs from a cookie string into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). The query string should be in the format of "key1=value1; key2=value2". |
| [ImportNameValueCollection\(NameValueCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportNameValueCollection.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportNameValueCollection_System_Collections_Specialized_NameValueCollection_) | Imports key-value pairs from a [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection) into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). Each key can have multiple associated values. |
| [ImportQueryString\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportQueryString.md#Sisk_Core_Entity_StringKeyStoreCollection_ImportQueryString_System_String_) | Imports key-value pairs from a query string into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). The query string should be in the format of "key1=value1&amp;key2=value2". |
| [MakeReadOnly\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.MakeReadOnly.md#Sisk_Core_Entity_StringKeyStoreCollection_MakeReadOnly) | Marks the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) as read-only, preventing further modifications. |
| [Remove\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Remove.md#Sisk_Core_Entity_StringKeyStoreCollection_Remove_System_String_) | Removes the value associated with the specified key from the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). Throws an exception if the store is read-only. |
| [Set\(KeyValuePair<string, string\[\]\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_Collections_Generic_KeyValuePair_System_String_System_String____) | Sets the value associated with the specified key, replacing any existing values. |
| [Set\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_String_) | Sets the value associated with the specified key, replacing any existing values. |
| [Set\(string, IEnumerable<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Set.md#Sisk_Core_Entity_StringKeyStoreCollection_Set_System_String_System_Collections_Generic_IEnumerable_System_String__) | Sets the collection of values associated with the specified key, replacing any existing values. |
| [SetRange\(IEnumerable<KeyValuePair<string, string\[\]\>\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.SetRange.md#Sisk_Core_Entity_StringKeyStoreCollection_SetRange_System_Collections_Generic_IEnumerable_System_Collections_Generic_KeyValuePair_System_String_System_String_____) | Sets the elements of the specified collection, replacing existing values. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ToString.md#Sisk_Core_Entity_StringKeyStoreCollection_ToString) | Returns a string that represents the current object. |
| [ToString\(IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ToString.md#Sisk_Core_Entity_StringKeyStoreCollection_ToString_System_IFormatProvider_) | Returns a string that represents the current object, using the specified format provider. |
| [TryGetValue\(string, out string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.TryGetValue.md#Sisk_Core_Entity_StringKeyStoreCollection_TryGetValue_System_String_System_String____) | Tries to get the array of values associated with the specified key. |
