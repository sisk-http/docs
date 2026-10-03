# LogStreamEntry constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.-ctor.html

## LogStreamEntry(string) {#Sisk_Core_Http_LogStreamEntry__ctor_System_String_}

Initializes a new instance of the LogEntry class with the specified message and an information log level.

```csharp
public LogStreamEntry(string message)
```

### Parameters

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The log message to associate with this entry. Cannot be null.

### Remarks

The log entry is timestamped with the current date and time, and its level is set to
            Information by default.

## LogStreamEntry(LogEntryLevel, string) {#Sisk_Core_Http_LogStreamEntry__ctor_Sisk_Core_LogEntryLevel_System_String_}

Initializes a new instance of the [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) struct with the specified level and message,
setting the moment to the current time.

```csharp
public LogStreamEntry(LogEntryLevel level, string message)
```

### Parameters

`level` [LogEntryLevel](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md)

The severity level of the log entry.

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The log message.

## LogStreamEntry(DateTimeOffset, LogEntryLevel, string) {#Sisk_Core_Http_LogStreamEntry__ctor_System_DateTimeOffset_Sisk_Core_LogEntryLevel_System_String_}

Initializes a new instance of the [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) struct with the specified moment, level, and message.

```csharp
public LogStreamEntry(DateTimeOffset moment, LogEntryLevel level, string message)
```

### Parameters

`moment` [DateTimeOffset](https://learn.microsoft.com/dotnet/api/system.datetimeoffset)

The point in time when the log entry was created.

`level` [LogEntryLevel](https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.md)

The severity level of the log entry.

`message` [string](https://learn.microsoft.com/dotnet/api/system.string)

The log message.
