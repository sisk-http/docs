# HttpHostHandler.OnClientConnectedAsync

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostHandler.OnClientConnectedAsync.html

## OnClientConnectedAsync(HttpHost, HttpHostClient) {#Sisk_Cadente_HttpHostHandler_OnClientConnectedAsync_Sisk_Cadente_HttpHost_Sisk_Cadente_HttpHostClient_}

Called when a new client connects to the specified HTTP host.

```csharp
public virtual Task OnClientConnectedAsync(HttpHost host, HttpHostClient client)
```

### Parameters

`host` [HttpHost](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHost.md)

The HTTP host that the client connected to.

`client` [HttpHostClient](https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostClient.md)

The client that connected to the host.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous operation.
