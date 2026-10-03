# LogStreamEntry.CreateError

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateError.html

## CreateError(string) {#Sisk_Core_Http_LogStreamEntry_CreateError_System_String_}

Creates an error log entry with the specified message.

```csharp
public static LogStreamEntry CreateError(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The error message.

### Returns

[LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

A new [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) instance with [Error](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md).

## CreateError(Exception) {#Sisk_Core_Http_LogStreamEntry_CreateError_System_Exception_}

Creates an error log entry from the specified exception.

```csharp
public static LogStreamEntry CreateError(Exception exception)
```

### Parameters

`exception` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception whose string representation will be used as the message.

### Returns

[LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

A new [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) instance with [Error](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md).
