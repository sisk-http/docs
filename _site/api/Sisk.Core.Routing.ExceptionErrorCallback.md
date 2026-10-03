# ExceptionErrorCallback

Kind: Delegate  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.ExceptionErrorCallback.html

Represents the function that is called after the route action threw an exception.

```csharp
public delegate HttpResponse ExceptionErrorCallback(Exception ex, HttpContext context)
```

#### Parameters

`ex` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

`context` [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)

#### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)
