# MultipartFormCollection.GetStringValue

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.GetStringValue.html

## GetStringValue(string) {#Sisk_Core_Entity_MultipartFormCollection_GetStringValue_System_String_}

Gets an [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) object from the form item
content string. This method reads the contents of the last matched last item with the
request encoding.

```csharp
public StringValue GetStringValue(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The form item name.

### Returns

[StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md)
