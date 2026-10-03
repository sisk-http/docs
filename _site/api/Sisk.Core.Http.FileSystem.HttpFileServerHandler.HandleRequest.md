# HttpFileServerHandler.HandleRequest

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.HandleRequest.html

## HandleRequest(HttpRequest) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_HandleRequest_Sisk_Core_Http_HttpRequest_}

Processes the incoming HTTP request and returns the appropriate file or directory response.

```csharp
public virtual HttpResponse HandleRequest(HttpRequest request)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The HTTP request to handle.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

An [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) containing the requested resource, a directory listing, or an error status.
