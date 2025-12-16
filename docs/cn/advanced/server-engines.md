# HTTP 服务器引擎

Sisk Framework 被分成几个包，其中主包（Sisk.HttpServer）不包含一个基本的 HTTP 服务器 - 默认情况下，[HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) 被用作 Sisk 的主要引擎来执行服务器的低级别角色。

HTTP 引擎实现了 Sisk 提供的应用层以下的层次。这个层次负责连接管理、消息的序列化和反序列化、消息队列控制和与机器的 socket 通信。

[HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) 类暴露了一个 API 来实现所有必要的 HTTP 引擎功能，以便在 Sisk 的上层使用，例如路由、SSE、中间件等。这些功能不是 HTTP 引擎的责任，而是将使用 HTTP 引擎作为基础的库的子集的责任。

通过这种抽象，可以将 Sisk 移植到使用任何其他 HTTP 引擎，既可以是 .NET 也可以不是 .NET 的，例如 Kestrel。目前，Sisk 仍然使用对本地 .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) 的抽象作为新项目的默认值。这个默认抽象带来了一些特定的问题，例如在不同平台上的行为未指定（HttpListener 有 Windows 和其他平台的不同实现）、缺乏对 SSL 的支持以及在 Windows 之外的性能不佳。

也有一种实验性的高性能服务器实现，纯粹用 C# 编写，作为 Sisk 的 HTTP 引擎，称为 [Cadente](https://github.com/sisk-http/core/tree/main/cadente) 项目，这是一个可以与 Sisk 或不与 Sisk 一起使用的托管服务器的实验。

## 实现 Sisk 的 HTTP 引擎

您可以通过扩展 [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) 类来创建一个现有 HTTP 服务器和 Sisk 之间的连接桥梁。除了这个类，您还需要实现上下文、请求和响应的抽象。

一个完整的抽象示例可以在 [GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) 上找到。它看起来像这样：

```csharp
/// <summary>
/// 提供使用 <see cref="HttpListener"/> 的 <see cref="HttpServerEngine"/> 实现。
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// 获取 <see cref="HttpListenerAbstractEngine"/> 类的共享实例。
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// 初始化 <see cref="HttpListenerAbstractEngine"/> 类的新实例。
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

在创建 HTTP 引擎时，服务器将监听请求并在单独的线程中创建上下文来处理每一个请求。为此，您需要选择一个 [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism)：

- `InlineAsynchronousGetContext` 事件循环是线性的 - HTTP 上下文处理调用发生在异步循环中。
- `UnboundAsynchronousGetContext` 事件循环通过 `BeginGetContext` 和 `EndGetContext` 方法传递。

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

您不需要实现两个事件循环。选择最适合您的 HTTP 引擎的一个。

## 测试

在链接您的 HTTP 引擎后，执行测试以确保所有 Sisk 功能在使用其他引擎时具有相同的行为是非常重要的。**确保 Sisk 在不同 HTTP 引擎下的行为相同是非常重要的**。

您可以访问测试仓库 [GitHub](https://github.com/sisk-http/core/tree/main/tests)。