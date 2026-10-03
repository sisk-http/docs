# HttpRequest.GetMultipartFormContentAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync.html

## GetMultipartFormContentAsync(CancellationToken) {#Sisk_Core_Http_HttpRequest_GetMultipartFormContentAsync_System_Threading_CancellationToken_}

Asynchronously reads the request body and obtains a [MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md) from it.

```csharp
public Task<MultipartFormCollection> GetMultipartFormContentAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the asynchronous operation.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md)\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that represents the asynchronous operation, containing a [MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md) instance representing the multipart form content of the request.

### Exceptions

[HttpRequestException](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestException.md)

If an error occurs while parsing the multipart form content.
