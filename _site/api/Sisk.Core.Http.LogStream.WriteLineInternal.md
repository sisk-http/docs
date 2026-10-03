# LogStream.WriteLineInternal

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternal.html

## WriteLineInternal(string) {#Sisk_Core_Http_LogStream_WriteLineInternal_System_String_}

Intercepts the line that will be written to an output log before being queued for writing.
This method will block if the log queue is full.

```csharp
protected virtual void WriteLineInternal(string line)
```

### Parameters

`line` [string](https://learn.microsoft.com/dotnet/api/system.string)

The line which will be written to the log stream.

## WriteLineInternal(LogStreamEntry) {#Sisk_Core_Http_LogStream_WriteLineInternal_Sisk_Core_Http_LogStreamEntry_}

Intercepts the specified log entry and writes it synchronously to the log stream.

```csharp
protected virtual void WriteLineInternal(LogStreamEntry entry)
```

### Parameters

`entry` [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

The log entry to write.
