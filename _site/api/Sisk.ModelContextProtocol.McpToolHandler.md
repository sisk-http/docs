# McpToolHandler

Kind: Delegate  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolHandler.html

Represents a delegate that handles the execution of an MCP tool.

```csharp
public delegate Task<McpToolResult> McpToolHandler(McpToolContext context)
```

#### Parameters

`context` [McpToolContext](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolContext.md)

The context in which the tool is executed.

#### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)\>

A task that, when completed, yields the [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) of the tool execution.
