# PrefixedLogStream.WriteLineInternalAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.WriteLineInternalAsync.html

## WriteLineInternalAsync(string) {#Sisk_Core_Http_PrefixedLogStream_WriteLineInternalAsync_System_String_}

Intercepts the line that will be written to an output log before being queued for writing.

```csharp
protected override ValueTask WriteLineInternalAsync(string line)
```

### Parameters

`line` [string](https://learn.microsoft.com/dotnet/api/system.string)

The line which will be written to the log stream.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous operation.
