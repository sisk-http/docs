# StringKeyStoreCollection.ImportNameValueCollection

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportNameValueCollection.html

## ImportNameValueCollection(NameValueCollection) {#Sisk_Core_Entity_StringKeyStoreCollection_ImportNameValueCollection_System_Collections_Specialized_NameValueCollection_}

Imports key-value pairs from a [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection) into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).
Each key can have multiple associated values.

```csharp
public void ImportNameValueCollection(NameValueCollection items)
```

### Parameters

`items` [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection)

The [NameValueCollection](https://learn.microsoft.com/dotnet/api/system.collections.specialized.namevaluecollection) containing the key-value pairs to import.
