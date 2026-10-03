# LogStream.WriteLineInternalAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternalAsync.html

## WriteLineInternalAsync(LogStreamEntry) {#Sisk_Core_Http_LogStream_WriteLineInternalAsync_Sisk_Core_Http_LogStreamEntry_}

Intercepts the specified log entry and writes it asynchronously to the log stream.

```csharp
protected virtual ValueTask WriteLineInternalAsync(LogStreamEntry entry)
```

### Parameters

`entry` [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

The log entry to write.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous write operation.

## WriteLineInternalAsync(string) {#Sisk_Core_Http_LogStream_WriteLineInternalAsync_System_String_}

Intercepts the line that will be written to an output log before being queued for writing.

```csharp
protected virtual ValueTask WriteLineInternalAsync(string line)
```

### Parameters

`line` [string](https://learn.microsoft.com/dotnet/api/system.string)

The line which will be written to the log stream.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)

A [ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) that represents the asynchronous operation.
