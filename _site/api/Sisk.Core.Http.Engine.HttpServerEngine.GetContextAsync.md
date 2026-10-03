# HttpServerEngine.GetContextAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngine.GetContextAsync.html

## GetContextAsync(CancellationToken) {#Sisk_Core_Http_Engine_HttpServerEngine_GetContextAsync_System_Threading_CancellationToken_}

Asynchronously obtains an [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md).

```csharp
public abstract Task<HttpServerEngineContext> GetContextAsync(CancellationToken cancellationToken = default)
```

### Parameters

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) used to cancel the operation. The default value is [`default`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/default).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md)\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that represents the asynchronous operation, containing the [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md).
