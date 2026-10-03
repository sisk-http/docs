# HttpHeaderCollection.AccessControlAllowCredentials

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.AccessControlAllowCredentials.html

## AccessControlAllowCredentials {#Sisk_Core_Entity_HttpHeaderCollection_AccessControlAllowCredentials}

Gets or sets the value of the HTTP Access-Control-Allow-Credentials header.

Indicates whether the response to the request can expose credentials, allowing cross-origin requests to include credentials.

```csharp
public string? AccessControlAllowCredentials { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: this header can be overwritten by the current [CrossOriginResourceSharingHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.md) configuration.
