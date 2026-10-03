# McpToolResult.CreateAudio

Kind: Method  
Namespace: `Sisk.ModelContextProtocol`  
Assembly: `Sisk.ModelContextProtocol.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio.html

## CreateAudio(ReadOnlySpan&lt;byte>, string) {#Sisk_ModelContextProtocol_McpToolResult_CreateAudio_System_ReadOnlySpan_System_Byte__System_String_}

Creates an audio-based result for an MCP tool.

```csharp
public static McpToolResult CreateAudio(ReadOnlySpan<byte> audioBytes, string mimeType = "audio/wav")
```

### Parameters

`audioBytes` [ReadOnlySpan](https://learn.microsoft.com/dotnet/api/system.readonlyspan\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The byte array representing the audio data.

`mimeType` [string](https://learn.microsoft.com/dotnet/api/system.string)

The MIME type of the audio (e.g., "audio/wav"). Defaults to "audio/wav".

### Returns

[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)

An [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) representing an audio result.
