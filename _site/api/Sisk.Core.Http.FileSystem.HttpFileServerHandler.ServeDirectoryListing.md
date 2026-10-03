# HttpFileServerHandler.ServeDirectoryListing

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.ServeDirectoryListing.html

## ServeDirectoryListing(DirectoryInfo, HttpRequest) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_ServeDirectoryListing_System_IO_DirectoryInfo_Sisk_Core_Http_HttpRequest_}

Generates an HTML directory listing for the specified directory and returns it as an HTTP response.

```csharp
protected virtual HttpResponse ServeDirectoryListing(DirectoryInfo directory, HttpRequest request)
```

### Parameters

`directory` [DirectoryInfo](https://learn.microsoft.com/dotnet/api/system.io.directoryinfo)

The directory whose contents will be listed.

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The current HTTP request.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

An [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) containing the HTML directory listing.
