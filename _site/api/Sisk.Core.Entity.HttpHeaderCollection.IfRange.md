# HttpHeaderCollection.IfRange

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.IfRange.html

## IfRange {#Sisk_Core_Entity_HttpHeaderCollection_IfRange}

Gets the value of the HTTP If-Range header.

Used to make a conditional range request, allowing the client to specify that the range should only be returned if the resource has not changed.

```csharp
public string? IfRange { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
