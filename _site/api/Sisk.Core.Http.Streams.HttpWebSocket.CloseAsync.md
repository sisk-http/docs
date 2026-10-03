# HttpWebSocket.CloseAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.CloseAsync.html

## CloseAsync(CancellationToken) {#Sisk_Core_Http_Streams_HttpWebSocket_CloseAsync_System_Threading_CancellationToken_}

Closes the WebSocket connection asynchronously.

```csharp
public Task<HttpResponse> CloseAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

The [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to use for cancellation.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that represents the asynchronous close operation, 
            which returns an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) indicating the result of the close operation.
