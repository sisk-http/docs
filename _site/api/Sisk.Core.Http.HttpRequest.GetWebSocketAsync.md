# HttpRequest.GetWebSocketAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetWebSocketAsync.html

## GetWebSocketAsync(string?, string?) {#Sisk_Core_Http_HttpRequest_GetWebSocketAsync_System_String_System_String_}

Asynchronously accepts and acquires a websocket for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in
streaming state.

```csharp
public Task<HttpWebSocket> GetWebSocketAsync(string? subprotocol = null, string? identifier = null)
```

### Parameters

`subprotocol` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Determines the sub-protocol to plug the websocket in.

`identifier` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Defines an label to the Web Socket connection, useful for finding this connection's reference later.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)\>

A task that represents the asynchronous operation, returning an instance of [HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md) representing the accepted websocket connection.
