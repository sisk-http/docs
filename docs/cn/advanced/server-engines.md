# HTTP 服务器引擎

Sisk 框架被划分为多个包，其中主包（Sisk.HttpServer）默认不包含基础 HTTP 服务器——默认使用 [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) 作为 Sisk 的主要引擎来执行服务器的低级角色。

HTTP 引擎承担了 Sisk 所提供的应用层之下的层次的角色。该层负责连接管理、消息的序列化与反序列化、消息队列控制，以及与机器套接字的通信。

[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) 类公开了一个 API，用于实现所有必要的 HTTP 引擎功能，以便在 Sisk 的上层使用，例如路由、SSE、中间件等。这些功能并非 HTTP 引擎的职责，而是将使用 HTTP 引擎作为执行基础的一组库的职责。

通过这种抽象，可以将 Sisk 移植到任何其他 HTTP 引擎上使用，无论是否为 .NET 编写，例如 Kestrel。当前，Sisk 仍然使用对原生 .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) 的抽象作为新项目的默认值。该默认抽象带来了一些特定问题，例如在不同平台上的行为未指定（HttpListener 在 Windows 上有一个实现，在其他平台上有另一个实现）、缺乏对 SSL 的支持，以及在 Windows 之外的性能不太理想。

一个完全用 C# 编写的高性能服务器的实验性实现也可作为 Sisk 的 HTTP 引擎使用，称为 [Cadente](https://github.com/sisk-http/core/tree/main/cadente) 项目，它是一个可与 Sisk 一起使用或不一起使用的托管服务器实验。

## 为 Sisk 实现 HTTP 引擎

你可以通过扩展 [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) 类，在现有 HTTP 服务器与 Sisk 之间创建连接桥。除了此类，你还需要实现上下文、请求和响应的抽象。

完整的抽象示例可在 [GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) 查看。示例代码如下：

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

## 选择事件循环

在创建 HTTP 引擎时，服务器将在循环中监听请求，并为每个请求创建上下文，在单独的线程中处理它们。为此，你需要选择一个 [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism)：

- `InlineAsynchronousGetContext` 事件循环是线性的——HTTP 上下文处理调用在异步循环中发生。
- `UnboundAsynchronousGetContext` 事件循环通过 `BeginGetContext` 和 `EndGetContext` 方法传递。

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

你不需要实现两个事件循环。选择最适合你 HTTP 引擎的那一个。

## 测试

在链接你的 HTTP 引擎后，进行测试以确保所有 Sisk 功能在使用其他引擎时具有相同的行为至关重要。**极其重要**的是，Sisk 在不同 HTTP 引擎下表现一致。

你可以访问 [GitHub](https://github.com/sisk-http/core/tree/main/tests) 上的测试仓库。