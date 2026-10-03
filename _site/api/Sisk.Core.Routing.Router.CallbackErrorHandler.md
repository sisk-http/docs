# Router.CallbackErrorHandler

Kind: Property  
Namespace: `Sisk.Core.Routing`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.html

## CallbackErrorHandler {#Sisk_Core_Routing_Router_CallbackErrorHandler}

Gets or sets the Router action exception handler. The response handler for this property will
send an HTTP response to the client when an exception is caught during execution. This property
is only called when [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is disabled.

```csharp
public ExceptionErrorCallback? CallbackErrorHandler { get; set; }
```

### Property Value

[ExceptionErrorCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ExceptionErrorCallback.md)?
