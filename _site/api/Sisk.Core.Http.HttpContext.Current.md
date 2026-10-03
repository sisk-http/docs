# HttpContext.Current

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.html

## Current {#Sisk_Core_Http_HttpContext_Current}

Gets the current running [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md).

```csharp
public static HttpContext Current { get; }
```

### Property Value

[HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)

### Remarks

This property is only accessible during an HTTP session, within the executing HTTP code.
