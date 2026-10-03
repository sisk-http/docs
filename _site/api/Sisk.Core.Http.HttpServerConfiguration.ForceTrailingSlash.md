# HttpServerConfiguration.ForceTrailingSlash

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.html

## ForceTrailingSlash {#Sisk_Core_Http_HttpServerConfiguration_ForceTrailingSlash}

Gets or sets whether the HTTP server should automatically rewrite GET requests to end
their path with `/`. This is applyable only to non-Regex routes.

```csharp
public bool ForceTrailingSlash { get; set; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)
