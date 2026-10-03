# HttpRequest.IsSecure

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsSecure.html

## IsSecure {#Sisk_Core_Http_HttpRequest_IsSecure}

Gets a boolean indicating whether this request was locally made by an secure
transport context (SSL/TLS) or not.

```csharp
public bool IsSecure { get; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Remarks

This property brings local request data, so it may not reflect the original client request when used with proxy or CDNs.
