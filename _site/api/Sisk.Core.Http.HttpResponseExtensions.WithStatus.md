# HttpResponseExtensions.WithStatus<THttpResponse>

Kind: Method  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.html

## WithStatus&lt;THttpResponse>(THttpResponse, int) {#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Int32_}

Sets the status code of the HTTP response using an integer.

```csharp
public static HttpResponse WithStatus<THttpResponse>(this THttpResponse response, int httpStatusCode) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`httpStatusCode` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The integer HTTP status code.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithStatus&lt;THttpResponse>(THttpResponse, HttpStatusCode) {#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Net_HttpStatusCode_}

Sets the status code of the HTTP response using an [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) enum.

```csharp
public static HttpResponse WithStatus<THttpResponse>(this THttpResponse response, HttpStatusCode statusCode) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`statusCode` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

The [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) to set.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

The modified HTTP response.

### Type Parameters

`THttpResponse` 

## WithStatus&lt;THttpResponse>(THttpResponse, in HttpStatusInformation) {#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_Sisk_Core_Http_HttpStatusInformation__}

Sets the status of the HTTP response using [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md).

```csharp
public static HttpResponse WithStatus<THttpResponse>(this THttpResponse response, in HttpStatusInformation statusInformation) where THttpResponse : notnull, HttpResponse
```

### Parameters

`response` THttpResponse

`statusInformation` [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md)

The [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) to set.

### Returns

[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

The modified HTTP response.

### Type Parameters

`THttpResponse`
