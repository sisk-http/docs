# HttpContext.RouterResponse

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RouterResponse.html

## RouterResponse {#Sisk_Core_Http_HttpContext_RouterResponse}

Gets the [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) for this context. This property acessible when a post-executing
[IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) was executed for this router context.

```csharp
public HttpResponse? RouterResponse { get; }
```

### Property Value

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)?
