# Router.RegisterValueHandler<T>

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.RegisterValueHandler.html

## RegisterValueHandler&lt;T>(RouterActionHandlerCallback&lt;T>) {#Sisk_Core_Routing_Router_RegisterValueHandler__1_Sisk_Core_Routing_RouterActionHandlerCallback___0__}

Register an type handling association to converting it to an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object.

```csharp
public void RegisterValueHandler<T>(RouterActionHandlerCallback<T> actionHandler) where T : notnull
```

### Parameters

`actionHandler` [RouterActionHandlerCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterActionHandlerCallback-1.md)<T\>

The function that receives an object of the `T` and returns an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) response from the informed object.

### Type Parameters

`T`
