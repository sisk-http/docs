# HTTP Server Engines

The Sisk Framework is divided into several packages, where the main one (Sisk.HttpServer) does not include a base HTTP server - by default, [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) is used as the main engine of Sisk to perform the low-level role of the server.

The HTTP engine fulfills the role of the layer below the application layer offered by Sisk. This layer is responsible for connection management, serialization and deserialization of messages, message queue control, and communication with the machine's socket.

The [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) class exposes an API to implement all the necessary functionalities of an HTTP engine to be used in upper layers with Sisk, such as routing, SSE, middlewares, etc. These functions are not the responsibility of the HTTP engine, but rather of the subset of libraries that will use the HTTP engine as a base for execution.

With this abstraction, it is possible to port Sisk to be used with any other HTTP engine, written in .NET or not, such as Kestrel, for example. Currently, Sisk remains using an abstraction of the native .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) as the default for new projects. This default abstraction brings some specific problems, such as unspecified behavior on different platforms (HttpListener has one implementation for Windows and another for other platforms), lack of support for SSL, and not very pleasant performance outside of Windows.

An experimental implementation of a high-performance server written purely in C# is also available as an HTTP engine for Sisk, called the [Cadente](https://github.com/sisk-http/core/tree/main/cadente) project, which is an experiment of a managed server that can be used with Sisk or not.

## Implementing an HTTP Engine for Sisk

You can create a connection bridge between an existing HTTP server and Sisk by extending the [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) class. In addition to this class, you will also have to implement abstractions for contexts, requests, and responses.

A complete abstraction example is [available on GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) for viewing. It looks like this:

```csharp
/// <summary>
/// Provides an implementation of <see cref="HttpServerEngine"/> using <see cref="HttpListener"/>.
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// Gets the shared instance of the <see cref="HttpListenerAbstractEngine"/> class.
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// Initializes a new instance of the <see cref="HttpListenerAbstractEngine"/> class.
    /// </summary>
    public HttpListenerAbstractEngine () {
        _listener = new HttpListener {
            IgnoreWriteExceptions = true
        };
    }

    /// <inheritdoc/>
    public override TimeSpan IdleConnectionTimeout {
        get => _listener.TimeoutManager.IdleConnection;
        set => _listener.TimeoutManager.IdleConnection = value;
    }
    
    // ...
}
```

## Choosing an Event Loop

During the creation of an HTTP engine, the server will listen for requests in a loop and create contexts to handle each one of them in separate threads. For this, you will have to choose an [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` the event loop is linear - HTTP context handling calls occur in an asynchronous loop.
- `UnboundAsynchronousGetContext` the event loop is transmitted through the `BeginGetContext` and `EndGetContext` methods.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

You don't need to implement both event loops. Choose the one that makes the most sense for your HTTP engine.

## Testing

After linking your HTTP engine, it is essential to perform tests to ensure that all Sisk functionalities have identical behavior when using other engines. **It is extremely important** to have the same behavior of Sisk for different HTTP engines.

You can visit the test repository on [GitHub](https://github.com/sisk-http/core/tree/main/tests).
