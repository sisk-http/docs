# LogStreamEntry.CreateWarning

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateWarning.html

## CreateWarning(string) {#Sisk_Core_Http_LogStreamEntry_CreateWarning_System_String_}

Creates a warning log entry with the specified message.

```csharp
public static LogStreamEntry CreateWarning(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The warning message.

### Returns

[LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

A new [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) instance with [Warning](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md).

## CreateWarning(Exception) {#Sisk_Core_Http_LogStreamEntry_CreateWarning_System_Exception_}

Creates a warning log entry from the specified exception.

```csharp
public static LogStreamEntry CreateWarning(Exception exception)
```

### Parameters

`exception` [Exception](https://learn.microsoft.com/dotnet/api/system.exception)

The exception whose string representation will be used as the message.

### Returns

[LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md)

A new [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) instance with [Warning](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md).
