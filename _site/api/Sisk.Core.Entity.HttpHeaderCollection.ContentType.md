# HttpHeaderCollection.ContentType

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.ContentType.html

## ContentType {#Sisk_Core_Entity_HttpHeaderCollection_ContentType}

Gets or sets the value of the HTTP Content-Type header.

Indicates the media type of the resource, allowing the client to understand how to process the response body.

```csharp
public string? ContentType { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Note: setting the value of this header, the value present in the response's [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) will be overwritten.
