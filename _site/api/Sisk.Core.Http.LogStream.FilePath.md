# LogStream.FilePath

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.FilePath.html

## FilePath {#Sisk_Core_Http_LogStream_FilePath}

Gets or sets the absolute path to the file where the log is being written to.

```csharp
public string? FilePath { get; set; }
```

### Property Value

[string](https://learn.microsoft.com/dotnet/api/system.string)?

### Remarks

When setting this method, if the file directory doens't exists, it is created.
