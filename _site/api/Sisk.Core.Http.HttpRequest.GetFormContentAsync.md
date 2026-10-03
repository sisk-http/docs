# HttpRequest.GetFormContentAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetFormContentAsync.html

## GetFormContentAsync(CancellationToken) {#Sisk_Core_Http_HttpRequest_GetFormContentAsync_System_Threading_CancellationToken_}

Asynchronously reads the request body and extracts form data parameters from it.

```csharp
public Task<StringKeyStoreCollection> GetFormContentAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the asynchronous operation.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md)\>
