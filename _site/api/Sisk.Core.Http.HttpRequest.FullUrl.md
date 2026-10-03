# HttpRequest.FullUrl

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullUrl.html

## FullUrl {#Sisk_Core_Http_HttpRequest_FullUrl}

Gets the full URL for this request, with scheme, host, port, path and query.

```csharp
public string FullUrl { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)

### Remarks

This property brings local request data, so it may not reflect the original client request when used with proxy or CDNs.
