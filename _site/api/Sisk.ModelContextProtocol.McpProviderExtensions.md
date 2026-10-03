# McpProviderExtensions

Kind: Class  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.html

Provides extension methods for configuring and handling requests with the Model Context Protocol (MCP).

```csharp
public static class McpProviderExtensions
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[McpProviderExtensions](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Methods

| Name | Description |
| --- | --- |
| [HandleMcpRequestAsync\(HttpRequest, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.HandleMcpRequestAsync.md#Sisk_ModelContextProtocol_McpProviderExtensions_HandleMcpRequestAsync_Sisk_Core_Http_HttpRequest_System_Threading_CancellationToken_) | Handles an incoming HTTP request using the configured MCP provider. |
| [UseMcp\(HttpServerHostContextBuilder, McpProvider\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.UseMcp.md#Sisk_ModelContextProtocol_McpProviderExtensions_UseMcp_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_Sisk_ModelContextProtocol_McpProvider_) | Configures the HTTP server host builder to use a specific MCP provider. |
| [UseMcp\(HttpServerHostContextBuilder, Action<McpProvider\>\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProviderExtensions.UseMcp.md#Sisk_ModelContextProtocol_McpProviderExtensions_UseMcp_Sisk_Core_Http_Hosting_HttpServerHostContextBuilder_System_Action_Sisk_ModelContextProtocol_McpProvider__) | Configures the HTTP server host builder to use an MCP provider built with the provided action. |
