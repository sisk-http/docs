# HttpHeaderCollection.XForwardedFor

Kind: Property  
Namespace: `Sisk.Core.Entity`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.XForwardedFor.html

## XForwardedFor {#Sisk_Core_Entity_HttpHeaderCollection_XForwardedFor}

Gets the value of the HTTP X-Forwarded-For header.

Used to identify the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer.

```csharp
public string? XForwardedFor { get; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

Tip: use the [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForwardingResolver.md) property to obtain the user client proxied IP throught [RemoteAddress](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RemoteAddress.md).
