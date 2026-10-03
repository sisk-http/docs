# LogStream

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.html

Provides a managed, asynchronous log writer which supports writing safe data to log files or text streams.

```csharp
public class LogStream : IDisposable, IAsyncDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md)

#### Derived

[PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable), 
[IAsyncDisposable](https://learn.microsoft.com/dotnet/api/system.iasyncdisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [LogStream\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.-ctor.md#Sisk_Core_Http_LogStream__ctor) | Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with no predefined outputs. |
| [LogStream\(TextWriter\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.-ctor.md#Sisk_Core_Http_LogStream__ctor_System_IO_TextWriter_) | Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with the given TextWriter object. |
| [LogStream\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.-ctor.md#Sisk_Core_Http_LogStream__ctor_System_String_) | Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance with the given relative or absolute file path. |
| [LogStream\(string?, TextWriter?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.-ctor.md#Sisk_Core_Http_LogStream__ctor_System_String_System_IO_TextWriter_) | Creates an new [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance which writes text to an file and an [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter). |

## Properties

| Name | Description |
| --- | --- |
| [ConsoleOutput](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConsoleOutput.md#Sisk_Core_Http_LogStream_ConsoleOutput) | Gets a shared [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) that writes its output to the [Out](https://learn.microsoft.com/dotnet/api/system.console.out) stream. |
| [Disposed](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Disposed.md#Sisk_Core_Http_LogStream_Disposed) | Gets an boolean indicating if this [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) was disposed. |
| [Empty](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Empty.md#Sisk_Core_Http_LogStream_Empty) | Gets a shared [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) without any output stream. |
| [Encoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Encoding.md#Sisk_Core_Http_LogStream_Encoding) | Gets or sets the encoding used for writting data to the output file. This property is only appliable if this instance is using an file-based output. |
| [FilePath](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.FilePath.md#Sisk_Core_Http_LogStream_FilePath) | Gets or sets the absolute path to the file where the log is being written to. |
| [IsBuffering](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.IsBuffering.md#Sisk_Core_Http_LogStream_IsBuffering) | Gets an boolean indicating if this [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) is buffering output messages to their internal message buffer. |
| [NormalizeEntries](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.NormalizeEntries.md#Sisk_Core_Http_LogStream_NormalizeEntries) | Gets or sets a boolean that indicates that every input must be trimmed and have their line endings normalized before being written to the output stream. |
| [RotatingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.RotatingPolicy.md#Sisk_Core_Http_LogStream_RotatingPolicy) | Gets the defined [RotatingLogPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.md) for this [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md). |
| [SafeTimestamp](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeTimestamp.md#Sisk_Core_Http_LogStream_SafeTimestamp) | Gets the current local date and time as a file-name-safe string formatted as "yyyy-MM-dd_HH-mm-ss". |
| [TextWriter](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.TextWriter.md#Sisk_Core_Http_LogStream_TextWriter) | Gets the [TextWriter](https://learn.microsoft.com/dotnet/api/system.io.textwriter) object where the log is being written to. |

## Methods

| Name | Description |
| --- | --- |
| [Close\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Close.md#Sisk_Core_Http_LogStream_Close) | Writes all pending logs from the queue and closes all resources used by this object. |
| [ConfigureRotatingPolicy\(long, TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConfigureRotatingPolicy.md#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_) | Defines the time interval and size threshold for starting the task, and then starts the task. This method is an shortcut for calling [Configure](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Configure.md) of this defined [RotatingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.RotatingPolicy.md) method. |
| [ConfigureRotatingPolicy\(long, TimeSpan, RotatingLogPolicyCompressor\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConfigureRotatingPolicy.md#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_Sisk_Core_Http_RotatingLogPolicyCompressor_) | Defines the time interval, size threshold, and compression strategy for starting the task, and then starts the task. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Dispose.md#Sisk_Core_Http_LogStream_Dispose) | Writes all pending logs from the queue and closes all resources used by this object. |
| [DisposeAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.DisposeAsync.md#Sisk_Core_Http_LogStream_DisposeAsync) | Asynchronously writes all pending logs from the queue and closes all resources used by this object. |
| [EscapeSafeDateTime\(DateTime, IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.EscapeSafeDateTime.md#Sisk_Core_Http_LogStream_EscapeSafeDateTime_System_DateTime_System_IFormatProvider_) | Converts the specified [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime) to a file-name-safe string representation formatted as "yyyy-MM-dd_HH-mm-ss". |
| [\~LogStream\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Finalize.md#Sisk_Core_Http_LogStream_Finalize) |  |
| [Flush\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Flush.md#Sisk_Core_Http_LogStream_Flush) | Blocks the current thread until all currently enqueued content is written to the underlying streams. |
| [FlushAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.FlushAsync.md#Sisk_Core_Http_LogStream_FlushAsync) | Asynchronously waits until all currently enqueued content is written to the underlying streams. |
| [Peek\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Peek.md#Sisk_Core_Http_LogStream_Peek) | Reads the output buffer. To use this method, it's required to set this [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) buffering with [StartBuffering](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StartBuffering.md). |
| [PeekEntries\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.PeekEntries.md#Sisk_Core_Http_LogStream_PeekEntries) | Retrieves all buffered log entries as an array of strings. |
| [SafeAppendToFile\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_) | Safely appends the specified string to the specified file path. |
| [SafeAppendToFile\(string, string?, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_System_Text_Encoding_) | Safely appends the specified string to the specified file path. |
| [SafeAppendToFile\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___) | Safely appends the specified lines to the specified file path. |
| [SafeAppendToFile\(string, string\[\], Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___System_Text_Encoding_) | Safely appends the specified lines to the specified file path. |
| [SafeAppendToFileAsync\(string, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String_System_Threading_CancellationToken_) | Safely appends the specified string to the specified file path asynchronously. |
| [SafeAppendToFileAsync\(string, string?, Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String_System_Text_Encoding_System_Threading_CancellationToken_) | Safely appends the specified string to the specified file path asynchronously. |
| [SafeAppendToFileAsync\(string, string\[\], CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String___System_Threading_CancellationToken_) | Safely appends the specified lines to the specified file path asynchronously. |
| [SafeAppendToFileAsync\(string, string\[\], Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String___System_Text_Encoding_System_Threading_CancellationToken_) | Safely appends the specified lines to the specified file path asynchronously. |
| [SafeWriteToFile\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_) | Safely writes the specified string to the specified file path. |
| [SafeWriteToFile\(string, string?, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_System_Text_Encoding_) | Safely writes the specified string to the specified file path. |
| [SafeWriteToFile\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___) | Safely writes the specified lines to the specified file path. |
| [SafeWriteToFile\(string, string\[\], Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___System_Text_Encoding_) | Safely writes the specified lines to the specified file path. |
| [SafeWriteToFileAsync\(string, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Threading_CancellationToken_) | Safely writes the specified string to the specified file path asynchronously. |
| [SafeWriteToFileAsync\(string, string?, Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Text_Encoding_System_Threading_CancellationToken_) | Safely writes the specified string to the specified file path asynchronously. |
| [SafeWriteToFileAsync\(string, string\[\], CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Threading_CancellationToken_) | Safely writes the specified lines to the specified file path asynchronously. |
| [SafeWriteToFileAsync\(string, string\[\], Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Text_Encoding_System_Threading_CancellationToken_) | Safely writes the specified lines to the specified file path asynchronously. |
| [StartBuffering\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StartBuffering.md#Sisk_Core_Http_LogStream_StartBuffering_System_Int32_) | Start buffering all output to an alternate stream in memory for readability with [Peek](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Peek.md) later. |
| [StopBuffering\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StopBuffering.md#Sisk_Core_Http_LogStream_StopBuffering) | Stops buffering output. |
| [Write\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_System_String_) | Writes a message to the log stream. |
| [Write\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_System_Exception_) | Writes an exception to the log stream. |
| [Write\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_Sisk_Core_Http_LogStreamEntry_) | Writes a log entry to the log stream. |
| [WriteAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_System_String_) | Asynchronously writes a message to the log stream. |
| [WriteAsync\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_System_Exception_) | Asynchronously writes an exception to the log stream. |
| [WriteAsync\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_Sisk_Core_Http_LogStreamEntry_) | Asynchronously writes a log entry to the log stream. |
| [WriteException\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteException.md#Sisk_Core_Http_LogStream_WriteException_System_Exception_) | Writes an exception description in the log. |
| [WriteException\(Exception, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteException.md#Sisk_Core_Http_LogStream_WriteException_System_Exception_System_String_) | Writes an exception description in the log. |
| [WriteExceptionAsync\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteExceptionAsync.md#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_) | Writes an exception description in the log. |
| [WriteExceptionAsync\(Exception, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteExceptionAsync.md#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_System_String_) | Writes an exception description in the log. |
| [WriteLine\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine) | Writes an line-break at the end of the output. |
| [WriteLine\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_Object_) | Writes the text and concats an line-break at the end into the output. |
| [WriteLine\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_) | Writes the text and concats an line-break at the end into the output. |
| [WriteLine\(string, params ReadOnlySpan<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_System_ReadOnlySpan_System_Object__) | Writes the text format and arguments and concats an line-break at the end into the output. |
| [WriteLine\(string, params IEnumerable<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_System_Collections_Generic_IEnumerable_System_Object__) | Writes the text format and arguments and concats an line-break at the end into the output. |
| [WriteLine\(IFormatProvider?, string, params object?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_IFormatProvider_System_String_System_Object___) | Writes the text format and arguments and appends a line-break at the end into the output, using the specified format provider. |
| [WriteLineAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync) | Writes an line-break at the end of the output. |
| [WriteLineAsync\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_Object_) | Writes the text and concats an line-break at the end into the output. |
| [WriteLineAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_) | Writes the text and concats an line-break at the end into the output. |
| [WriteLineAsync\(string, params IEnumerable<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_System_Collections_Generic_IEnumerable_System_Object__) | Writes the text format and arguments and concats an line-break at the end into the output. |
| [WriteLineAsync\(IFormatProvider?, string, params object?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_IFormatProvider_System_String_System_Object___) | Writes the text format and arguments and appends a line-break at the end into the output, using the specified format provider. |
| [WriteLineInternal\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternal.md#Sisk_Core_Http_LogStream_WriteLineInternal_System_String_) | Intercepts the line that will be written to an output log before being queued for writing. This method will block if the log queue is full. |
| [WriteLineInternal\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternal.md#Sisk_Core_Http_LogStream_WriteLineInternal_Sisk_Core_Http_LogStreamEntry_) | Intercepts the specified log entry and writes it synchronously to the log stream. |
| [WriteLineInternalAsync\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternalAsync.md#Sisk_Core_Http_LogStream_WriteLineInternalAsync_Sisk_Core_Http_LogStreamEntry_) | Intercepts the specified log entry and writes it asynchronously to the log stream. |
| [WriteLineInternalAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineInternalAsync.md#Sisk_Core_Http_LogStream_WriteLineInternalAsync_System_String_) | Intercepts the line that will be written to an output log before being queued for writing. |
