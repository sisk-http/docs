# HttpServer.WaitNext

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WaitNext.html

## WaitNext(TimeSpan) {#Sisk_Core_Http_HttpServer_WaitNext_System_TimeSpan_}

Waits for the next HTTP request to be processed, with a specified timeout.

```csharp
public HttpServerExecutionResult WaitNext(TimeSpan timeout = default)
```

### Parameters

`timeout` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time span to wait for the next request. If not specified, the default timeout is used.

### Returns

[HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

The result of the HTTP server execution.

## WaitNext(CancellationToken) {#Sisk_Core_Http_HttpServer_WaitNext_System_Threading_CancellationToken_}

Waits for the next HTTP request to be processed, with a specified cancellation token.

```csharp
public HttpServerExecutionResult WaitNext(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The cancellation token to signal when the operation should be cancelled.

### Returns

[HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md)

The result of the HTTP server execution.
