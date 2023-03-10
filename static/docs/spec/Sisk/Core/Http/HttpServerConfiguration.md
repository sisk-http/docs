# Class HttpServerConfiguration

## Definition
Namespace: Sisk.Core.Http

```csharp
public class HttpServerConfiguration : IDisposable
```

Provides execution parameters for an [HttpServer](/spec/Sisk/Core/Http/HttpServer) .

## Properties

| Property name | Description |
| --- | --- |
| [AccessLogsStream](/spec/Sisk/Core/Http/HttpServerConfiguration/AccessLogsStream) | Gets or sets the [TextWriter](/spec/System/IO/TextWriter) object which the HTTP server will write HTTP server access messages to. | 
| [ErrorsLogsStream](/spec/Sisk/Core/Http/HttpServerConfiguration/ErrorsLogsStream) | Gets or sets the [TextWriter](/spec/System/IO/TextWriter) object which the HTTP server will write HTTP server error transcriptions to. | 
| [ResolveForwardedOriginAddress](/spec/Sisk/Core/Http/HttpServerConfiguration/ResolveForwardedOriginAddress) | Gets or sets whether the HTTP server should resolve remote (IP) addresses by the X-Forwarded-For header. This option is useful if you are using Sisk through a reverse proxy. | 
| [ResolveForwardedOriginHost](/spec/Sisk/Core/Http/HttpServerConfiguration/ResolveForwardedOriginHost) | Gets or sets whether the HTTP server should resolve remote forwarded hosts by the header X-Forwarded-Host. | 
| [DefaultEncoding](/spec/Sisk/Core/Http/HttpServerConfiguration/DefaultEncoding) | Gets or sets the default encoding for sending and decoding messages. | 
| [MaximumContentLength](/spec/Sisk/Core/Http/HttpServerConfiguration/MaximumContentLength) | Gets or sets the maximum size of a request body before it is closed by the socket. | 
| [Verbose](/spec/Sisk/Core/Http/HttpServerConfiguration/Verbose) | Gets or sets the message level the console will write. This property is now deprecated. Use [AccessLogsStream](/spec/Sisk/Core/Http/HttpServerConfiguration/AccessLogsStream) or [ErrorsLogsStream](/spec/Sisk/Core/Http/HttpServerConfiguration/ErrorsLogsStream) instead. | 
| [IncludeRequestIdHeader](/spec/Sisk/Core/Http/HttpServerConfiguration/IncludeRequestIdHeader) | Gets or sets whether the server should include the "X-Request-Id" header in response headers. | 
| [ListeningHosts](/spec/Sisk/Core/Http/HttpServerConfiguration/ListeningHosts) | Gets or sets the listening hosts repository that the [HttpServer](/spec/Sisk/Core/Http/HttpServer) instance will listen to. | 
| [ThrowExceptions](/spec/Sisk/Core/Http/HttpServerConfiguration/ThrowExceptions) | Gets or sets whether the server should throw exceptions instead of reporting it on [HttpServerExecutionStatus](/spec/Sisk/Core/Http/HttpServerExecutionStatus) if any is thrown while processing requests. | 

## Methods

| Method name | Description |
| --- | --- |
| [Dispose()](/spec/Sisk/Core/Http/HttpServerConfiguration/Dispose--) | Frees the resources and invalidates this instance. | 

## Constructors

| Method name | Description |
| --- | --- |
| [HttpServerConfiguration()](/spec/Sisk/Core/Http/HttpServerConfiguration/_ctor--) | Creates an new [HttpServerConfiguration](/spec/Sisk/Core/Http/HttpServerConfiguration) instance with no parameters. | 

