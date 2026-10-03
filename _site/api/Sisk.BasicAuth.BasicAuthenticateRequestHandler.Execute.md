# BasicAuthenticateRequestHandler.Execute

Kind: Method  
Namespace: `Sisk.BasicAuth`  
Assembly: `Sisk.BasicAuth.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.BasicAuth.BasicAuthenticateRequestHandler.Execute.html

## Execute(HttpRequest, HttpContext) {#Sisk_BasicAuth_BasicAuthenticateRequestHandler_Execute_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_}

This method is called by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) before executing a request when the [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instantiates an object that implements this interface. If it returns
a [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object, the route callback is not called and all execution of the route is stopped. If it returns "null", the execution is continued.

```csharp
public HttpResponse? Execute(HttpRequest request, HttpContext context)
```

### Parameters

`request` HttpRequest

`context` HttpContext

### Returns

 HttpResponse?
