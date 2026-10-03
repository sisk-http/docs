# HttpHostHandler.OnClientDisconnectedAsync

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnClientDisconnectedAsync.html

## OnClientDisconnectedAsync(HttpHost, HttpHostClient) {#Sisk_Cadente_HttpHostHandler_OnClientDisconnectedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostClient_}

Called when a client disconnects from the specified HTTP host.

```csharp
public virtual Task OnClientDisconnectedAsync(HttpHost host, HttpHostClient client)
```

### Parameters

`host` [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md)

The HTTP host that the client disconnected from.

`client` [HttpHostClient](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostClient.md)

The client that disconnected from the host.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous operation.
