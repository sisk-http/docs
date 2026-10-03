# HttpHeaderCollection.XForwardedHost

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.XForwardedHost.html

## XForwardedHost {#Sisk_Core_Entity_HttpHeaderCollection_XForwardedHost}

Gets the value of the HTTP X-Forwarded-Host header

Used to identify the original host requested by the client in the Host HTTP request header, often used in proxy setups.

```csharp
public string? XForwardedHost { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Tip: use the [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForwardingResolver.md) property to obtain the client requested host throught [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Host.md).
