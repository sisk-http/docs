# StringKeyStoreCollection.FromNameValueCollection

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.FromNameValueCollection.html

## FromNameValueCollection(NameValueCollection) {#Sisk_Core_Entity_StringKeyStoreCollection_FromNameValueCollection_System_Collections_Specialized_NameValueCollection_}

Creates a new instance of the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) from a [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection).

```csharp
public static StringKeyStoreCollection FromNameValueCollection(NameValueCollection collection)
```

### Parameters

`collection` [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection)

The [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection) containing the key-value pairs to import.

### Returns

[StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md)

A new [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) populated with the key-value pairs from the query string.
