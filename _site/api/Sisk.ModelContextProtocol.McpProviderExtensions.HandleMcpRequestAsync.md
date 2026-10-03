# McpProviderExtensions.HandleMcpRequestAsync

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.HandleMcpRequestAsync.html

## HandleMcpRequestAsync(HttpRequest, CancellationToken) {#Sisk_ModelContextProtocol_McpProviderExtensions_HandleMcpRequestAsync_Sisk_Core_Http_HttpRequest_System_Threading_CancellationToken_}

Handles an incoming HTTP request using the configured MCP provider.

```csharp
public static Task<HttpResponse> HandleMcpRequestAsync(this HttpRequest request, CancellationToken cancellation = default)
```

### Parameters

`request` HttpRequest

The HTTP request to handle.

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A token to monitor for cancellation requests.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<HttpResponse\>

A task that represents the asynchronous operation, containing the HTTP response.

### Exceptions

[InvalidOperationException](https://learn.microsoft.com/dotnet/api/system.invalidoperationexception)

Thrown if the MCP provider has not been configured.
