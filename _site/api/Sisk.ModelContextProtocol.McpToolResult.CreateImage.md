# McpToolResult.CreateImage

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage.html

## CreateImage(ReadOnlySpan&lt;byte>, string) {#Sisk_ModelContextProtocol_McpToolResult_CreateImage_System_ReadOnlySpan_System_Byte__System_String_}

Creates an image-based result for an MCP tool.

```csharp
public static McpToolResult CreateImage(ReadOnlySpan<byte> imageBytes, string mimeType = "image/png")
```

### Parameters

`imageBytes` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The byte array representing the image data.

`mimeType` [string](https://learn.microsoft.com/dotnet/api/system.string)

The MIME type of the image (e.g., "image/png"). Defaults to "image/png".

### Returns

[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)

An [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) representing an image result.
