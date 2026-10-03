# HttpRequest

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.html

Represents an HTTP request received by a Sisk server.

```csharp
public sealed class HttpRequest : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Properties

| Name | Description |
| --- | --- |
| [Authority](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Authority.md#Sisk_Core_Http_HttpRequest_Authority) | Get the requested host header with the port from this HTTP request. |
| [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md#Sisk_Core_Http_HttpRequest_Bag) | Gets the managed object which holds data for an entire HTTP session. |
| [Body](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md#Sisk_Core_Http_HttpRequest_Body) | Gets the HTTP request body as string, decoded by the request content encoding. |
| [ContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.ContentLength.md#Sisk_Core_Http_HttpRequest_ContentLength) | Gets the content length in bytes count. |
| [Context](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Context.md#Sisk_Core_Http_HttpRequest_Context) | Gets the [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) for this request. |
| [Cookies](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Cookies.md#Sisk_Core_Http_HttpRequest_Cookies) | Gets an [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) object with all cookies set in this request. |
| [Culture](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Culture.md#Sisk_Core_Http_HttpRequest_Culture) | Gets the proper [CultureInfo](https://learn.microsoft.com/dotnet/api/system.globalization.cultureinfo) to handle this request. |
| [DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md#Sisk_Core_Http_HttpRequest_DefaultJsonSerializerOptions) | Gets or sets the default options used for JSON serialization. |
| [DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md#Sisk_Core_Http_HttpRequest_DisconnectToken) | Gets a cancellation token that is signaled when the client disconnects. |
| [FullPath](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullPath.md#Sisk_Core_Http_HttpRequest_FullPath) | Gets the raw, full HTTP request path with the query string. |
| [FullUrl](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullUrl.md#Sisk_Core_Http_HttpRequest_FullUrl) | Gets the full URL for this request, with scheme, host, port, path and query. |
| [HasContents](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.HasContents.md#Sisk_Core_Http_HttpRequest_HasContents) | Gets a boolean indicating whether this request has body contents. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Headers.md#Sisk_Core_Http_HttpRequest_Headers) | Gets the HTTP request headers. |
| [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Host.md#Sisk_Core_Http_HttpRequest_Host) | Get the requested host (without port) for this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md). |
| [IsContentAvailable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsContentAvailable.md#Sisk_Core_Http_HttpRequest_IsContentAvailable) | Gets a boolean indicating whether this request has body contents and whether it has already been read into memory by the server. |
| [IsSecure](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsSecure.md#Sisk_Core_Http_HttpRequest_IsSecure) | Gets a boolean indicating whether this request was locally made by an secure transport context (SSL/TLS) or not. |
| [Method](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Method.md#Sisk_Core_Http_HttpRequest_Method) | Gets the HTTP request method. |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Path.md#Sisk_Core_Http_HttpRequest_Path) | Gets the HTTP request path without the query string. |
| [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md#Sisk_Core_Http_HttpRequest_Query) | Gets the HTTP request query value collection. |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.QueryString.md#Sisk_Core_Http_HttpRequest_QueryString) | Gets the HTTP request URL raw query string, including the '?' char. |
| [RawBody](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RawBody.md#Sisk_Core_Http_HttpRequest_RawBody) | Gets the HTTP request body as a byte array. |
| [RemoteAddress](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RemoteAddress.md#Sisk_Core_Http_HttpRequest_RemoteAddress) | Gets the incoming local IP address from the request. |
| [RequestEncoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestEncoding.md#Sisk_Core_Http_HttpRequest_RequestEncoding) | Gets an string [Encoding](https://learn.microsoft.com/dotnet/api/system.text.encoding) that can be used to decode text in this HTTP request. |
| [RequestId](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestId.md#Sisk_Core_Http_HttpRequest_RequestId) | Gets a unique identifier for this request. |
| [RequestedAt](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestedAt.md#Sisk_Core_Http_HttpRequest_RequestedAt) | Gets the moment which the request was received by the server. |
| [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md#Sisk_Core_Http_HttpRequest_RouteParameters) | Gets the [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md) object which represents the current route parameters. |
| [Uri](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Uri.md#Sisk_Core_Http_HttpRequest_Uri) | Gets the [Uri](https://learn.microsoft.com/dotnet/api/system.uri) component for this HTTP request requested URL. |

## Methods

| Name | Description |
| --- | --- |
| [Abort\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Abort.md#Sisk_Core_Http_HttpRequest_Abort) | Immediately closes the connection with the client and does not send any response. |
| [\~HttpRequest\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Finalize.md#Sisk_Core_Http_HttpRequest_Finalize) |  |
| [GetBodyContents\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetBodyContents.md#Sisk_Core_Http_HttpRequest_GetBodyContents) | Gets the request contents of the body as a byte array. |
| [GetBodyContentsAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetBodyContentsAsync.md#Sisk_Core_Http_HttpRequest_GetBodyContentsAsync_System_Threading_CancellationToken_) | Asynchronously reads the request contents as a memory byte array. |
| [GetEventSource\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.md#Sisk_Core_Http_HttpRequest_GetEventSource_System_String_) | Gets an Event Source interface for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in it's event source listening state. |
| [GetEventSourceAsync\(string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSourceAsync.md#Sisk_Core_Http_HttpRequest_GetEventSourceAsync_System_String_) | Asynchronously gets an Event Source interface for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in its event source listening state. |
| [GetFormContent\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetFormContent.md#Sisk_Core_Http_HttpRequest_GetFormContent) | Reads the request body and extracts form data parameters from it. |
| [GetFormContentAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetFormContentAsync.md#Sisk_Core_Http_HttpRequest_GetFormContentAsync_System_Threading_CancellationToken_) | Asynchronously reads the request body and extracts form data parameters from it. |
| [GetJsonContent<T\>\(JsonTypeInfo<T\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContent.md#Sisk_Core_Http_HttpRequest_GetJsonContent__1_System_Text_Json_Serialization_Metadata_JsonTypeInfo___0__) | Deserializes the request body into an object of type `T` using the provided [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo). |
| [GetJsonContent<T\>\(JsonSerializerOptions?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContent.md#Sisk_Core_Http_HttpRequest_GetJsonContent__1_System_Text_Json_JsonSerializerOptions_) | Deserializes the request body into an object of type `T` using the provided [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions). |
| [GetJsonContent<T\>\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContent.md#Sisk_Core_Http_HttpRequest_GetJsonContent__1) | Deserializes the request body into an object of type `T` using the default [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions) from [DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md). |
| [GetJsonContentAsync<T\>\(JsonTypeInfo<T\>, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContentAsync.md#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Text_Json_Serialization_Metadata_JsonTypeInfo___0__System_Threading_CancellationToken_) | Asynchronously deserializes the request body into an object of type `T` using the provided [JsonTypeInfo](https://learn.microsoft.com/dotnet/api/system.text.json.serialization.metadata.jsontypeinfo). |
| [GetJsonContentAsync<T\>\(JsonSerializerOptions?, CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContentAsync.md#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Text_Json_JsonSerializerOptions_System_Threading_CancellationToken_) | Asynchronously deserializes the request body into an object of type `T` using the provided [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions). |
| [GetJsonContentAsync<T\>\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetJsonContentAsync.md#Sisk_Core_Http_HttpRequest_GetJsonContentAsync__1_System_Threading_CancellationToken_) | Asynchronously deserializes the request body into an object of type `T` using the default [JsonSerializerOptions](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializeroptions). |
| [GetMultipartFormContent\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContent.md#Sisk_Core_Http_HttpRequest_GetMultipartFormContent) | Reads the request body and obtains a [MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md) from it. |
| [GetMultipartFormContentAsync\(CancellationToken\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync.md#Sisk_Core_Http_HttpRequest_GetMultipartFormContentAsync_System_Threading_CancellationToken_) | Asynchronously reads the request body and obtains a [MultipartFormCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartFormCollection.md) from it. |
| [GetRawHttpRequest\(bool, bool\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest.md#Sisk_Core_Http_HttpRequest_GetRawHttpRequest_System_Boolean_System_Boolean_) | Gets a visual representation of this request. |
| [GetRequestStream\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRequestStream.md#Sisk_Core_Http_HttpRequest_GetRequestStream) | Gets the HTTP request content stream. This property is only available while the content has not been imported by the HTTP server and will invalidate the body content cached in this object. |
| [GetResponseStream\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetResponseStream.md#Sisk_Core_Http_HttpRequest_GetResponseStream) | Gets an HTTP response stream for this HTTP request. |
| [GetWebSocket\(string?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetWebSocket.md#Sisk_Core_Http_HttpRequest_GetWebSocket_System_String_System_String_) | Accepts and acquires a websocket for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in streaming state. |
| [GetWebSocketAsync\(string?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetWebSocketAsync.md#Sisk_Core_Http_HttpRequest_GetWebSocketAsync_System_String_System_String_) | Asynchronously accepts and acquires a websocket for this request. Calling this method will put this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) instance in streaming state. |
| [SendTo\(RouteAction\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.SendTo.md#Sisk_Core_Http_HttpRequest_SendTo_Sisk_Core_Routing_RouteAction_) | Calls another handler for this request, preserving the current call-stack frame, and then returns the response from it. This method manages to prevent possible stack overflows. |
| [ToString\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.ToString.md#Sisk_Core_Http_HttpRequest_ToString) | Gets an string representation of this [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object. |
