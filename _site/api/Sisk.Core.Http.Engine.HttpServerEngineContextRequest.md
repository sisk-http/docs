# HttpServerEngineContextRequest

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.html

Provides an abstract base class for HTTP requests.

```csharp
public abstract class HttpServerEngineContextRequest
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngineContextRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.md)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.MemberwiseClone\(\)](https://learn.microsoft.com/dotnet/api/system.object.memberwiseclone), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpServerEngineContextRequest\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.-ctor.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ContentEncoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.ContentEncoding.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_ContentEncoding) | Gets the content encoding of the request. |
| [ContentLength64](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.ContentLength64.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_ContentLength64) | Gets the content length of the request. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.Headers.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_Headers) | Gets the HTTP headers. |
| [HttpMethod](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.HttpMethod.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_HttpMethod) | Gets the HTTP method of the request. |
| [InputStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.InputStream.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_InputStream) | Gets the input stream of the request. |
| [IsLocal](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.IsLocal.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_IsLocal) | Gets a value indicating whether the request is from the local machine. |
| [IsSecureConnection](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.IsSecureConnection.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_IsSecureConnection) | Gets a value indicating whether the connection is secure. |
| [LocalEndPoint](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.LocalEndPoint.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_LocalEndPoint) | Gets the local endpoint of the request. |
| [ProtocolVersion](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.ProtocolVersion.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_ProtocolVersion) | Gets the HTTP protocol version. |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.QueryString.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_QueryString) | Gets the query string collection. |
| [RawUrl](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.RawUrl.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_RawUrl) | Gets the raw URL of the request. |
| [RemoteEndPoint](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.RemoteEndPoint.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_RemoteEndPoint) | Gets the remote endpoint of the request. |
| [RequestTraceIdentifier](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.RequestTraceIdentifier.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_RequestTraceIdentifier) | Gets the request trace identifier. |
| [Url](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.Url.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_Url) | Gets the URL of the request. |
| [UserHostName](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextRequest.UserHostName.md#Sisk_Core_Http_Engine_HttpServerEngineContextRequest_UserHostName) | Gets the host name of the user. |
