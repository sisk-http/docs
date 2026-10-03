# McpTool

Kind: Class  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.html

Represents a tool that can be hosted and executed by an MCP server.

```csharp
public sealed class McpTool
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[McpTool](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.md)

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
| [McpTool\(string, string, JsonSchema, McpToolHandler, string?\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.-ctor.md#Sisk_ModelContextProtocol_McpTool__ctor_System_String_System_String_LightJson_Schema_JsonSchema_Sisk_ModelContextProtocol_McpToolHandler_System_String_) | Initializes a new instance of the [McpTool](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [Description](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.Description.md#Sisk_ModelContextProtocol_McpTool_Description) | Gets a description of what the tool does. |
| [ExecuteAsync](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.ExecuteAsync.md#Sisk_ModelContextProtocol_McpTool_ExecuteAsync) | Gets or sets the handler function that will be executed when the tool is invoked. |
| [Name](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.Name.md#Sisk_ModelContextProtocol_McpTool_Name) | Gets the unique name of the tool. |
| [Schema](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.Schema.md#Sisk_ModelContextProtocol_McpTool_Schema) | Gets the JSON schema that defines the expected input arguments for the tool. |
| [Title](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.Title.md#Sisk_ModelContextProtocol_McpTool_Title) | Gets the display title of the tool. If null, the [Name](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.Name.md) will be used. |
