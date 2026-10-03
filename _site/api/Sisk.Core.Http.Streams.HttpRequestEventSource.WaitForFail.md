# HttpRequestEventSource.WaitForFail

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail.html

## WaitForFail(TimeSpan) {#Sisk_Core_Http_Streams_HttpRequestEventSource_WaitForFail_System_TimeSpan_}

Waits for the event source to fail or reach the specified idle tolerance.

```csharp
public void WaitForFail(TimeSpan maximumIdleTolerance)
```

### Parameters

`maximumIdleTolerance` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The maximum time to wait before considering the event source failed.
