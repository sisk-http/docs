# StringValueCollection.TryGetValue

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.TryGetValue.html

## TryGetValue(string, out StringValue) {#Sisk_Core_Entity_StringValueCollection_TryGetValue_System_String_Sisk_Core_Entity_StringValue__}

Tries to get the last [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) associated with the specified key.

```csharp
public bool TryGetValue(string key, out StringValue value)
```

### Parameters

`key` [string](https://learn.microsoft.com/dotnet/api/system.string)

The key for which to retrieve the values.

`value` [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md)

When this method returns, the [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) containing the value, or empty [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md).

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if the key was found; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
