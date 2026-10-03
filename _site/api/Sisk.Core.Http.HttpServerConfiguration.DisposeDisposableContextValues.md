# HttpServerConfiguration.DisposeDisposableContextValues

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.html

## DisposeDisposableContextValues {#Sisk_Core_Http_HttpServerConfiguration_DisposeDisposableContextValues}

Gets or sets whether the HTTP server should dispose all [IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable) values in the [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) bag
when an HTTP session is closed.

```csharp
public bool DisposeDisposableContextValues { get; set; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
