# HttpStreamPingPolicy.Start

Kind: Method  
Namespace: `Sisk.Core.Http.Streams`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpStreamPingPolicy.Start.html

## Start() {#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Start}

Starts sending periodic pings to the client.

```csharp
public void Start()
```

## Start(string, TimeSpan) {#Sisk_Core_Http_Streams_HttpStreamPingPolicy_Start_System_String_System_TimeSpan_}

Configures and starts sending periodic pings to the client.

```csharp
public void Start(string dataMessage, TimeSpan interval)
```

### Parameters

`dataMessage` [string](https://learn.microsoft.com/dotnet/api/system.string)

The payload message that is sent to the server as a ping message.

`interval` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

The sending interval for each ping message.
