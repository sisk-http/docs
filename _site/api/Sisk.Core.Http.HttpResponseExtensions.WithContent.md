# HttpResponseExtensions.WithContent<THttpResponse>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.html

## WithContent&lt;THttpResponse>(THttpResponse, string) {#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_}

Sets the content of the HTTP response to a string.

```csharp
public static THttpResponse WithContent<THttpResponse>(this THttpResponse response, string content) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string content to set.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithContent&lt;THttpResponse>(THttpResponse, string, Encoding?, string) {#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_System_Text_Encoding_System_String_}

Sets the content of the HTTP response to a string with a specified encoding and MIME type.

```csharp
public static THttpResponse WithContent<THttpResponse>(this THttpResponse response, string content, Encoding? encoding, string mimeType) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`content` [string](https://learn.microsoft.com/dotnet/api/system.string)

The string content to set.

`encoding` [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding)?

The encoding to use for the content. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`mimeType` [string](https://learn.microsoft.com/dotnet/api/system.string)

The MIME type of the content.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithContent&lt;THttpResponse>(THttpResponse, HttpContent) {#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_Net_Http_HttpContent_}

Sets the content of the HTTP response to a specified [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent).

```csharp
public static THttpResponse WithContent<THttpResponse>(this THttpResponse response, HttpContent content) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`content` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)

The [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent) to set.

### Returns

 THttpResponse

The modified HTTP response.

### Type Parameters

`THttpResponse`
