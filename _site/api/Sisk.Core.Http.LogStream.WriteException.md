# LogStream.WriteException

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteException.html

## WriteException(Exception) {#Sisk_Core_Http_LogStream_WriteException_System_Exception_}

Writes an exception description in the log.

```csharp
public void WriteException(Exception exp)
```

### Parameters

`exp` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception which will be written.

## WriteException(Exception, string?) {#Sisk_Core_Http_LogStream_WriteException_System_Exception_System_String_}

Writes an exception description in the log.

```csharp
public virtual void WriteException(Exception exp, string? extraContext = null)
```

### Parameters

`exp` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception which will be written.

`extraContext` [string](https://learn.microsoft.com/dotnet/api/system.string)?

Extra context message to append to the exception message.
