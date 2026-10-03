# HttpHeaderCollection.ContentEncoding

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.ContentEncoding.html

## ContentEncoding {#Sisk_Core_Entity_HttpHeaderCollection_ContentEncoding}

Gets or sets the value of the HTTP Content-Encoding header.

Specifies the encoding transformations that have been applied to the response body, such as gzip or deflate. This
header should not be interpreted as the content text charset.

```csharp
public string? ContentEncoding { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
