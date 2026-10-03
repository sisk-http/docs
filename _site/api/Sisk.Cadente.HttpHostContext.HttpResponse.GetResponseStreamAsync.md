# HttpResponse.GetResponseStreamAsync

Kind: Method  
Namespace: `Sisk.Cadente`  
Assembly: `Sisk.Cadente.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.HttpHostContext.HttpResponse.GetResponseStreamAsync.html

## GetResponseStreamAsync(bool) {#Sisk_Cadente_HttpHostContext_HttpResponse_GetResponseStreamAsync_System_Boolean_}

Asynchronously gets the content stream for the response.

```csharp
public Task<Stream> GetResponseStreamAsync(bool chunked = false)
```

### Parameters

`chunked` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)\>

A task that represents the asynchronous operation, with the response content stream as the result.

### Exceptions

[InvalidOperationException](https://learn.microsoft.com/dotnet/api/system.invalidoperationexception)

Thrown when unable to obtain an output stream for the response.

## GetResponseStreamAsync(bool) {#Sisk_Cadente_HttpHostContext_HttpResponse_GetResponseStreamAsync_System_Boolean_}

Asynchronously gets the content stream for the response.

```csharp
public Task<Stream> GetResponseStreamAsync(bool chunked = false)
```

### Parameters

`chunked` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Returns

[Task](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task\-1)<[Stream](https://learn.microsoft.com/dotnet/api/system.io.stream)\>

A task that represents the asynchronous operation, with the response content stream as the result.

### Exceptions

[InvalidOperationException](https://learn.microsoft.com/dotnet/api/system.invalidoperationexception)

Thrown when unable to obtain an output stream for the response.
