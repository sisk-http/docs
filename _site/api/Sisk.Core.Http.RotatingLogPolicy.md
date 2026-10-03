# RotatingLogPolicy

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.html

Provides a managed utility for rotating log files by their file size.

```csharp
public sealed class RotatingLogPolicy : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[RotatingLogPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

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
| [RotatingLogPolicy\(LogStream\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.-ctor.md#Sisk_Core_Http_RotatingLogPolicy__ctor_Sisk_Core_Http_LogStream_) | Creates an new [RotatingLogPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.md) instance with the given [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) object to watch. |

## Properties

| Name | Description |
| --- | --- |
| [Compressor](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Compressor.md#Sisk_Core_Http_RotatingLogPolicy_Compressor) | Gets or sets the compressor used to compress the log files. |
| [Due](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Due.md#Sisk_Core_Http_RotatingLogPolicy_Due) | Gets the time interval between checks. |
| [MaximumSize](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.MaximumSize.md#Sisk_Core_Http_RotatingLogPolicy_MaximumSize) | Gets the file size threshold in bytes for when the file will be compressed and then cleared. |

## Methods

| Name | Description |
| --- | --- |
| [Configure\(long, TimeSpan, RotatingLogPolicyCompressor?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Configure.md#Sisk_Core_Http_RotatingLogPolicy_Configure_System_Int64_System_TimeSpan_Sisk_Core_Http_RotatingLogPolicyCompressor_) | Defines the time interval and size threshold for starting the task, and then starts the task. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Dispose.md#Sisk_Core_Http_RotatingLogPolicy_Dispose) |  |
