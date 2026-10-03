# HttpResponse.GetHeaderValue

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.GetHeaderValue.html

## GetHeaderValue(string) {#Sisk_Core_Http_HttpResponse_GetHeaderValue_System_String_}

Gets the value of a specific header from the request and content headers.

```csharp
public string? GetHeaderValue(string headerName)
```

### Parameters

`headerName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header to retrieve.

### Returns

[string](https://learn.microsoft.com/dotnet/api/system.string)?

The header value, or [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null) if the header is not found.
