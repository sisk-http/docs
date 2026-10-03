# Router.ResolveActionResult

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.ResolveActionResult.html

## ResolveActionResult(object?) {#Sisk_Core_Routing_Router_ResolveActionResult_System_Object_}

Resolves the specified object into an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) using the defined
value handlers or throws an exception if not possible.

```csharp
public HttpResponse ResolveActionResult(object? result)
```

### Parameters

`result` [object](https://learn.microsoft.com/dotnet/api/system.object)?

The object that will be converted to an valid [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md).

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

### Remarks

This method can throw exceptions. To avoid exceptions while trying to convert the specified object
into an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md), consider using [TryResolveActionResult](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.TryResolveActionResult.md).
