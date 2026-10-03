# MultipartFormCollection.GetItems

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetItems.html

## GetItems(string) {#Sisk_Core_Entity_MultipartFormCollection_GetItems_System_String_}

Gets all form items that shares the specified name. This search is case-insensitive.

```csharp
public MultipartObject[] GetItems(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The form item name.

### Returns

[MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md)\[\]

An array of [MultipartObject](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) with the specified name.
