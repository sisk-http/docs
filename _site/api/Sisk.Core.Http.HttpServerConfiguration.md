# HttpServerConfiguration

Kind: Class  
Namespace: `Sisk.Core.Http`  
Assembly: `Sisk.Core.dll`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.html

Provides execution parameters for an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md).

```csharp
public sealed class HttpServerConfiguration : IDisposable
```

#### Inheritance

[object](https://learn.microsoft.com/dotnet/api/system.object) ← 
[HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md)

#### Implements

[IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable)

#### Inherited Members

[object.GetType\(\)](https://learn.microsoft.com/dotnet/api/system.object.gettype), 
[object.ToString\(\)](https://learn.microsoft.com/dotnet/api/system.object.tostring), 
[object.Equals\(object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\)), 
[object.Equals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.equals\#system\-object\-equals\(system\-object\-system\-object\)), 
[object.ReferenceEquals\(object?, object?\)](https://learn.microsoft.com/dotnet/api/system.object.referenceequals), 
[object.GetHashCode\(\)](https://learn.microsoft.com/dotnet/api/system.object.gethashcode)

## Constructors

| Name | Description |
| --- | --- |
| [HttpServerConfiguration\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.-ctor.md#Sisk_Core_Http_HttpServerConfiguration__ctor) | Creates an new [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md) instance with no parameters. |

## Fields

| Name | Description |
| --- | --- |
| [DefaultAccessLogFormat](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DefaultAccessLogFormat.md#Sisk_Core_Http_HttpServerConfiguration_DefaultAccessLogFormat) | Represents the default access logging format for incoming HTTP requests. |

## Properties

| Name | Description |
| --- | --- |
| [AccessLogsFormat](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AccessLogsFormat.md#Sisk_Core_Http_HttpServerConfiguration_AccessLogsFormat) | Gets or sets the access logging format for incoming HTTP requests. |
| [AccessLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AccessLogsStream.md#Sisk_Core_Http_HttpServerConfiguration_AccessLogsStream) | Gets or sets the [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) object which the HTTP server will write HTTP server access messages to. |
| [AsyncRequestProcessing](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing.md#Sisk_Core_Http_HttpServerConfiguration_AsyncRequestProcessing) | Gets or sets whether the HTTP server should handle requests asynchronously or if it should limit the request processing to one request per time. |
| [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md#Sisk_Core_Http_HttpServerConfiguration_ConvertIAsyncEnumerableIntoEnumerable) | Gets or sets whether the HTTP server should convert [IAsyncEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.iasyncenumerable) object responses into an blocking [IEnumerable](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable). |
| [DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md#Sisk_Core_Http_HttpServerConfiguration_DisposeDisposableContextValues) | Gets or sets whether the HTTP server should dispose all [IDisposable](https://learn.microsoft.com/dotnet/api/system.idisposable) values in the [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) bag when an HTTP session is closed. |
| [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md#Sisk_Core_Http_HttpServerConfiguration_EnableAutomaticResponseCompression) | Gets or sets whether the HTTP server should automatically compress response content bodies using request-allowed encoding algorithms when possible. |
| [Engine](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.Engine.md#Sisk_Core_Http_HttpServerConfiguration_Engine) | Gets or sets the HTTP server processing engine. |
| [ErrorsLogsStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ErrorsLogsStream.md#Sisk_Core_Http_HttpServerConfiguration_ErrorsLogsStream) | Gets or sets the [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) object which the HTTP server will write HTTP server error transcriptions to. |
| [ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md#Sisk_Core_Http_HttpServerConfiguration_ForceTrailingSlash) | Gets or sets whether the HTTP server should automatically rewrite GET requests to end their path with `/`. This is applyable only to non-Regex routes. |
| [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForwardingResolver.md#Sisk_Core_Http_HttpServerConfiguration_ForwardingResolver) | Gets or sets an object that is responsible for resolving the client address, host and protocol of a proxy, load balancer or CDN, through the HTTP request. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout.md#Sisk_Core_Http_HttpServerConfiguration_IdleConnectionTimeout) | Gets or sets the maximum time allowed for an idle connection. |
| [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md#Sisk_Core_Http_HttpServerConfiguration_IncludeRequestIdHeader) | Gets or sets whether the server should include the "X-Request-Id" header in response headers. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive.md#Sisk_Core_Http_HttpServerConfiguration_KeepAlive) | Gets or sets whether the client should mantain an persistent connection with the HTTP server. |
| [ListeningHosts](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ListeningHosts.md#Sisk_Core_Http_HttpServerConfiguration_ListeningHosts) | Gets or sets the listening hosts repository that the [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) instance will listen to. |
| [MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md#Sisk_Core_Http_HttpServerConfiguration_MaximumContentLength) | Gets or sets the maximum size of a request body before it is closed by the socket. |
| [NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md#Sisk_Core_Http_HttpServerConfiguration_NormalizeHeadersEncodings) | Gets or sets whether the HTTP server should convert request headers encoding to the content encoding. |
| [OptionsLogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode.md#Sisk_Core_Http_HttpServerConfiguration_OptionsLogMode) | Gets or sets the log mode that the HTTP server should use to log OPTIONS requests. |
| [RemoteRequestsAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.md#Sisk_Core_Http_HttpServerConfiguration_RemoteRequestsAction) | Gets or sets the server's action when it receives an HTTP request outside the local host. |
| [SendSiskHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader.md#Sisk_Core_Http_HttpServerConfiguration_SendSiskHeader) | Gets or sets whether the HTTP server should send the X-Powered-By header in all responses. |
| [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md#Sisk_Core_Http_HttpServerConfiguration_ThrowExceptions) | Gets or sets whether the server should throw exceptions instead of reporting it on [HttpServerExecutionStatus](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionStatus.md) if any is thrown while processing requests. |

## Methods

| Name | Description |
| --- | --- |
| [Dispose\(\)](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.Dispose.md#Sisk_Core_Http_HttpServerConfiguration_Dispose) | Frees the resources and invalidates this instance. |
