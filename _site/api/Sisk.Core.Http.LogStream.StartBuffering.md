# LogStream.StartBuffering

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StartBuffering.html

## StartBuffering(int) {#Sisk_Core_Http_LogStream_StartBuffering_System_Int32_}

Start buffering all output to an alternate stream in memory for readability with [Peek](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Peek.md) later.

```csharp
public void StartBuffering(int lines)
```

### Parameters

`lines` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The amount of lines to store in the buffer.
