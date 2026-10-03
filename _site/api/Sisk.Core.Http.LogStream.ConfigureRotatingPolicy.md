# LogStream.ConfigureRotatingPolicy

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.ConfigureRotatingPolicy.html

## ConfigureRotatingPolicy(long, TimeSpan) {#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_}

Defines the time interval and size threshold for starting the task, and then starts the task. This method is an
shortcut for calling [Configure](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Configure.md) of this defined [RotatingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.RotatingPolicy.md) method.

```csharp
public LogStream ConfigureRotatingPolicy(long maximumSize, TimeSpan dueTime)
```

### Parameters

`maximumSize` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The non-negative size threshold of the log file size in byte count.

`dueTime` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time interval between checks.

### Returns

[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md)

### Remarks

The first run is performed immediately after calling this method.

## ConfigureRotatingPolicy(long, TimeSpan, RotatingLogPolicyCompressor) {#Sisk_Core_Http_LogStream_ConfigureRotatingPolicy_System_Int64_System_TimeSpan_Sisk_Core_Http_RotatingLogPolicyCompressor_}

Defines the time interval, size threshold, and compression strategy for starting the task, and then starts the task.

```csharp
public LogStream ConfigureRotatingPolicy(long maximumSize, TimeSpan dueTime, RotatingLogPolicyCompressor compressor)
```

### Parameters

`maximumSize` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The non-negative size threshold of the log file size in byte count.

`dueTime` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time interval between checks.

`compressor` [RotatingLogPolicyCompressor](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.md)

The compression strategy to apply when rotating logs.

### Returns

[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md)

The current [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) instance for method chaining.

### Remarks

The first run is performed immediately after calling this method.
