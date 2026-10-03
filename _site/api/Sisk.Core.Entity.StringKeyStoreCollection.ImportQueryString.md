# StringKeyStoreCollection.ImportQueryString

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportQueryString.html

## ImportQueryString(string) {#Sisk_Core_Entity_StringKeyStoreCollection_ImportQueryString_System_String_}

Imports key-value pairs from a query string into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).
The query string should be in the format of "key1=value1&amp;key2=value2".

```csharp
public void ImportQueryString(string queryString)
```

### Parameters

`queryString` [string](https://learn.microsoft.com/dotnet/api/system.string)

The query string containing the key-value pairs to import.
