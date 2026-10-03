# HttpRequest.GetWebSocket

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetWebSocket.html

## GetWebSocket(string?, string?) {#Sisk_Core_Http_HttpRequest_GetWebSocket_System_String_System_String_}

Accepts and acquires a websocket for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in
streaming state.

```csharp
public HttpWebSocket GetWebSocket(string? subprotocol = null, string? identifier = null)
```

### Parameters

`subprotocol` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Determines the sub-protocol to plug the websocket in.

`identifier` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Optional. Defines an label to the Web Socket connection, useful for finding this connection's reference later.

### Returns

[HttpWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpWebSocket.md)
