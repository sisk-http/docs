# HttpServerEngineContextResponse

Kind: Class  
Namespace: `Sisk.Core.Http.Engine`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.html

Provides an abstract base class for HTTP responses.

```csharp
public abstract class HttpServerEngineContextResponse : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerEngineContextResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

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
| [HttpServerEngineContextResponse\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.-ctor.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse__ctor) |  |

## Properties

| Name | Description |
| --- | --- |
| [ContentLength64](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.ContentLength64.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_ContentLength64) | Gets or sets the content length of the response. |
| [ContentType](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.ContentType.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_ContentType) | Gets or sets the content type of the response. |
| [Headers](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.Headers.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_Headers) | Gets or sets the HTTP headers. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.KeepAlive.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_KeepAlive) | Gets or sets a value indicating whether the connection should be kept alive. |
| [OutputStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.OutputStream.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_OutputStream) | Gets the output stream of the response. |
| [SendChunked](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.SendChunked.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_SendChunked) | Gets or sets a value indicating whether chunked transfer encoding is used. |
| [StatusCode](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.StatusCode.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_StatusCode) | Gets or sets the HTTP status code. |
| [StatusDescription](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.StatusDescription.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_StatusDescription) | Gets or sets the status description. |

## Methods

| Name | Description |
| --- | --- |
| [Abort\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.Abort.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_Abort) | Aborts the response. |
| [AppendHeader\(string, string\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.AppendHeader.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_AppendHeader_System_String_System_String_) | Appends a header to the response. |
| [Close\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.Close.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_Close) | Closes the response. |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.HttpServerEngineContextResponse.Dispose.md#Sisk_Core_Http_Engine_HttpServerEngineContextResponse_Dispose) | Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources. |
