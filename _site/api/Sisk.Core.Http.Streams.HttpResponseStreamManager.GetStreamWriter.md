# HttpResponseStreamManager.GetStreamWriter

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpResponseStreamManager.GetStreamWriter.html

## GetStreamWriter(string?, Encoding?, string?) {#Sisk_Core_Http_Streams_HttpResponseStreamManager_GetStreamWriter_System_String_System_Text_Encoding_System_String_}

Returns a [StreamWriter](https://learn.microsoft.com/dotnet/api/system.io.streamwriter) for writing to the response stream, setting the content type and encoding.

```csharp
public StreamWriter GetStreamWriter(string? contentType, Encoding? encoding, string? newLine = "\r\n")
```

### Parameters

`contentType` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The content type of the response, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to omit the content type header.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)?

The encoding to use for the response, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) to use the default encoding.

`newLine` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The new line string literal for the writer.

### Returns

[StreamWriter](https://learn.microsoft.com/dotnet/api/system.io.streamwriter)

A [StreamWriter](https://learn.microsoft.com/dotnet/api/system.io.streamwriter) for writing to the response stream.
