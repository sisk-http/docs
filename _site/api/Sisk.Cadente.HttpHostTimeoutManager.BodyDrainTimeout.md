# HttpHostTimeoutManager.BodyDrainTimeout

Kind: Property  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostTimeoutManager.BodyDrainTimeout.html

## BodyDrainTimeout {#Sisk_Cadente_HttpHostTimeoutManager_BodyDrainTimeout}

Gets or sets the maximum duration to wait for draining the request or response body before timing out.

```csharp
public TimeSpan BodyDrainTimeout { get; set; }
```

### Property Value

[TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)

### Remarks

If the body is not fully drained within the specified timeout, the operation may be aborted.
            Adjust this value based on expected network conditions and payload sizes to avoid premature timeouts.
