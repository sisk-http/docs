# RouteAction

Kind: Delegate  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.html

Represents the function that is called after the route is matched with the request.

```csharp
public delegate object RouteAction(HttpRequest request)
```

#### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The received request on the router.

#### Returns

[object](https://learn.microsoft.com/dotnet/api/system.object)
