# LogStream.WriteAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.html

## WriteAsync(string) {#Sisk_Core_Http_LogStream_WriteAsync_System_String_}

Asynchronously writes a message to the log stream.

```csharp
public Task WriteAsync(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The message to write.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous write operation.

## WriteAsync(Exception) {#Sisk_Core_Http_LogStream_WriteAsync_System_Exception_}

Asynchronously writes an exception to the log stream.

```csharp
public Task WriteAsync(Exception exception)
```

### Parameters

`exception` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception to write.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous write operation.

## WriteAsync(LogStreamEntry) {#Sisk_Core_Http_LogStream_WriteAsync_Sisk_Core_Http_LogStreamEntry_}

Asynchronously writes a log entry to the log stream.

```csharp
public Task WriteAsync(LogStreamEntry entry)
```

### Parameters

`entry` [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

The log entry to write.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

A task that represents the asynchronous write operation.
