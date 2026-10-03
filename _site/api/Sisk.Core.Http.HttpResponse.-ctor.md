# HttpResponse constructor

Kind: Constructor  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.html

## HttpResponse() {#Sisk_Core_Http_HttpResponse__ctor}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with HTTP OK status
code and no content.

```csharp
public HttpResponse()
```

## HttpResponse(int) {#Sisk_Core_Http_HttpResponse__ctor_System_Int32_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code.

```csharp
public HttpResponse(int status)
```

### Parameters

`status` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The status code of this HTTP response.

## HttpResponse(int, HttpContent?) {#Sisk_Core_Http_HttpResponse__ctor_System_Int32_System_Net_Http_HttpContent_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and HTTP content.

```csharp
public HttpResponse(int status, HttpContent? content)
```

### Parameters

`status` [int](https://learn.microsoft.com/dotnet/api/system.int32)

The status code of this HTTP response.

`content` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)?

The response content, if any.

## HttpResponse(HttpContent?) {#Sisk_Core_Http_HttpResponse__ctor_System_Net_Http_HttpContent_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given HTTP content, with default status code as 200 OK.

```csharp
public HttpResponse(HttpContent? content)
```

### Parameters

`content` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)?

The response content, if any.

## HttpResponse(string) {#Sisk_Core_Http_HttpResponse__ctor_System_String_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instanec with given string content and status code as 200 OK.

```csharp
public HttpResponse(string stringContent)
```

### Parameters

`stringContent` [string](https://learn.microsoft.com/dotnet/api/system.string)

The UTF-8 string content.

## HttpResponse(HttpStatusCode, string) {#Sisk_Core_Http_HttpResponse__ctor_System_Net_HttpStatusCode_System_String_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and string content.

```csharp
public HttpResponse(HttpStatusCode status, string stringContent)
```

### Parameters

`status` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

The [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) of this HTTP response.

`stringContent` [string](https://learn.microsoft.com/dotnet/api/system.string)

The UTF-8 string content.

## HttpResponse(HttpStatusCode, HttpContent?) {#Sisk_Core_Http_HttpResponse__ctor_System_Net_HttpStatusCode_System_Net_Http_HttpContent_}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and HTTP contents.

```csharp
public HttpResponse(HttpStatusCode status, HttpContent? content)
```

### Parameters

`status` [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode)

The [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) of this HTTP response.

`content` [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent)?

The response content, if any.

## HttpResponse(in HttpStatusInformation) {#Sisk_Core_Http_HttpResponse__ctor_Sisk_Core_Http_HttpStatusInformation__}

Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code.

```csharp
public HttpResponse(in HttpStatusInformation status)
```

### Parameters

`status` [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md)

The [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) of this HTTP response.
