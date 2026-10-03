# HttpRequestEventSource.SendAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync.html

## SendAsync(string?, string) {#Sisk_Core_Http_Streams_HttpRequestEventSource_SendAsync_System_String_System_String_}

Asynchronously sends an event to the client over the HTTP connection.

```csharp
public ValueTask<bool> SendAsync(string? data, string fieldName = "data")
```

### Parameters

`data` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The data to be sent as part of the event.

`fieldName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The field name for the event data. Defaults to "data".

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask\-1)<[bool](https://learn.microsoft.com/dotnet/api/system.boolean)\>

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous operation. The result is true if the event was sent successfully, false otherwise.
