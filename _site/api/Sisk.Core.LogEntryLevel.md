# LogEntryLevel

Kind: Enum  
Namespace: `Sisk.Core`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.LogEntryLevel.html

Defines the severity levels used for logging entries.

```csharp
public enum LogEntryLevel
```

## Fields

| Name | Description |
| --- | --- |
| `Debug = 2` | Debug-level events used for diagnosing issues during development. |
| `Error = 4` | Error events that might still allow the application to continue running. |
| `Fatal = 5` | Critical errors that may force the application to terminate. |
| `Information = 0` | Informational messages that highlight the progress of the application. |
| `Trace = 1` | Detailed information useful during development or debugging. |
| `Warning = 3` | Warnings for potentially harmful situations that do not prevent the application from running. |
