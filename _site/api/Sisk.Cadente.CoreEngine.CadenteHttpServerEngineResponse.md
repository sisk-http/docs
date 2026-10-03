# CadenteHttpServerEngineResponse

Kind: Class  
Namespace: `Sisk.Cadente.CoreEngine`  
Assembly: `Sisk.Cadente.CoreEngine.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.html

Represents an HTTP response within the Cadente engine context.

```csharp
public sealed class CadenteHttpServerEngineResponse : HttpServerEngineContextResponse, IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
HttpServerEngineContextResponse ← 
[CadenteHttpServerEngineResponse](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

HttpServerEngineContextResponse.AppendHeader\(string, string\), 
HttpServerEngineContextResponse.Abort\(\), 
HttpServerEngineContextResponse.Close\(\), 
HttpServerEngineContextResponse.Dispose\(\), 
HttpServerEngineContextResponse.StatusCode, 
HttpServerEngineContextResponse.StatusDescription, 
HttpServerEngineContextResponse.KeepAlive, 
HttpServerEngineContextResponse.SendChunked, 
HttpServerEngineContextResponse.ContentLength64, 
HttpServerEngineContextResponse.ContentType, 
HttpServerEngineContextResponse.Headers, 
HttpServerEngineContextResponse.OutputStream, 
[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [CadenteHttpServerEngineResponse\(HttpResponse, HttpHostContext\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.-ctor.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse__ctor_Sisk_Cadente_HttpHostContext_HttpResponse_Sisk_Cadente_HttpHostContext_) | Initializes a new instance of the [CadenteHttpServerEngineResponse](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.md) class. |

## Properties

| Name | Description |
| --- | --- |
| [ContentLength64](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.ContentLength64.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_ContentLength64) | Gets or sets the content length of the response. |
| [ContentType](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.ContentType.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_ContentType) | Gets or sets the content type of the response. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.Headers.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_Headers) | Gets or sets the HTTP headers. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.KeepAlive.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_KeepAlive) | Gets or sets a value indicating whether the connection should be kept alive. |
| [OutputStream](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.OutputStream.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_OutputStream) | Gets the output stream of the response. |
| [SendChunked](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.SendChunked.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_SendChunked) | Gets or sets a value indicating whether chunked transfer encoding is used. |
| [StatusCode](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.StatusCode.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_StatusCode) | Gets or sets the HTTP status code. |
| [StatusDescription](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.StatusDescription.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_StatusDescription) | Gets or sets the status description. |

## Methods

| Name | Description |
| --- | --- |
| [Abort\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.Abort.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_Abort) | Aborts the response. |
| [AppendHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.AppendHeader.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_AppendHeader_System_String_System_String_) | Appends a header to the response. |
| [Close\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.Close.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_Close) | Closes the response. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Cadente.CoreEngine.CadenteHttpServerEngineResponse.Dispose.md#Sisk_Cadente_CoreEngine_CadenteHttpServerEngineResponse_Dispose) | Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources. |
