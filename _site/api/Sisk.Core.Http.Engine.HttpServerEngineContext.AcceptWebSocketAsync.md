# HttpServerEngineContext.AcceptWebSocketAsync

Kind: Method  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContext.AcceptWebSocketAsync.html

## AcceptWebSocketAsync(string?) {#Sisk_Core_Http_Engine_HttpServerEngineContext_AcceptWebSocketAsync_System_String_}

Accepts a WebSocket connection asynchronously.

```csharp
public abstract Task<HttpServerEngineWebSocket> AcceptWebSocketAsync(string? subProtocol)
```

### Parameters

`subProtocol` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The subprotocol to use for the WebSocket connection.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md)\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) representing the asynchronous operation. The result contains the [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md).
