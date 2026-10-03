# HttpRequest.GetEventSource

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.html

## GetEventSource(string?) {#Sisk_Core_Http_HttpRequest_GetEventSource_System_String_}

Gets an Event Source interface for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in it's
event source listening state.

```csharp
public HttpRequestEventSource GetEventSource(string? identifier = null)
```

### Parameters

`identifier` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Defines an label to the EventStream connection, useful for finding this connection's reference later.

### Returns

[HttpRequestEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.md)
