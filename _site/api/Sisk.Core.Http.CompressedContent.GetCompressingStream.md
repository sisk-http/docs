# CompressedContent.GetCompressingStream

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.GetCompressingStream.html

## GetCompressingStream(Stream) {#Sisk_Core_Http_CompressedContent_GetCompressingStream_System_IO_Stream_}

Gets a stream that compresses the output stream.

```csharp
public abstract Stream GetCompressingStream(Stream outputStream)
```

### Parameters

`outputStream` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The output stream to compress.

### Returns

[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

A stream that compresses the output stream.
