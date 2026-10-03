# RouterModule.OnSetup

Kind: Method  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnSetup.html

## OnSetup(Router) {#Sisk_Core_Routing_RouterModule_OnSetup_Sisk_Core_Routing_Router_}

Method that is called when an [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is defining routes from the current
[RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md).

```csharp
protected virtual void OnSetup(Router parentRouter)
```

### Parameters

`parentRouter` [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)

The [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) which is defining routes from the current [RouterModule](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.md).

### Remarks

The base method [OnSetup](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterModule.OnSetup.md) is mandatory to be called on all derived methods.
