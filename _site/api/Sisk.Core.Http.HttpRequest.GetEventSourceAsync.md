# HttpRequest.GetEventSourceAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSourceAsync.html

## GetEventSourceAsync(string?) {#Sisk_Core_Http_HttpRequest_GetEventSourceAsync_System_String_}

Asynchronously gets an Event Source interface for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in its
event source listening state.

```csharp
public Task<HttpRequestEventSource> GetEventSourceAsync(string? identifier = null)
```

### Parameters

`identifier` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Defines a label to the EventStream connection, useful for finding this connection's reference later.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that represents the asynchronous operation, containing an [HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md) instance representing the event source for this request.
