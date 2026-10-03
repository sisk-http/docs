# RouterModule.HasRequestHandler

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.HasRequestHandler.html

## HasRequestHandler(IRequestHandler) {#Sisk_Core_Routing_RouterModule_HasRequestHandler_Sisk_Core_Routing_IRequestHandler_}

Registers an [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) on all routes defined by this module.

```csharp
protected void HasRequestHandler(IRequestHandler handler)
```

### Parameters

`handler` [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md)

The [IRequestHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.IRequestHandler.md) instance which will be applied to all registered routes
            of this class.
