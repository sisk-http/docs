# HttpHeaderCollection.IfModifiedSince

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.IfModifiedSince.html

## IfModifiedSince {#Sisk_Core_Entity_HttpHeaderCollection_IfModifiedSince}

Gets the value of the HTTP If-Modified-Since header.

Used to make a conditional request, allowing the client to specify that the resource should only be returned if it has been modified since the given date.

```csharp
public string? IfModifiedSince { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
