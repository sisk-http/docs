# CompressedContent.SerializeToStreamAsync

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.SerializeToStreamAsync.html

## SerializeToStreamAsync(Stream, TransportContext?) {#Sisk_Core_Http_CompressedContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_}

```csharp
protected override sealed Task SerializeToStreamAsync(Stream stream, TransportContext? context)
```

### Parameters

`stream` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

`context` [TransportContext](https://learn.microsoft.com/dotnet/api/system.net.transportcontext)?

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)

## SerializeToStreamAsync(Stream, TransportContext?, CancellationToken) {#Sisk_Core_Http_CompressedContent_SerializeToStreamAsync_System_IO_Stream_System_Net_TransportContext_System_Threading_CancellationToken_}

```csharp
protected override sealed Task SerializeToStreamAsync(Stream stream, TransportContext? context, CancellationToken cancellationToken)
```

### Parameters

`stream` [Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)

`context` [TransportContext](https://learn.microsoft.com/dotnet/api/system.net.transportcontext)?

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task)
