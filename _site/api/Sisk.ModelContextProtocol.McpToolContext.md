# McpToolContext

Kind: Class  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.html

Provides context for the execution of an MCP tool.

```csharp
public sealed class McpToolContext
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[McpToolContext](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [McpToolContext\(\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.-ctor.md#Sisk_ModelContextProtocol_McpToolContext__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [Arguments](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.Arguments.md#Sisk_ModelContextProtocol_McpToolContext_Arguments) | Gets the arguments provided for the tool execution as a JSON object. |
| [Cancellation](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.Cancellation.md#Sisk_ModelContextProtocol_McpToolContext_Cancellation) | Gets a token to observe for cancellation requests. |
| [Metadata](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.Metadata.md#Sisk_ModelContextProtocol_McpToolContext_Metadata) | Gets any additional metadata associated with the tool execution. |
| [Request](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.Request.md#Sisk_ModelContextProtocol_McpToolContext_Request) | Gets the incoming HTTP request that triggered the tool execution. |
| [Server](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.Server.md#Sisk_ModelContextProtocol_McpToolContext_Server) | Gets the MCP server instance associated with the current context. |
| [ToolName](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.ToolName.md#Sisk_ModelContextProtocol_McpToolContext_ToolName) | Gets the name of the tool being executed. |
