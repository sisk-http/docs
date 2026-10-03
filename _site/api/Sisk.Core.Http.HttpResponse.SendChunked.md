# HttpResponse.SendChunked

Kind: Property  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SendChunked.html

## SendChunked {#Sisk_Core_Http_HttpResponse_SendChunked}

Gets or sets whether the HTTP response will be sent chunked. When setting this property to [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool),
the Content-Length header is automatically omitted.

```csharp
public bool SendChunked { get; set; }
```

### Property Value

[bool](https://learn.microsoft.com/dotnet/api/system.boolean)

### Remarks

The response is always sent as chunked when it is not possible to determine the size of the content to send.
