# HttpHeaderCollection.AccessControlMaxAge

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.AccessControlMaxAge.html

## AccessControlMaxAge {#Sisk_Core_Entity_HttpHeaderCollection_AccessControlMaxAge}

Gets or sets the value of the HTTP Access-Control-Max-Age header.

Specifies how long the results of a preflight request can be cached, reducing the number of preflight requests made.

```csharp
public string? AccessControlMaxAge { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: this header can be overwritten by the current [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) configuration.
