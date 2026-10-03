# HttpServerEngine.BeginGetContext

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.BeginGetContext.html

## BeginGetContext(AsyncCallback?, object?) {#Sisk_Core_Http_Engine_HttpServerEngine_BeginGetContext_System_AsyncCallback_System_Object_}

Begins an asynchronous operation to get an HTTP context.

```csharp
public abstract IAsyncResult BeginGetContext(AsyncCallback? callback, object? state)
```

### Parameters

`callback` [AsyncCallback](https://learn.microsoft.com/dotnet/api/system.asynccallback)?

The [AsyncCallback](https://learn.microsoft.com/dotnet/api/system.asynccallback) delegate.

`state` [object](https://learn.microsoft.com/dotnet/api/system.object)?

An object that provides state information for the asynchronous operation.

### Returns

[IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult)

An [IAsyncResult](https://learn.microsoft.com/dotnet/api/system.iasyncresult) that references the asynchronous operation.
