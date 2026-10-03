# HttpResponse.WriteInlineContentAsync

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.WriteInlineContentAsync.html

## WriteInlineContentAsync(ReadOnlyMemory&lt;byte>, CancellationToken) {#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContentAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_}

Asynchronously writes response headers and a known fixed-size body in a single operation.

```csharp
public ValueTask WriteInlineContentAsync(ReadOnlyMemory<byte> content, CancellationToken cancellationToken = default)
```

### Parameters

`content` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The response body bytes to write.

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A token used to cancel the write operation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)

## WriteInlineContentAsync(ReadOnlyMemory&lt;byte>, CancellationToken) {#Sisk_Cadente_HttpHostContext_HttpResponse_WriteInlineContentAsync_System_ReadOnlyMemory_System_Byte__System_Threading_CancellationToken_}

Asynchronously writes response headers and a known fixed-size body in a single operation.

```csharp
public ValueTask WriteInlineContentAsync(ReadOnlyMemory<byte> content, CancellationToken cancellationToken = default)
```

### Parameters

`content` [ReadOnlyMemory](https://learn.microsoft.com/dotnet/api/system.readonlymemory\-1)<[byte](https://learn.microsoft.com/dotnet/api/system.byte)\>

The response body bytes to write.

`cancellationToken` [CancellationToken](https://learn.microsoft.com/dotnet/api/system.threading.cancellationtoken)

A token used to cancel the write operation.

### Returns

[ValueTask](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask)
