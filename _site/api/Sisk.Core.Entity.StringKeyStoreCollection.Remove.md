# StringKeyStoreCollection.Remove

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.Remove.html

## Remove(string) {#Sisk_Core_Entity_StringKeyStoreCollection_Remove_System_String_}

Removes the value associated with the specified key from the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).
Throws an exception if the store is read-only.

```csharp
public bool Remove(string key)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key of the value to remove.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the key was successfully removed; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
