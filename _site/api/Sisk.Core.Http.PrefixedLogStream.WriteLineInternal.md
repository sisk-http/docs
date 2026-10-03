# PrefixedLogStream.WriteLineInternal

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.WriteLineInternal.html

## WriteLineInternal(string) {#Sisk_Core_Http_PrefixedLogStream_WriteLineInternal_System_String_}

Intercepts the line that will be written to an output log before being queued for writing.
This method will block if the log queue is full.

```csharp
protected override void WriteLineInternal(string line)
```

### Parameters

`line` [string](https://learn.microsoft.com/dotnet/api/system.string)

The line which will be written to the log stream.
