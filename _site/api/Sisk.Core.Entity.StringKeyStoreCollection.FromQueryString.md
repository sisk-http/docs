# StringKeyStoreCollection.FromQueryString

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromQueryString.html

## FromQueryString(string) {#Sisk_Core_Entity_StringKeyStoreCollection_FromQueryString_System_String_}

Creates a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) from a query string.
The query string should be in the format of "key1=value1&amp;key2=value2".

```csharp
public static StringKeyStoreCollection FromQueryString(string queryString)
```

### Parameters

`queryString` [string](https://learn.microsoft.com/dotnet/api/system.string)

The query string containing the key-value pairs to import.

### Returns

[StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md)

A new [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) populated with the key-value pairs from the query string.
