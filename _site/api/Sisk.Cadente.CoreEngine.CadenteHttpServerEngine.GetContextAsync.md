# CadenteHttpServerEngine.GetContextAsync

Kind: Method  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngine.GetContextAsync.html

## GetContextAsync(CancellationToken) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngine_GetContextAsync_System_Threading_CancellationToken_}

Asynchronously obtains an [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md).

```csharp
public override Task<HttpServerEngineContext> GetContextAsync(CancellationToken cancellationToken = default)
```

### Parameters

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) used to cancel the operation. The default value is [`default`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/default).

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<HttpServerEngineContext\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that represents the asynchronous operation, containing the [HttpServerEngineContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.md).
