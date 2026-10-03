# PrefixedLogStream

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.html

Represents a log stream that prefixes log messages with a custom string.

```csharp
public sealed class PrefixedLogStream : LogStream, IDisposable, IAsyncDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) ← 
[PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable), 
[IAsyncDisposable](https://learn.microsoft.com/dotnet/api/system.iasyncdisposable)

#### Inherited Members

[LogStream.EscapeSafeDateTime\(DateTime, IFormatProvider?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.EscapeSafeDateTime.md#Sisk_Core_Http_LogStream_EscapeSafeDateTime_System_DateTime_System_IFormatProvider_), 
[LogStream.SafeWriteToFile\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_), 
[LogStream.SafeWriteToFile\(string, string?, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String_System_Text_Encoding_), 
[LogStream.SafeWriteToFile\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___), 
[LogStream.SafeWriteToFile\(string, string\[\], Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFile.md#Sisk_Core_Http_LogStream_SafeWriteToFile_System_String_System_String___System_Text_Encoding_), 
[LogStream.SafeAppendToFile\(string, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_), 
[LogStream.SafeAppendToFile\(string, string?, Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String_System_Text_Encoding_), 
[LogStream.SafeAppendToFile\(string, string\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___), 
[LogStream.SafeAppendToFile\(string, string\[\], Encoding\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFile.md#Sisk_Core_Http_LogStream_SafeAppendToFile_System_String_System_String___System_Text_Encoding_), 
[LogStream.SafeWriteToFileAsync\(string, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Threading_CancellationToken_), 
[LogStream.SafeWriteToFileAsync\(string, string?, Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String_System_Text_Encoding_System_Threading_CancellationToken_), 
[LogStream.SafeWriteToFileAsync\(string, string\[\], CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Threading_CancellationToken_), 
[LogStream.SafeWriteToFileAsync\(string, string\[\], Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeWriteToFileAsync.md#Sisk_Core_Http_LogStream_SafeWriteToFileAsync_System_String_System_String___System_Text_Encoding_System_Threading_CancellationToken_), 
[LogStream.SafeAppendToFileAsync\(string, string?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String_System_Threading_CancellationToken_), 
[LogStream.SafeAppendToFileAsync\(string, string?, Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String_System_Text_Encoding_System_Threading_CancellationToken_), 
[LogStream.SafeAppendToFileAsync\(string, string\[\], CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String___System_Threading_CancellationToken_), 
[LogStream.SafeAppendToFileAsync\(string, string\[\], Encoding, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeAppendToFileAsync.md#Sisk_Core_Http_LogStream_SafeAppendToFileAsync_System_String_System_String___System_Text_Encoding_System_Threading_CancellationToken_), 
[LogStream.Flush\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Flush.md#Sisk_Core_Http_LogStream_Flush), 
[LogStream.FlushAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.FlushAsync.md#Sisk_Core_Http_LogStream_FlushAsync), 
[LogStream.Peek\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Peek.md#Sisk_Core_Http_LogStream_Peek), 
[LogStream.PeekEntries\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.PeekEntries.md#Sisk_Core_Http_LogStream_PeekEntries), 
[LogStream.StartBuffering\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StartBuffering.md#Sisk_Core_Http_LogStream_StartBuffering_System_Int32_), 
[LogStream.StopBuffering\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.StopBuffering.md#Sisk_Core_Http_LogStream_StopBuffering), 
[LogStream.Close\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Close.md#Sisk_Core_Http_LogStream_Close), 
[LogStream.ConfigureRotatingPolicy\(long, TimeSpan\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConfigureRotatingPolicy.md#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_), 
[LogStream.ConfigureRotatingPolicy\(long, TimeSpan, RotatingLogPolicyCompressor\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConfigureRotatingPolicy.md#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_Sisk_Core_Http_RotatingLogPolicyCompressor_), 
[LogStream.Write\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_System_String_), 
[LogStream.Write\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_System_Exception_), 
[LogStream.Write\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Write.md#Sisk_Core_Http_LogStream_Write_Sisk_Core_Http_LogStreamEntry_), 
[LogStream.WriteException\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteException.md#Sisk_Core_Http_LogStream_WriteException_System_Exception_), 
[LogStream.WriteException\(Exception, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteException.md#Sisk_Core_Http_LogStream_WriteException_System_Exception_System_String_), 
[LogStream.WriteLine\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine), 
[LogStream.WriteLine\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_Object_), 
[LogStream.WriteLine\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_), 
[LogStream.WriteLine\(string, params ReadOnlySpan<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_System_ReadOnlySpan_System_Object__), 
[LogStream.WriteLine\(string, params IEnumerable<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_String_System_Collections_Generic_IEnumerable_System_Object__), 
[LogStream.WriteLine\(IFormatProvider?, string, params object?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLine.md#Sisk_Core_Http_LogStream_WriteLine_System_IFormatProvider_System_String_System_Object___), 
[LogStream.WriteAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_System_String_), 
[LogStream.WriteAsync\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_System_Exception_), 
[LogStream.WriteAsync\(LogStreamEntry\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteAsync.md#Sisk_Core_Http_LogStream_WriteAsync_Sisk_Core_Http_LogStreamEntry_), 
[LogStream.WriteExceptionAsync\(Exception\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteExceptionAsync.md#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_), 
[LogStream.WriteExceptionAsync\(Exception, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteExceptionAsync.md#Sisk_Core_Http_LogStream_WriteExceptionAsync_System_Exception_System_String_), 
[LogStream.WriteLineAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync), 
[LogStream.WriteLineAsync\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_Object_), 
[LogStream.WriteLineAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_), 
[LogStream.WriteLineAsync\(string, params IEnumerable<object?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_String_System_Collections_Generic_IEnumerable_System_Object__), 
[LogStream.WriteLineAsync\(IFormatProvider?, string, params object?\[\]\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.WriteLineAsync.md#Sisk_Core_Http_LogStream_WriteLineAsync_System_IFormatProvider_System_String_System_Object___), 
[LogStream.DisposeAsync\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.DisposeAsync.md#Sisk_Core_Http_LogStream_DisposeAsync), 
[LogStream.Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Dispose.md#Sisk_Core_Http_LogStream_Dispose), 
[LogStream.SafeTimestamp](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.SafeTimestamp.md#Sisk_Core_Http_LogStream_SafeTimestamp), 
[LogStream.ConsoleOutput](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConsoleOutput.md#Sisk_Core_Http_LogStream_ConsoleOutput), 
[LogStream.Empty](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Empty.md#Sisk_Core_Http_LogStream_Empty), 
[LogStream.RotatingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.RotatingPolicy.md#Sisk_Core_Http_LogStream_RotatingPolicy), 
[LogStream.IsBuffering](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.IsBuffering.md#Sisk_Core_Http_LogStream_IsBuffering), 
[LogStream.Disposed](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Disposed.md#Sisk_Core_Http_LogStream_Disposed), 
[LogStream.NormalizeEntries](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.NormalizeEntries.md#Sisk_Core_Http_LogStream_NormalizeEntries), 
[LogStream.FilePath](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.FilePath.md#Sisk_Core_Http_LogStream_FilePath), 
[LogStream.TextWriter](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.TextWriter.md#Sisk_Core_Http_LogStream_TextWriter), 
[LogStream.Encoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.Encoding.md#Sisk_Core_Http_LogStream_Encoding), 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [PrefixedLogStream\(Func<string\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.-ctor.md#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__) | Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function. |
| [PrefixedLogStream\(Func<string\>, TextWriter\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.-ctor.md#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_IO_TextWriter_) | Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function and text writer. |
| [PrefixedLogStream\(Func<string\>, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.-ctor.md#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_String_) | Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function and file name. |
| [PrefixedLogStream\(Func<string\>, string?, TextWriter?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.-ctor.md#Sisk_Core_Http_PrefixedLogStream__ctor_System_Func_System_String__System_String_System_IO_TextWriter_) | Initializes a new instance of the [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) class with the specified prefix function, file name, and text writer. |

## Properties

| Name | Description |
| --- | --- |
| [PrefixFunction](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.PrefixFunction.md#Sisk_Core_Http_PrefixedLogStream_PrefixFunction) | Gets or sets a function that returns the prefix to be added to log messages. |
| [SuffixFunction](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.SuffixFunction.md#Sisk_Core_Http_PrefixedLogStream_SuffixFunction) | Gets or sets the function that provides a suffix string value. |

## Methods

| Name | Description |
| --- | --- |
| [WriteLineInternal\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.WriteLineInternal.md#Sisk_Core_Http_PrefixedLogStream_WriteLineInternal_System_String_) | Intercepts the line that will be written to an output log before being queued for writing. This method will block if the log queue is full. |
| [WriteLineInternalAsync\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.WriteLineInternalAsync.md#Sisk_Core_Http_PrefixedLogStream_WriteLineInternalAsync_System_String_) | Intercepts the line that will be written to an output log before being queued for writing. |
