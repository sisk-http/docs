# McpTool constructor

Kind: Constructor  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.-ctor.html

## McpTool(string, string, JsonSchema, McpToolHandler, string?) {#Sisk_ModelContextProtocol_McpTool__ctor_System_String_System_String_LightJson_Schema_JsonSchema_Sisk_ModelContextProtocol_McpToolHandler_System_String_}

Initializes a new instance of the [McpTool](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.md) class.

```csharp
public McpTool(string name, string description, JsonSchema schema, McpToolHandler executionHandler, string? title = null)
```

### Parameters

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The unique name of the tool.

`description` [string](https://learn.microsoft.com/dotnet/api/system.string)

A description of what the tool does.

`schema` JsonSchema

The JSON schema defining the tool's input arguments.

`executionHandler` [McpToolHandler](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolHandler.md)

The handler function that will be executed when the tool is invoked.

`title` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The optional display title of the tool.
