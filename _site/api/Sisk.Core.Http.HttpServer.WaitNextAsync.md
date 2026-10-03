# HttpServer.WaitNextAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNextAsync.html

## WaitNextAsync(TimeSpan) {#Sisk_Core_Http_HttpServer_WaitNextAsync_System_TimeSpan_}

Asynchronously waits for the next HTTP request to be processed, with a specified timeout.

```csharp
public Task<HttpServerExecutionResult> WaitNextAsync(TimeSpan timeout = default)
```

### Parameters

`timeout` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time span to wait for the next request. If not specified, the default timeout is used.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)\>

A task that represents the asynchronous operation. The task result contains the result of the HTTP server execution.

## WaitNextAsync(CancellationToken) {#Sisk_Core_Http_HttpServer_WaitNextAsync_System_Threading_CancellationToken_}

Asynchronously waits for the next HTTP request to be processed, with a specified cancellation token.

```csharp
public Task<HttpServerExecutionResult> WaitNextAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to signal when the operation should be cancelled.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)\>

A task that represents the asynchronous operation. The task result contains the result of the HTTP server execution.
