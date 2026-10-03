# HttpRequestEventSource.Send

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Send.html

## Send(string?, string) {#Sisk_Core_Http_Streams_HttpRequestEventSource_Send_System_String_System_String_}

Sends an event to the client over the HTTP connection.

```csharp
public bool Send(string? data, string fieldName = "data")
```

### Parameters

`data` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The data to be sent as part of the event.

`fieldName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The field name for the event data. Defaults to "data".

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

True if the event was sent successfully, false otherwise.
