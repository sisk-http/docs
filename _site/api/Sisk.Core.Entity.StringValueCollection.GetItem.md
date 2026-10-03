# StringValueCollection.GetItem

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.GetItem.html

## GetItem(string) {#Sisk_Core_Entity_StringValueCollection_GetItem_System_String_}

Gets an [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) from their key name. If the object was
not found by their name, an empty non-null [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) with no value is
returned.

```csharp
public StringValue GetItem(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

### Returns

[StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md)
