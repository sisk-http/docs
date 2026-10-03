# McpToolResult.Combine

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.Combine.html

## Combine(params McpToolResult[]) {#Sisk_ModelContextProtocol_McpToolResult_Combine_Sisk_ModelContextProtocol_McpToolResult___}

Combines multiple [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) objects into a single result.
If the input contains a single result, it is returned directly. Otherwise,
all individual results are unpacked and combined into a JSON array.

```csharp
public static McpToolResult Combine(params McpToolResult[] results)
```

### Parameters

`results` [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)\[\]

A collection of [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) objects to combine.

### Returns

[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)

A single [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) containing the combined results.
