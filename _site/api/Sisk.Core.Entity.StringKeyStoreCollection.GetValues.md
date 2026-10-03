# StringKeyStoreCollection.GetValues

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValues.html

## GetValues(string) {#Sisk_Core_Entity_StringKeyStoreCollection_GetValues_System_String_}

Retrieves all values associated with the specified key.
Returns an empty array if the key does not exist.

```csharp
public string[] GetValues(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to retrieve the values.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

An array of values associated with the specified key, or an empty array if the key is not found.
