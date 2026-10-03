# FileContent.CreateContentReadStreamAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.CreateContentReadStreamAsync.html

## CreateContentReadStreamAsync() {#Sisk_Core_Http_FileContent_CreateContentReadStreamAsync}

```csharp
protected override Task<Stream> CreateContentReadStreamAsync()
```

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)\>

## CreateContentReadStreamAsync(CancellationToken) {#Sisk_Core_Http_FileContent_CreateContentReadStreamAsync_System_Threading_CancellationToken_}

```csharp
protected override Task<Stream> CreateContentReadStreamAsync(CancellationToken cancellationToken)
```

### Parameters

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)\>
