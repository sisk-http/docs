# HttpContext.Interlocked

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Interlocked.html

## Interlocked {#Sisk_Core_Http_HttpContext_Interlocked}

Gets the atomic numeric operations available for values stored in [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md).

```csharp
public HttpContext.HttpContextInterlocked Interlocked { get; }
```

### Property Value

[HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md).[HttpContextInterlocked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.md)

### Remarks

Atomicity is guaranteed only between operations performed through this property. Concurrent direct
access to [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md) is not synchronized by these operations.
