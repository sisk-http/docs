# HttpRequestEventSource.CloseAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync.html

## CloseAsync() {#Sisk_Core_Http_Streams_HttpRequestEventSource_CloseAsync}

Asynchronously closes the event listener and its connection.

```csharp
public Task<HttpResponse> CloseAsync()
```

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)\>

An [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) indicating the server close response.
