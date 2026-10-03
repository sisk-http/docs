# RoutingErrorCallback

Kind: Delegate  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutingErrorCallback.html

Represents the function that is called when an request reaches an error on the 
router.

```csharp
public delegate HttpResponse RoutingErrorCallback(HttpContext context)
```

#### Parameters

`context` [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)

#### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)
