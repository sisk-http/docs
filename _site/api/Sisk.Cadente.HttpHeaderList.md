# HttpHeaderList

Kind: Class  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.html

Represents a typed list of [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md).

```csharp
public sealed class HttpHeaderList : IList<HttpHeader>, ICollection<HttpHeader>, IEnumerable<HttpHeader>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md)

#### Implements

[IList<HttpHeader\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ilist\-1), 
[ICollection<HttpHeader\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<HttpHeader\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

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
| [HttpHeaderList\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.-ctor.md#Sisk_Cadente_HttpHeaderList__ctor) | Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class. |
| [HttpHeaderList\(int\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.-ctor.md#Sisk_Cadente_HttpHeaderList__ctor_System_Int32_) | Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class with the specified initial capacity. |
| [HttpHeaderList\(IEnumerable<HttpHeader\>\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.-ctor.md#Sisk_Cadente_HttpHeaderList__ctor_System_Collections_Generic_IEnumerable_Sisk_Cadente_HttpHeader__) | Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class that contains elements copied from the specified collection. |
| [HttpHeaderList\(IEnumerable<HttpHeader\>, bool\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.-ctor.md#Sisk_Cadente_HttpHeaderList__ctor_System_Collections_Generic_IEnumerable_Sisk_Cadente_HttpHeader__System_Boolean_) | Initializes a new instance of the [HttpHeaderList](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.md) class that contains elements copied from the specified collection. |

## Properties

| Name | Description |
| --- | --- |
| [Count](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Count.md#Sisk_Cadente_HttpHeaderList_Count) |  |
| [IsReadOnly](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.IsReadOnly.md#Sisk_Cadente_HttpHeaderList_IsReadOnly) |  |
| [this\[int\]](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Item.md#Sisk_Cadente_HttpHeaderList_Item_System_Int32_) |  |

## Methods

| Name | Description |
| --- | --- |
| [Add\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Add.md#Sisk_Cadente_HttpHeaderList_Add_Sisk_Cadente_HttpHeader_) |  |
| [Clear\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Clear.md#Sisk_Cadente_HttpHeaderList_Clear) |  |
| [Contains\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Contains.md#Sisk_Cadente_HttpHeaderList_Contains_Sisk_Cadente_HttpHeader_) |  |
| [Contains\(string\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Contains.md#Sisk_Cadente_HttpHeaderList_Contains_System_String_) | Determines whether the collection contains a header with the specified name. |
| [CopyTo\(HttpHeader\[\], int\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.CopyTo.md#Sisk_Cadente_HttpHeaderList_CopyTo_Sisk_Cadente_HttpHeader___System_Int32_) |  |
| [Get\(string\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Get.md#Sisk_Cadente_HttpHeaderList_Get_System_String_) | Gets the values of all headers that match the specified name. |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.GetEnumerator.md#Sisk_Cadente_HttpHeaderList_GetEnumerator) |  |
| [IndexOf\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.IndexOf.md#Sisk_Cadente_HttpHeaderList_IndexOf_Sisk_Cadente_HttpHeader_) |  |
| [Insert\(int, HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Insert.md#Sisk_Cadente_HttpHeaderList_Insert_System_Int32_Sisk_Cadente_HttpHeader_) |  |
| [Remove\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Remove.md#Sisk_Cadente_HttpHeaderList_Remove_Sisk_Cadente_HttpHeader_) | Removes all [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) instances that match the specified header. |
| [Remove\(string\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Remove.md#Sisk_Cadente_HttpHeaderList_Remove_System_String_) | Removes all [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) instances that match the specified header name. |
| [RemoveAt\(int\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.RemoveAt.md#Sisk_Cadente_HttpHeaderList_RemoveAt_System_Int32_) |  |
| [Set\(HttpHeader\)](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeaderList.Set.md#Sisk_Cadente_HttpHeaderList_Set_Sisk_Cadente_HttpHeader_) | Sets the specified [HttpHeader](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHeader.md) in the collection, replacing any existing header with the same name. |
