# RotatingLogPolicy.Configure

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.Configure.html

## Configure(long, TimeSpan, RotatingLogPolicyCompressor?) {#Sisk_Core_Http_RotatingLogPolicy_Configure_System_Int64_System_TimeSpan_Sisk_Core_Http_RotatingLogPolicyCompressor_}

Defines the time interval and size threshold for starting the task, and then starts the task.

```csharp
public void Configure(long maximumSize, TimeSpan due, RotatingLogPolicyCompressor? compressor = null)
```

### Parameters

`maximumSize` [long](https://learn.microsoft.com/dotnet/api/system.int64)

The non-negative size threshold of the log file size in byte count.

`due` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The time interval between checks.

`compressor` [RotatingLogPolicyCompressor](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.md)?

The optional compressor to use for log file compression. If [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null), the default compressor (GZip) will be used.

### Remarks

The first run is performed immediately after calling this method.
