# HttpRequestEventSource.WithPing

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WithPing.html

## WithPing(Action&lt;HttpStreamPingPolicy>) {#Sisk_Core_Http_Streams_HttpRequestEventSource_WithPing_System_Action_Sisk_Core_Http_Streams_HttpStreamPingPolicy__}

Configures the ping policy for this instance of HTTP Event Source.

```csharp
public void WithPing(Action<HttpStreamPingPolicy> act)
```

### Parameters

`act` [Action](https://learn.microsoft.com/dotnet/api/system.action\-1)<[HttpStreamPingPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.md)\>

The method that runs on the ping policy for this HTTP Event Source.
