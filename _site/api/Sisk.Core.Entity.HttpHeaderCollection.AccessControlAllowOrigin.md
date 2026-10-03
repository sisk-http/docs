# HttpHeaderCollection.AccessControlAllowOrigin

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.AccessControlAllowOrigin.html

## AccessControlAllowOrigin {#Sisk_Core_Entity_HttpHeaderCollection_AccessControlAllowOrigin}

Gets or sets the value of the HTTP Access-Control-Allow-Origin header.

Specifies which origins are allowed to access the resource in a CORS context, helping to control cross-origin requests.

```csharp
public string? AccessControlAllowOrigin { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: this header can be overwritten by the current [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) configuration.
