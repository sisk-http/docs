# StringKeyStoreCollection.GetValue

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.GetValue.html

## GetValue(string) {#Sisk_Core_Entity_StringKeyStoreCollection_GetValue_System_String_}

Retrieves the last value associated with the specified key.
Returns [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the key does not exist.

```csharp
public string? GetValue(string name)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to retrieve the value.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)?

The last value associated with the specified key, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the key is not found.
