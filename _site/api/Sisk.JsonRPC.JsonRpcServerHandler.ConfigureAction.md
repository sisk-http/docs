# JsonRpcServerHandler.ConfigureAction

Kind: Event  
Namespace: `Sisk.JsonRPC`  
Assembly: `Sisk.JsonRPC.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerHandler.ConfigureAction.html

## ConfigureAction {#Sisk_JsonRPC_JsonRpcServerHandler_ConfigureAction}

Gets or sets the action which will be called in the configuring [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md)
with this handler.

```csharp
public event EventHandler<JsonRpcServerConfigurationEventArgs>? ConfigureAction
```

### Event Type

[EventHandler](https://learn.microsoft.com/dotnet/api/system.eventhandler\-1)<[JsonRpcServerConfigurationEventArgs](https://docs.sisk-framework.org/api/Sisk.JsonRPC.JsonRpcServerConfigurationEventArgs.md)\>?
