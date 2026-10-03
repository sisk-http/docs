# HttpListenerAbstractEngine.EndGetContext

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpListenerAbstractEngine.EndGetContext.html

## EndGetContext(IAsyncResult) {#Sisk_Core_Http_Engine_HttpListenerAbstractEngine_EndGetContext_System_IAsyncResult_}

Ends an asynchronous operation to get an HTTP context.

```csharp
public override HttpServerEngineContext EndGetContext(IAsyncResult asyncResult)
```

### Parameters

`asyncResult` [IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult)

The [IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult) that references the pending asynchronous operation.

### Returns

[HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md)

An [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md) representing the HTTP context.
