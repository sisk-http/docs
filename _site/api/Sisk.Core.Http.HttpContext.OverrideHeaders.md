# HttpContext.OverrideHeaders

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.OverrideHeaders.html

## OverrideHeaders {#Sisk_Core_Http_HttpContext_OverrideHeaders}

Gets or sets an [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) indicating HTTP headers which
will overwrite headers set by CORS, router response or request handlers.

```csharp
public HttpHeaderCollection OverrideHeaders { get; set; }
```

### Property Value

[HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md)

### Remarks

This property replaces existing headers in the final response. Use [ExtraHeaders](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.ExtraHeaders.md) to
add headers without replacing existing ones.
