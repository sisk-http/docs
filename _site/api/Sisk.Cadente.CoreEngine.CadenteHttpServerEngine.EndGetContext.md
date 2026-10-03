# CadenteHttpServerEngine.EndGetContext

Kind: Method  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.EndGetContext.html

## EndGetContext(IAsyncResult) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_EndGetContext_System_IAsyncResult_}

Ends an asynchronous operation to get an HTTP context.

```csharp
public override HttpServerEngineContext EndGetContext(IAsyncResult asyncResult)
```

### Parameters

`asyncResult` [IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult)

The [IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult) that references the pending asynchronous operation.

### Returns

 HttpServerEngineContext

An [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md) representing the HTTP context.
