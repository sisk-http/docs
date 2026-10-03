# Router.TryResolveActionResult

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.TryResolveActionResult.html

## TryResolveActionResult(object?, out HttpResponse?) {#Sisk_Core_Routing_Router_TryResolveActionResult_System_Object_Sisk_Core_Http_HttpResponse__}

Tries to resolve the specified object into an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) using the defined
value handlers.

```csharp
public bool TryResolveActionResult(object? result, out HttpResponse? response)
```

### Parameters

`result` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object that will be converted to an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md).

`response` [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?

When this method returns, the response object. This parameter is not initialized.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

When this method returns, the [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object.
