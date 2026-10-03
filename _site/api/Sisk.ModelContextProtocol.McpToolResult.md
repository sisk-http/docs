# McpToolResult

Kind: Class  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.html

Represents the result of executing an MCP tool.

```csharp
public sealed class McpToolResult
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)

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
| [McpToolResult\(JsonValue\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.-ctor.md#Sisk_ModelContextProtocol_McpToolResult__ctor_LightJson_JsonValue_) | Initializes a new instance of the [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [Result](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.Result.md#Sisk_ModelContextProtocol_McpToolResult_Result) | Gets the JSON representation of the tool result. |

## Methods

| Name | Description |
| --- | --- |
| [Combine\(params McpToolResult\[\]\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.Combine.md#Sisk_ModelContextProtocol_McpToolResult_Combine_Sisk_ModelContextProtocol_McpToolResult___) | Combines multiple [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) objects into a single result. If the input contains a single result, it is returned directly. Otherwise, all individual results are unpacked and combined into a JSON array. |
| [CreateAudio\(ReadOnlySpan<byte\>, string\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio.md#Sisk_ModelContextProtocol_McpToolResult_CreateAudio_System_ReadOnlySpan_System_Byte__System_String_) | Creates an audio-based result for an MCP tool. |
| [CreateImage\(ReadOnlySpan<byte\>, string\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage.md#Sisk_ModelContextProtocol_McpToolResult_CreateImage_System_ReadOnlySpan_System_Byte__System_String_) | Creates an image-based result for an MCP tool. |
| [CreateText\(string\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateText.md#Sisk_ModelContextProtocol_McpToolResult_CreateText_System_String_) | Creates a text-based result for an MCP tool. |

## Operators

| Name | Description |
| --- | --- |
| [implicit operator McpToolResult\(string\)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.op_Implicit.md#Sisk_ModelContextProtocol_McpToolResult_op_Implicit_System_String__Sisk_ModelContextProtocol_McpToolResult) |  |
