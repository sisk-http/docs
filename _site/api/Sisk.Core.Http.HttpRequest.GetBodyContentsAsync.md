# HttpRequest.GetBodyContentsAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetBodyContentsAsync.html

## GetBodyContentsAsync(CancellationToken) {#Sisk_Core_Http_HttpRequest_GetBodyContentsAsync_System_Threading_CancellationToken_}

Asynchronously reads the request contents as a memory byte array.

```csharp
public Task<Memory<byte>> GetBodyContentsAsync(CancellationToken cancellation = default)
```

### Parameters

`cancellation` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken) to cancel the operation.

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[Memory](https://learn.microsoft.com/dotnet/api/system.memory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>\>

A [Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task) that returns a [Memory](https://learn.microsoft.com/dotnet/api/system.memory) of bytes containing the body contents.
