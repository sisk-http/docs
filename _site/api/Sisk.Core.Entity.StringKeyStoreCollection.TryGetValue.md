# StringKeyStoreCollection.TryGetValue

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.TryGetValue.html

## TryGetValue(string, out string[]) {#Sisk_Core_Entity_StringKeyStoreCollection_TryGetValue_System_String_System_String____}

Tries to get the array of values associated with the specified key.

```csharp
public bool TryGetValue(string key, out string[] value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to retrieve the values.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

When this method returns, contains the array of values associated with the specified key, or an empty array if the key is not found.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the key was found and the values were retrieved; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
