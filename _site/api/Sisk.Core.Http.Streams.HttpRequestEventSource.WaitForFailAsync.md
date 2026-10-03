# HttpRequestEventSource.WaitForFailAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFailAsync.html

## WaitForFailAsync(TimeSpan) {#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFailAsync_System_TimeSpan_}

Asynchronously waits for the event source to fail or reach the specified idle tolerance.

```csharp
public Task WaitForFailAsync(TimeSpan maximumIdleTolerance)
```

### Parameters

`maximumIdleTolerance` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The maximum time to wait before considering the event source failed.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that completes when the event source fails or the idle tolerance is reached.

## WaitForFailAsync(CancellationToken) {#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFailAsync_System_Threading_CancellationToken_}

Asynchronously waits for the event source to fail or be canceled.

```csharp
public Task WaitForFailAsync(CancellationToken cancellation)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A token to cancel the wait operation.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that completes when the event source fails or is canceled.
