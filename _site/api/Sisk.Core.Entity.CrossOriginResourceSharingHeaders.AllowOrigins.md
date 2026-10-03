# CrossOriginResourceSharingHeaders.AllowOrigins

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins.html

## AllowOrigins {#Sisk_Core_Entity_CrossOriginResourceSharingHeaders_AllowOrigins}

Gets or sets domains which will define the source header according to one of the domains present below.

```csharp
public string[] AllowOrigins { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)\[\]

### Remarks

This property makes the server compare the origin of the request and associate the domain that corresponds to it.
