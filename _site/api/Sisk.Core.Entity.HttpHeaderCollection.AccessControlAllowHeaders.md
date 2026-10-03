# HttpHeaderCollection.AccessControlAllowHeaders

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.AccessControlAllowHeaders.html

## AccessControlAllowHeaders {#Sisk_Core_Entity_HttpHeaderCollection_AccessControlAllowHeaders}

Gets or sets the value of the HTTP Access-Control-Allow-Headers header.

Specifies which headers can be used when making the actual request in a cross-origin resource sharing (CORS) context.

```csharp
public string? AccessControlAllowHeaders { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: this header can be overwritten by the current [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) configuration.
