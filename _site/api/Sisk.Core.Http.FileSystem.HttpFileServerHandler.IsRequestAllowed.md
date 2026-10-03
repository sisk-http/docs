# HttpFileServerHandler.IsRequestAllowed

Kind: Method  
Namespace: `Sisk.Core.Http.FileSystem`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.HttpFileServerHandler.IsRequestAllowed.html

## IsRequestAllowed(HttpRequest) {#Sisk_Core_Http_FileSystem_HttpFileServerHandler_IsRequestAllowed_Sisk_Core_Http_HttpRequest_}

Determines whether the incoming HTTP request is allowed to proceed.

```csharp
protected virtual bool IsRequestAllowed(HttpRequest request)
```

### Parameters

`request` [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

The HTTP request to inspect.

### Returns

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

[`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool) to allow the request; otherwise, [`false`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool).
