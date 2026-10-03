# HttpHostHandler.OnContextCreatedAsync

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnContextCreatedAsync.html

## OnContextCreatedAsync(HttpHost, HttpHostContext) {#Sisk_Cadente_HttpHostHandler_OnContextCreatedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostContext_}

Called when a new context is created for the specified HTTP host.

```csharp
public virtual Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
```

### Parameters

`host` [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md)

The HTTP host that created the context.

`context` [HttpHostContext](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.md)

The newly created context.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous operation.
