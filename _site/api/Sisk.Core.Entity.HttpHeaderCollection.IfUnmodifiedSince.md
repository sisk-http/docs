# HttpHeaderCollection.IfUnmodifiedSince

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.IfUnmodifiedSince.html

## IfUnmodifiedSince {#Sisk_Core_Entity_HttpHeaderCollection_IfUnmodifiedSince}

Gets the value of the HTTP If-Unmodified-Since header.

Used to make a conditional request, allowing the client to specify that the resource should only be returned if it has not been modified since the given date.

```csharp
public string? IfUnmodifiedSince { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
