# IRequestHandler

Kind: Interface  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.html

Represents an interface that is executed before a request.

```csharp
public interface IRequestHandler
```

## Properties

| Name | Description |
| --- | --- |
| [ExecutionMode](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode.md#Sisk_Core_Routing_IRequestHandler_ExecutionMode) | Gets or sets when this [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) should run. |

## Methods

| Name | Description |
| --- | --- |
| [Execute\(HttpRequest, HttpContext\)](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.Execute.md#Sisk_Core_Routing_IRequestHandler_Execute_Sisk_Core_Http_HttpRequest_Sisk_Core_Http_HttpContext_) | This method is called by the [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) before executing a request when the [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) instantiates an object that implements this interface. If it returns a [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object, the route action is not called and all execution of the route is stopped. If it returns "null", the execution is continued. |
