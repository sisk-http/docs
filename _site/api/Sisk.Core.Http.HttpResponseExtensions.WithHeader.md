# HttpResponseExtensions.WithHeader<THttpResponse>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeader.html

## WithHeader&lt;THttpResponse>(THttpResponse, string, string) {#Sisk_Core_Http_HttpResponseExtensions_WithHeader__1___0_System_String_System_String_}

Adds a header to the HTTP response.

```csharp
public static THttpResponse WithHeader<THttpResponse>(this THttpResponse response, string headerName, string headerValue) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`headerName` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the header.

`headerValue` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value of the header.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse`
