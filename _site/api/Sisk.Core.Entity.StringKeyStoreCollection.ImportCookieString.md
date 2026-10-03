# StringKeyStoreCollection.ImportCookieString

Kind: Method  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.ImportCookieString.html

## ImportCookieString(string) {#Sisk_Core_Entity_StringKeyStoreCollection_ImportCookieString_System_String_}

Imports key-value pairs from a cookie string into the [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md).
The query string should be in the format of "key1=value1; key2=value2".

```csharp
public void ImportCookieString(string queryString)
```

### Parameters

`queryString` [string](https://learn.microsoft.com/dotnet/api/system.string)

The query string containing the key-value pairs to import.
