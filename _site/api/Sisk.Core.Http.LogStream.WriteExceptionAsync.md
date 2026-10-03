# LogStream.WriteExceptionAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteExceptionAsync.html

## WriteExceptionAsync(Exception) {#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_}

Writes an exception description in the log.

```csharp
public Task WriteExceptionAsync(Exception exp)
```

### Parameters

`exp` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception which will be written.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## WriteExceptionAsync(Exception, string?) {#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_System_String_}

Writes an exception description in the log.

```csharp
public virtual Task WriteExceptionAsync(Exception exp, string? extraContext = null)
```

### Parameters

`exp` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception which will be written.

`extraContext` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Extra context message to append to the exception message.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
