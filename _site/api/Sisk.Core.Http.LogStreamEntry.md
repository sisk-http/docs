# LogStreamEntry

Kind: Struct  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.html

Represents a single log entry with a timestamp, severity level, and message.

```csharp
public readonly struct LogStreamEntry : IEquatable<LogStreamEntry>, IComparable<LogStreamEntry>, IFormattable
```

#### Implements

[IEquatable<LogStreamEntry\>](https://learn.microsoft.com/dotnet/api/system.iequatable\-1), 
[IComparable<LogStreamEntry\>](https://learn.microsoft.com/dotnet/api/system.icomparable\-1), 
[IFormattable](https://learn.microsoft.com/dotnet/api/system.iformattable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [LogStreamEntry\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.-ctor.md#Sisk_Core_Http_LogStreamEntry__ctor_System_String_) | Initializes a new instance of the LogEntry class with the specified message and an information log level. |
| [LogStreamEntry\(LogEntryLevel, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.-ctor.md#Sisk_Core_Http_LogStreamEntry__ctor_Sisk_Core_LogEntryLevel_System_String_) | Initializes a new instance of the [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) struct with the specified level and message, setting the moment to the current time. |
| [LogStreamEntry\(DateTimeOffset, LogEntryLevel, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.-ctor.md#Sisk_Core_Http_LogStreamEntry__ctor_System_DateTimeOffset_Sisk_Core_LogEntryLevel_System_String_) | Initializes a new instance of the [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) struct with the specified moment, level, and message. |

## Properties

| Name | Description |
| --- | --- |
| [Level](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Level.md#Sisk_Core_Http_LogStreamEntry_Level) | Gets the severity level of the log entry. |
| [Message](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Message.md#Sisk_Core_Http_LogStreamEntry_Message) | Gets the log message. |
| [Moment](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Moment.md#Sisk_Core_Http_LogStreamEntry_Moment) | Gets the point in time when the log entry was created. |

## Methods

| Name | Description |
| --- | --- |
| [CompareTo\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CompareTo.md#Sisk_Core_Http_LogStreamEntry_CompareTo_Sisk_Core_Http_LogStreamEntry_) | Compares this log entry to another log entry based on their moment. |
| [CreateDebug\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateDebug.md#Sisk_Core_Http_LogStreamEntry_CreateDebug_System_String_) | Creates a debug log entry with the specified message. |
| [CreateError\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateError.md#Sisk_Core_Http_LogStreamEntry_CreateError_System_String_) | Creates an error log entry with the specified message. |
| [CreateError\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateError.md#Sisk_Core_Http_LogStreamEntry_CreateError_System_Exception_) | Creates an error log entry from the specified exception. |
| [CreateInformation\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateInformation.md#Sisk_Core_Http_LogStreamEntry_CreateInformation_System_String_) | Creates an informational log entry with the specified message. |
| [CreateWarning\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateWarning.md#Sisk_Core_Http_LogStreamEntry_CreateWarning_System_String_) | Creates a warning log entry with the specified message. |
| [CreateWarning\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.CreateWarning.md#Sisk_Core_Http_LogStreamEntry_CreateWarning_System_Exception_) | Creates a warning log entry from the specified exception. |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Equals.md#Sisk_Core_Http_LogStreamEntry_Equals_System_Object_) | Determines whether this log entry is equal to the specified object. |
| [Equals\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.Equals.md#Sisk_Core_Http_LogStreamEntry_Equals_Sisk_Core_Http_LogStreamEntry_) | Determines whether this log entry is equal to another log entry. |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.GetHashCode.md#Sisk_Core_Http_LogStreamEntry_GetHashCode) | Returns the hash code for this log entry. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.ToString.md#Sisk_Core_Http_LogStreamEntry_ToString) | Returns a string representation of the log entry in the default format. |
| [ToString\(string?, IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.ToString.md#Sisk_Core_Http_LogStreamEntry_ToString_System_String_System_IFormatProvider_) | Returns a string representation of the log entry using the specified format string and format provider. |

## Operators

| Name | Description |
| --- | --- |
| [operator ==\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_Equality.md#Sisk_Core_Http_LogStreamEntry_op_Equality_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
| [operator \>\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_GreaterThan.md#Sisk_Core_Http_LogStreamEntry_op_GreaterThan_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
| [operator \>=\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_GreaterThanOrEqual.md#Sisk_Core_Http_LogStreamEntry_op_GreaterThanOrEqual_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
| [operator \!=\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_Inequality.md#Sisk_Core_Http_LogStreamEntry_op_Inequality_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
| [operator <\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_LessThan.md#Sisk_Core_Http_LogStreamEntry_op_LessThan_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
| [operator <=\(LogStreamEntry, LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.op_LessThanOrEqual.md#Sisk_Core_Http_LogStreamEntry_op_LessThanOrEqual_Sisk_Core_Http_LogStreamEntry_Sisk_Core_Http_LogStreamEntry_) |  |
