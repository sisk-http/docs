# HttpFileServerFileConverter.CanConvert

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.CanConvert.html

## CanConvert(FileInfo) {#Sisk_Core_Http_FileSystem_HttpFileServerFileConverter_CanConvert_System_IO_FileInfo_}

Determines whether this converter can process the specified file.

```csharp
public abstract bool CanConvert(FileInfo file)
```

### Parameters

`file` [FileInfo](https://learn.microsoft.com/dotnet/api/system.io.fileinfo)

The file to inspect.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) if this converter can handle the file; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
