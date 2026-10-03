# HttpHeaderCollection.AccessControlExposeHeaders

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.AccessControlExposeHeaders.html

## AccessControlExposeHeaders {#Sisk_Core_Entity_HttpHeaderCollection_AccessControlExposeHeaders}

Gets or sets the value of the HTTP Access-Control-Expose-Headers header.

Indicates which headers can be exposed as part of the response to a cross-origin request.

```csharp
public string? AccessControlExposeHeaders { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: this header can be overwritten by the current [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) configuration.
