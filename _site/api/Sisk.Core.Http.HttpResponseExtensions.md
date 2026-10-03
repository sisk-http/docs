# HttpResponseExtensions

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.html

Provides useful extensions for [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) objects.

```csharp
public static class HttpResponseExtensions
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpResponseExtensions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Methods

| Name | Description |
| --- | --- |
| [WithContent<THttpResponse\>\(THttpResponse, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_) | Sets the content of the HTTP response to a string. |
| [WithContent<THttpResponse\>\(THttpResponse, string, Encoding?, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_String_System_Text_Encoding_System_String_) | Sets the content of the HTTP response to a string with a specified encoding and MIME type. |
| [WithContent<THttpResponse\>\(THttpResponse, HttpContent\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithContent.md#Sisk_Core_Http_HttpResponseExtensions_WithContent__1___0_System_Net_Http_HttpContent_) | Sets the content of the HTTP response to a specified [HttpContent](https://learn.microsoft.com/dotnet/api/system.net.http.httpcontent). |
| [WithCookie<THttpResponse\>\(THttpResponse, string, string, DateTime?, TimeSpan?, string?, string?, bool?, bool?, string?\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithCookie.md#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_String_System_String_System_Nullable_System_DateTime__System_Nullable_System_TimeSpan__System_String_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_String_) | Adds a cookie to the HTTP response with specified parameters. |
| [WithCookie<THttpResponse\>\(THttpResponse, Cookie\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithCookie.md#Sisk_Core_Http_HttpResponseExtensions_WithCookie__1___0_System_Net_Cookie_) | Adds a cookie to the HTTP response using a [Cookie](https://learn.microsoft.com/dotnet/api/system.net.cookie) object. |
| [WithHeader<THttpResponse\>\(THttpResponse, string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeader.md#Sisk_Core_Http_HttpResponseExtensions_WithHeader__1___0_System_String_System_String_) | Adds a header to the HTTP response. |
| [WithHeaders<THttpResponse\>\(THttpResponse, IDictionary<string, string?\>\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeaders.md#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_System_Collections_Generic_IDictionary_System_String_System_String__) | Adds multiple headers to the HTTP response from a dictionary. |
| [WithHeaders<THttpResponse\>\(THttpResponse, StringKeyStoreCollection\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithHeaders.md#Sisk_Core_Http_HttpResponseExtensions_WithHeaders__1___0_Sisk_Core_Entity_StringKeyStoreCollection_) | Adds multiple headers to the HTTP response from a [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md). |
| [WithStatus<THttpResponse\>\(THttpResponse, int\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Int32_) | Sets the status code of the HTTP response using an integer. |
| [WithStatus<THttpResponse\>\(THttpResponse, HttpStatusCode\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_System_Net_HttpStatusCode_) | Sets the status code of the HTTP response using an [HttpStatusCode](https://learn.microsoft.com/dotnet/api/system.net.httpstatuscode) enum. |
| [WithStatus<THttpResponse\>\(THttpResponse, in HttpStatusInformation\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.WithStatus.md#Sisk_Core_Http_HttpResponseExtensions_WithStatus__1___0_Sisk_Core_Http_HttpStatusInformation__) | Sets the status of the HTTP response using [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md). |
