# HttpServerConfiguration.MaximumContentLength

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.html

## MaximumContentLength {#Sisk_Core_Http_HttpServerConfiguration_MaximumContentLength}

Gets or sets the maximum size of a request body before it is closed by the socket.

```csharp
public long MaximumContentLength { get; set; }
```

### Property Value

[long](https://learn.microsoft.com/dotnet/api/system.int64)

### Remarks

Leave it as "0" to set the maximum content length to unlimited.
