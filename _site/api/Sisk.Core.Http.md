# Sisk.Core.Http

Kind: Namespace  
Namespace: `Sisk.Core.Http`  
Source: https://docs.sisk-framework.org/api/Sisk.Core.Http.html

### Namespaces

| Name | Description |
| --- | --- |
| [Sisk.Core.Http.Engine](https://docs.sisk-framework.org/api/Sisk.Core.Http.Engine.md) |  |
| [Sisk.Core.Http.FileSystem](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileSystem.md) |  |
| [Sisk.Core.Http.Handlers](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.md) |  |
| [Sisk.Core.Http.Hosting](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.md) |  |
| [Sisk.Core.Http.Streams](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.md) |  |

### Classes

| Name | Description |
| --- | --- |
| [BrotliContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.md) | Represents an HTTP content that is compressed using the Brotli algorithm. |
| [CompressedContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.md) | Represents a base class for HTTP contents served over an compressing stream. |
| [DefaultMessagePage](https://docs.sisk-framework.org/api/Sisk.Core.Http.DefaultMessagePage.md) | Provides methods for creating informative static pages used by Sisk. |
| [DeflateContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.md) | Represents an HTTP content that is compressed using the Deflate algorithm. |
| [FileContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.FileContent.md) | Provides HTTP content based on a file. |
| [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md) | Provides HTTP forwarding resolving methods that can be used to resolving the client remote address, host and protocol of a proxy, load balancer or CDN, through the HTTP request. |
| [GZipContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.md) | Represents an HTTP content that is compressed using the GZip algorithm. |
| [HtmlContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.HtmlContent.md) | Provides HTTP content based on HTML contents. |
| [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) | Represents an context that is shared in a entire HTTP session. |
| [HttpContext.HttpContextInterlocked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.md) | Provides atomic operations for numeric values stored by name in an [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md). |
| [HttpContext.HttpContextInterlocked](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.HttpContextInterlocked.md) | Provides atomic operations for numeric values stored by name in an [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md). |
| [HttpKnownHeaderNames](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpKnownHeaderNames.md) | Provides most of the most commonly known HTTP headers for constants. |
| [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) | Represents an HTTP request received by a Sisk server. |
| [HttpRequestException](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestException.md) | Represents an exception that is thrown while a request is being interpreted by the HTTP server. |
| [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) | Represents an HTTP Response. |
| [HttpResponseExtensions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponseExtensions.md) | Provides useful extensions for [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) objects. |
| [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) | Provides an lightweight HTTP server powered by Sisk. |
| [HttpServerConfiguration](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.md) | Provides execution parameters for an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [HttpServerExecutionResult](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionResult.md) | Represents the results of an request execution on the HTTP server. |
| [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) | Provides a type to contain the fields needed by an HTTP server virtual host. |
| [ListeningHostRepository](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostRepository.md) | Represents an fluent repository of [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) that can add, modify, or remove listening hosts while an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md) is running. |
| [ListeningHostSslOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHostSslOptions.md) | Represents the options for configuring HTTPS on a [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md). |
| [LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) | Provides a managed, asynchronous log writer which supports writing safe data to log files or text streams. |
| [PrefixedLogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.PrefixedLogStream.md) | Represents a log stream that prefixes log messages with a custom string. |
| [RotatingLogPolicy](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicy.md) | Provides a managed utility for rotating log files by their file size. |
| [RotatingLogPolicyCompressor](https://docs.sisk-framework.org/api/Sisk.Core.Http.RotatingLogPolicyCompressor.md) | Provides a base class for implementing log compression policies. |

### Structs

| Name | Description |
| --- | --- |
| [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) | Represents a value that holds an HTTP response status information, with it's status code and description. |
| [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) | Provides a structure to contain a listener port for an [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) instance. |
| [LogStreamEntry](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStreamEntry.md) | Represents a single log entry with a timestamp, severity level, and message. |

### Enums

| Name | Description |
| --- | --- |
| [HttpServerExecutionStatus](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerExecutionStatus.md) | Represents the status of an execution of a request on an [HttpServer](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.md). |
| [RequestListenAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.RequestListenAction.md) | Represents the HTTP server action when receiving an request. |
