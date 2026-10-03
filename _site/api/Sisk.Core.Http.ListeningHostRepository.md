# ListeningHostRepository

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.html

Represents an fluent repository of [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) that can add, modify, or remove listening hosts while an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is running.

```csharp
public sealed class ListeningHostRepository : IList<ListeningHost>, ICollection<ListeningHost>, IEnumerable<ListeningHost>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md)

#### Implements

[IList<ListeningHost\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ilist\-1), 
[ICollection<ListeningHost\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.icollection\-1), 
[IEnumerable<ListeningHost\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
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
| [ListeningHostRepository\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.-ctor.md#Sisk_Core_Http_ListeningHostRepository__ctor) | Creates a new instance of an empty [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md). |
| [ListeningHostRepository\(IEnumerable<ListeningHost\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.-ctor.md#Sisk_Core_Http_ListeningHostRepository__ctor_System_Collections_Generic_IEnumerable_Sisk_Core_Http_ListeningHost__) | Creates a new instance of an [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md) copying the items from another collection of [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md). |

## Properties

| Name | Description |
| --- | --- |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Count.md#Sisk_Core_Http_ListeningHostRepository_Count) | Gets the number of elements contained in this [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md). |
| [IsReadOnly](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.IsReadOnly.md#Sisk_Core_Http_ListeningHostRepository_IsReadOnly) | Gets an boolean indicating if this [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md) is read only. This property always returns [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool). |
| [this\[int\]](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Item.md#Sisk_Core_Http_ListeningHostRepository_Item_System_Int32_) |  |

## Methods

| Name | Description |
| --- | --- |
| [Add\(ListeningHost\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Add.md#Sisk_Core_Http_ListeningHostRepository_Add_Sisk_Core_Http_ListeningHost_) | Adds a listeninghost to this repository. If this listeninghost already exists in this class, an exception will be thrown. |
| [Clear\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Clear.md#Sisk_Core_Http_ListeningHostRepository_Clear) | Removes all listeninghosts from this repository. |
| [Contains\(ListeningHost\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Contains.md#Sisk_Core_Http_ListeningHostRepository_Contains_Sisk_Core_Http_ListeningHost_) | Determines if an [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) is present in this repository. |
| [CopyTo\(ListeningHost\[\], int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.CopyTo.md#Sisk_Core_Http_ListeningHostRepository_CopyTo_Sisk_Core_Http_ListeningHost___System_Int32_) | Copies all elements from this repository to another compatible repository. |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.GetEnumerator.md#Sisk_Core_Http_ListeningHostRepository_GetEnumerator) | Returns an enumerator that iterates through this [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md). |
| [IndexOf\(ListeningHost\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.IndexOf.md#Sisk_Core_Http_ListeningHostRepository_IndexOf_Sisk_Core_Http_ListeningHost_) |  |
| [Insert\(int, ListeningHost\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Insert.md#Sisk_Core_Http_ListeningHostRepository_Insert_System_Int32_Sisk_Core_Http_ListeningHost_) |  |
| [Remove\(ListeningHost\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.Remove.md#Sisk_Core_Http_ListeningHostRepository_Remove_Sisk_Core_Http_ListeningHost_) | Try to remove a [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) from this repository. If the item is removed, this methods returns [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool). |
| [RemoveAt\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.RemoveAt.md#Sisk_Core_Http_ListeningHostRepository_RemoveAt_System_Int32_) |  |
