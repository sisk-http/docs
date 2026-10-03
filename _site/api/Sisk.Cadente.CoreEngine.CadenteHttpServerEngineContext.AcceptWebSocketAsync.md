# CadenteHttpServerEngineContext.AcceptWebSocketAsync

Kind: Method  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineContext.AcceptWebSocketAsync.html

## AcceptWebSocketAsync(string?) {#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineContext_AcceptWebSocketAsync_System_String_}

Accepts a WebSocket connection asynchronously.

```csharp
public override Task<HttpServerEngineWebSocket> AcceptWebSocketAsync(string? subProtocol)
```

### Parameters

`subProtocol` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The subprotocol to use for the WebSocket connection.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<HttpServerEngineWebSocket\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) representing the asynchronous operation. The result contains the [HttpServerEngineWebSocket](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineWebSocket.md).
