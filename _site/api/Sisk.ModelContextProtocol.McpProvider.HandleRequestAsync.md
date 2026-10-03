# McpProvider.HandleRequestAsync

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync.html

## HandleRequestAsync(HttpRequest, CancellationToken) {#Sisk_ModelContextProtocol_McpProvider_HandleRequestAsync_Sisk_Core_Http_HttpRequest_System_Threading_CancellationToken_}

Handles an incoming HTTP request for MCP operations asynchronously.

```csharp
public Task<HttpResponse> HandleRequestAsync(HttpRequest request, CancellationToken cancellation = default)
```

### Parameters

`request` HttpRequest

The incoming HTTP request.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A token to observe for cancellation requests.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<HttpResponse\>

An HTTP response representing the result of the request handling.
