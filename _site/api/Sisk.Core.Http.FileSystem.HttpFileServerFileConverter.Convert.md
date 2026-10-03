# HttpFileServerFileConverter.Convert

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerFileConverter.Convert.html

## Convert(FileInfo, HttpRequest) {#Sisk_Core_Http_FileSystem_HttpFileServerFileConverter_Convert_System_IO_FileInfo_Sisk_Core_Http_HttpRequest_}

Converts the specified file into an HTTP response.

```csharp
public abstract HttpResponse Convert(FileInfo file, HttpRequest request)
```

### Parameters

`file` [FileInfo](https://learn.microsoft.com/dotnet/api/system.io.fileinfo)

The file to convert.

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The current HTTP request.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

An [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) representing the converted file.
