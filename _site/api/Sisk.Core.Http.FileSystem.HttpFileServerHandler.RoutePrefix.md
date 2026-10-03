# HttpFileServerHandler.RoutePrefix

Kind: Property  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.RoutePrefix.html

## RoutePrefix {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_RoutePrefix}

Gets or sets the optional route prefix that must be matched for requests to be handled by this instance.
Matched prefix will be trimmed from the request path when resolving files.

```csharp
public string RoutePrefix { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)
