# MultipartObject

Kind: Class  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.html

Represents an multipart/form-data object.

```csharp
public sealed class MultipartObject : IEquatable<MultipartObject>
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md)

#### Implements

[IEquatable<MultipartObject\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1)

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
| [ContentBytes](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ContentBytes.md#Sisk_Core_Entity_MultipartObject_ContentBytes) | Gets this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) form data content in bytes. |
| [ContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ContentLength.md#Sisk_Core_Entity_MultipartObject_ContentLength) | Gets this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) form data content length in byte count. |
| [ContentType](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ContentType.md#Sisk_Core_Entity_MultipartObject_ContentType) | Gets the Content-Type header value from this multipart-object. |
| [Filename](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.Filename.md#Sisk_Core_Entity_MultipartObject_Filename) | Gets this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) provided file name. If this object ins't disposing a file, nothing is returned. |
| [HasContents](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.HasContents.md#Sisk_Core_Entity_MultipartObject_HasContents) | Gets an boolean indicating if this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) has contents or not. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.Headers.md#Sisk_Core_Entity_MultipartObject_Headers) | Gets this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) headers. |
| [IsFile](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.IsFile.md#Sisk_Core_Entity_MultipartObject_IsFile) | Gets an boolean indicating if this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) is a file or not. |
| [Name](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.Name.md#Sisk_Core_Entity_MultipartObject_Name) | Gets this [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) field name. |

## Methods

| Name | Description |
| --- | --- |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.Equals.md#Sisk_Core_Entity_MultipartObject_Equals_System_Object_) |  |
| [Equals\(MultipartObject?\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.Equals.md#Sisk_Core_Entity_MultipartObject_Equals_Sisk_Core_Entity_MultipartObject_) |  |
| [GetCommonFileFormat\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.GetCommonFileFormat.md#Sisk_Core_Entity_MultipartObject_GetCommonFileFormat) | Determines the image format based in the file header for each image content type. |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.GetHashCode.md#Sisk_Core_Entity_MultipartObject_GetHashCode) |  |
| [ReadContentAsString\(Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ReadContentAsString.md#Sisk_Core_Entity_MultipartObject_ReadContentAsString_System_Text_Encoding_) | Reads the content bytes with the given encoder. |
| [ReadContentAsString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.ReadContentAsString.md#Sisk_Core_Entity_MultipartObject_ReadContentAsString) | Reads the content bytes using the HTTP request content-encoding. |
