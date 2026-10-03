# HttpHeaderCollection.IfMatch

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.IfMatch.html

## IfMatch {#Sisk_Core_Entity_HttpHeaderCollection_IfMatch}

Gets the value of the HTTP If-Match header.

Used to make a conditional request, allowing the client to specify that the request should only be processed if the resource matches the given ETag.

```csharp
public string? IfMatch { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
