# CadenteHttpServerEngineRequest

Kind: Class  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.html

Represents an HTTP request within the Cadente engine context.

```csharp
public sealed class CadenteHttpServerEngineRequest : HttpServerEngineContextRequest
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerEngineContextRequest ← 
[CadenteHttpServerEngineRequest](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.md)

#### Inherited Members

HttpServerEngineContextRequest.IsLocal, 
HttpServerEngineContextRequest.RawUrl, 
HttpServerEngineContextRequest.QueryString, 
HttpServerEngineContextRequest.ProtocolVersion, 
HttpServerEngineContextRequest.UserHostName, 
HttpServerEngineContextRequest.Url, 
HttpServerEngineContextRequest.HttpMethod, 
HttpServerEngineContextRequest.LocalEndPoint, 
HttpServerEngineContextRequest.RemoteEndPoint, 
HttpServerEngineContextRequest.RequestTraceIdentifier, 
HttpServerEngineContextRequest.Headers, 
HttpServerEngineContextRequest.InputStream, 
HttpServerEngineContextRequest.ContentLength64, 
HttpServerEngineContextRequest.IsSecureConnection, 
HttpServerEngineContextRequest.ContentEncoding, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CadenteHttpServerEngineRequest\(HttpRequest, HttpHostContext\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.-ctor.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest__ctor_Sisk_Cadente_HttpHostContext_HttpRequest_Sisk_Cadente_HttpHostContext_) | Initializes a new instance of the [CadenteHttpServerEngineRequest](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [ContentEncoding](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.ContentEncoding.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_ContentEncoding) | Gets the content encoding of the request. |
| [ContentLength64](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.ContentLength64.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_ContentLength64) | Gets the content length of the request. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.Headers.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_Headers) | Gets the HTTP headers. |
| [HttpMethod](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.HttpMethod.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_HttpMethod) | Gets the HTTP method of the request. |
| [InputStream](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.InputStream.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_InputStream) | Gets the input stream of the request. |
| [IsLocal](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.IsLocal.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_IsLocal) | Gets a value indicating whether the request is from the local machine. |
| [IsSecureConnection](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.IsSecureConnection.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_IsSecureConnection) | Gets a value indicating whether the connection is secure. |
| [LocalEndPoint](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.LocalEndPoint.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_LocalEndPoint) | Gets the local endpoint of the request. |
| [ProtocolVersion](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.ProtocolVersion.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_ProtocolVersion) | Gets the HTTP protocol version. |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.QueryString.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_QueryString) | Gets the query string collection. |
| [RawUrl](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.RawUrl.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_RawUrl) | Gets the raw URL of the request. |
| [RemoteEndPoint](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.RemoteEndPoint.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_RemoteEndPoint) | Gets the remote endpoint of the request. |
| [RequestTraceIdentifier](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.RequestTraceIdentifier.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_RequestTraceIdentifier) | Gets the request trace identifier. |
| [Url](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.Url.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_Url) | Gets the URL of the request. |
| [UserHostName](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineRequest.UserHostName.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineRequest_UserHostName) | Gets the host name of the user. |
