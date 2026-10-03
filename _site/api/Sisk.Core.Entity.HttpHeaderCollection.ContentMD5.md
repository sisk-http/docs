# HttpHeaderCollection.ContentMD5

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.ContentMD5.html

## ContentMD5 {#Sisk_Core_Entity_HttpHeaderCollection_ContentMD5}

Gets or sets the value of the HTTP Content-MD5 header.

Contains the MD5 hash of the response body in an base-64 format, allowing clients to verify the integrity of the received data.

```csharp
public string? ContentMD5 { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?
