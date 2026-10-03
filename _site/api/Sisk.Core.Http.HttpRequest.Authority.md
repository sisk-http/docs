# HttpRequest.Authority

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Authority.html

## Authority {#Sisk_Core_Http_HttpRequest_Authority}

Get the requested host header with the port from this HTTP request.

```csharp
public string Authority { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)

### Remarks

This property brings local request data, so it may not reflect the original client request when used with proxy or CDNs.
