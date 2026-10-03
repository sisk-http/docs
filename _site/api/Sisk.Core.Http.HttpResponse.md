# HttpResponse

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.html

Represents an HTTP Response.

```csharp
public class HttpResponse
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

#### Extension Methods

[HttpResponseExtensions.WithContent<HttpResponse\>\(HttpResponse, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_), 
[HttpResponseExtensions.WithContent<HttpResponse\>\(HttpResponse, string, Encoding?, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_System_Text_Encoding_System_String_), 
[HttpResponseExtensions.WithContent<HttpResponse\>\(HttpResponse, HttpContent\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_Net_Http_HttpContent_), 
[HttpResponseExtensions.WithCookie<HttpResponse\>\(HttpResponse, string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithCookie.md#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_), 
[HttpResponseExtensions.WithCookie<HttpResponse\>\(HttpResponse, Cookie\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithCookie.md#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_Net_Cookie_), 
[HttpResponseExtensions.WithHeader<HttpResponse\>\(HttpResponse, string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeader.md#Sisk_Core_Http_HttpResponseExtensions_WithHeader__1___0_System_String_System_String_), 
[HttpResponseExtensions.WithHeaders<HttpResponse\>\(HttpResponse, IDictionary<string, string?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeaders.md#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_System_Collections_Generic_IDictionary_System_String_System_String__), 
[HttpResponseExtensions.WithHeaders<HttpResponse\>\(HttpResponse, StringKeyStoreCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeaders.md#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_Sisk_Core_Entity_StringKeyStoreCollection_), 
[HttpResponseExtensions.WithStatus<HttpResponse\>\(HttpResponse, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Int32_), 
[HttpResponseExtensions.WithStatus<HttpResponse\>\(HttpResponse, HttpStatusCode\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Net_HttpStatusCode_), 
[HttpResponseExtensions.WithStatus<HttpResponse\>\(HttpResponse, in HttpStatusInformation\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_Sisk_Core_Http_HttpStatusInformation__)

## Constructors

| Name | Description |
| --- | --- |
| [HttpResponse\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with HTTP OK status code and no content. |
| [HttpResponse\(int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_Int32_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code. |
| [HttpResponse\(int, HttpContent?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_Int32_System_Net_Http_HttpContent_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and HTTP content. |
| [HttpResponse\(HttpContent?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_Net_Http_HttpContent_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given HTTP content, with default status code as 200 OK. |
| [HttpResponse\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_String_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instanec with given string content and status code as 200 OK. |
| [HttpResponse\(HttpStatusCode, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_Net_HttpStatusCode_System_String_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and string content. |
| [HttpResponse\(HttpStatusCode, HttpContent?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_System_Net_HttpStatusCode_System_Net_Http_HttpContent_) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code and HTTP contents. |
| [HttpResponse\(in HttpStatusInformation\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.-ctor.md#Sisk_Core_Http_HttpResponse__ctor_Sisk_Core_Http_HttpStatusInformation__) | Creates an new [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) instance with given status code. |

## Properties

| Name | Description |
| --- | --- |
| [Content](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.Content.md#Sisk_Core_Http_HttpResponse_Content) | Gets or sets the HTTP response body contents. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.Headers.md#Sisk_Core_Http_HttpResponse_Headers) | Gets or sets the [HttpHeaderCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.md) instance of the HTTP response headers. |
| [SendChunked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SendChunked.md#Sisk_Core_Http_HttpResponse_SendChunked) | Gets or sets whether the HTTP response will be sent chunked. When setting this property to [`true`](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/bool), the Content-Length header is automatically omitted. |
| [Status](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.Status.md#Sisk_Core_Http_HttpResponse_Status) | Gets or sets the HTTP status code and description for this HTTP response. |

## Methods

| Name | Description |
| --- | --- |
| [Equals\(object?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.Equals.md#Sisk_Core_Http_HttpResponse_Equals_System_Object_) |  |
| [GetHashCode\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.GetHashCode.md#Sisk_Core_Http_HttpResponse_GetHashCode) |  |
| [GetHeaderValue\(string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.GetHeaderValue.md#Sisk_Core_Http_HttpResponse_GetHeaderValue_System_String_) | Gets the value of a specific header from the request and content headers. |
| [GetRawHttpResponse\(bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.GetRawHttpResponse.md#Sisk_Core_Http_HttpResponse_GetRawHttpResponse_System_Boolean_) | Gets a visual representation of this HTTP response. |
| [Refuse\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.Refuse.md#Sisk_Core_Http_HttpResponse_Refuse) | Creates an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) object which closes the connection with the client immediately (ECONNRESET). |
| [SetCookie\(Cookie\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SetCookie.md#Sisk_Core_Http_HttpResponse_SetCookie_System_Net_Cookie_) | Sets a cookie and sends it in the response to be set by the client. |
| [SetCookie\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SetCookie.md#Sisk_Core_Http_HttpResponse_SetCookie_System_String_System_String_) | Sets a cookie and sends it in the response to be set by the client. |
| [SetCookie\(string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.SetCookie.md#Sisk_Core_Http_HttpResponse_SetCookie_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_) | Sets a cookie and sends it in the response to be set by the client. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.ToString.md#Sisk_Core_Http_HttpResponse_ToString) |  |
