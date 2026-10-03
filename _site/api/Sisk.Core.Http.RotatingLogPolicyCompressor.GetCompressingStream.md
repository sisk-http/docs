# RotatingLogPolicyCompressor.GetCompressingStream

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.GetCompressingStream.html

## GetCompressingStream(Stream) {#Sisk_Core_Http_RotatingLogPolicyCompressor_GetCompressingStream_System_IO_Stream_}

Gets a stream for compressing the log file.

```csharp
public abstract Stream GetCompressingStream(Stream logFileStream)
```

### Parameters

`logFileStream` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

The stream of the log file to be compressed.

### Returns

[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

A stream for compressing the log file.
