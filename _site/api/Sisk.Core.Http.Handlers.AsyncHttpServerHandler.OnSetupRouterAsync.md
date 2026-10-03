# AsyncHttpServerHandler.OnSetupRouterAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Handlers`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.AsyncHttpServerHandler.OnSetupRouterAsync.html

## OnSetupRouterAsync(Router) {#Sisk_Core_Http_Handlers_AsyncHttpServerHandler_OnSetupRouterAsync_Sisk_Core_Routing_Router_}

Method that is called when an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is binded to the HTTP server.

```csharp
protected virtual Task OnSetupRouterAsync(Router router)
```

### Parameters

`router` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The router entity which is binded.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
