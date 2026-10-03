# HttpResponseExtensions.WithCookie<THttpResponse>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithCookie.html

## WithCookie&lt;THttpResponse>(THttpResponse, string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?) {#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_}

Adds a cookie to the HTTP response with specified parameters.

```csharp
public static HttpResponse WithCookie<THttpResponse>(this THttpResponse response, string name, string value, DateTime? expires = null, TimeSpan? maxAge = null, string? domain = null, string? path = null, bool? secure = null, bool? httpOnly = null, string? sameSite = null) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`name` [string](https://learn.microsoft.com/dotnet/api/system.string)

The name of the cookie.

`value` [string](https://learn.microsoft.com/dotnet/api/system.string)

The value of the cookie.

`expires` [DateTime](https://learn.microsoft.com/dotnet/api/system.datetime)?

The expiration date and time of the cookie. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`maxAge` [TimeSpan](https://learn.microsoft.com/dotnet/api/system.timespan)?

The maximum age of the cookie in seconds. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`domain` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The domain for which the cookie is valid. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`path` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The path for which the cookie is valid. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`secure` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)?

A value indicating whether the cookie should only be sent over HTTPS. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`httpOnly` [bool](https://learn.microsoft.com/dotnet/api/system.boolean)?

A value indicating whether the cookie should be inaccessible to client-side scripts. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

`sameSite` [string](https://learn.microsoft.com/dotnet/api/system.string)?

The SameSite attribute for the cookie. Can be [`null`](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/null).

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithCookie&lt;THttpResponse>(THttpResponse, Cookie) {#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_Net_Cookie_}

Adds a cookie to the HTTP response using a [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie) object.

```csharp
public static HttpResponse WithCookie<THttpResponse>(this THttpResponse response, Cookie cookie) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`cookie` [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie)

The [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie) object to add.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

The modified HTTP response.

### Type Parameters

`THttpResponse`
