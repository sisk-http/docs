# MultipartFormCollection

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.html

Represents an class which hosts an multipart form data contents.

```csharp
public sealed class MultipartFormCollection : IReadOnlyList<MultipartObject>, IReadOnlyCollection<MultipartObject>, IEnumerable<MultipartObject>, IReadOnlyDictionary<string, MultipartObject>, IReadOnlyCollection<KeyValuePair<string, MultipartObject>>, IEnumerable<KeyValuePair<string, MultipartObject>>, IEnumerable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md)

#### Implements

[IReadOnlyList<MultipartObject\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlylist\-1), 
[IReadOnlyCollection<MultipartObject\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlycollection\-1), 
[IEnumerable<MultipartObject\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IReadOnlyDictionary<string, MultipartObject\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlydictionary\-2), 
[IReadOnlyCollection<KeyValuePair<string, MultipartObject\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlycollection\-1), 
[IEnumerable<KeyValuePair<string, MultipartObject\>\>](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable\-1), 
[IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.ienumerable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Count](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.Count.md#Sisk_Core_Entity_MultipartFormCollection_Count) |  |
| [Files](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.Files.md#Sisk_Core_Entity_MultipartFormCollection_Files) | Gets a collection of [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) instances that represent files. |
| [Keys](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.Keys.md#Sisk_Core_Entity_MultipartFormCollection_Keys) |  |
| [Values](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.Values.md#Sisk_Core_Entity_MultipartFormCollection_Values) |  |

## Methods

| Name | Description |
| --- | --- |
| [ContainsKey\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.ContainsKey.md#Sisk_Core_Entity_MultipartFormCollection_ContainsKey_System_String_) |  |
| [GetEnumerator\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetEnumerator.md#Sisk_Core_Entity_MultipartFormCollection_GetEnumerator) |  |
| [GetFile\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetFile.md#Sisk_Core_Entity_MultipartFormCollection_GetFile_System_String_) | Retrieves a [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) instance by its file name. |
| [GetItem\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetItem.md#Sisk_Core_Entity_MultipartFormCollection_GetItem_System_String_) | Gets the last form item by their name. This search is case-insensitive. |
| [GetItems\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetItems.md#Sisk_Core_Entity_MultipartFormCollection_GetItems_System_String_) | Gets all form items that shares the specified name. This search is case-insensitive. |
| [GetStringValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetStringValue.md#Sisk_Core_Entity_MultipartFormCollection_GetStringValue_System_String_) | Gets an [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) object from the form item content string. This method reads the contents of the last matched last item with the request encoding. |
| [ToArray\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.ToArray.md#Sisk_Core_Entity_MultipartFormCollection_ToArray) | Creates an array with the [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) in this collection. |
| [TryGetValue\(string, out MultipartObject\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.TryGetValue.md#Sisk_Core_Entity_MultipartFormCollection_TryGetValue_System_String_Sisk_Core_Entity_MultipartObject__) |  |
