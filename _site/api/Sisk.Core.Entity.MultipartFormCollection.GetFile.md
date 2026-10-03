# MultipartFormCollection.GetFile

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetFile.html

## GetFile(string) {#Sisk_Core_Entity_MultipartFormCollection_GetFile_System_String_}

Retrieves a [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) instance by its file name.

```csharp
public MultipartObject? GetFile(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The filename of the [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) to retrieve.

### Returns

[MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md)?

The [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) instance with the specified filename, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if no matching file is found.
