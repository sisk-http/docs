# HttpFileServerHandler.ServeFile

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ServeFile.html

## ServeFile(FileInfo, HttpRequest) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ServeFile_System_IO_FileInfo_Sisk_Core_Http_HttpRequest_}

Serves the specified file as an HTTP response, applying the first compatible converter if available.

```csharp
protected virtual HttpResponse ServeFile(FileInfo file, HttpRequest request)
```

### Parameters

`file` [FileInfo](https://learn.microsoft.com/dotnet/api/system.io.fileinfo)

The file to serve.

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The current HTTP request.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

An [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) containing the file or its converted representation.
