# 手动（高级）设置

Source: https://docs.sisk-framework.org/zh-cn/docs/advanced/manual-setup.html

当您需要自行组装服务器组件时使用手动设置，例如一个进程必须暴露多个主机、端口、路由器或自定义服务器配置。对于大多数应用程序，构建器 API 更简洁，应该优先使用。手动设置在您想直接控制四个核心部件时非常有用：`Router`、一个或多个 `ListeningHost` 对象、`HttpServerConfiguration`，以及最终的 `HttpServer`。

首先，我们需要了解请求/响应的概念。它非常简单：每个请求必须有一个响应。Sisk 也遵循这一原则。让我们创建一个方法，以 HTML 返回 “Hello, World!” 消息，并指定状态码和头部。

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

下一步是将此方法关联到一个 HTTP 路由。

## 路由器

路由器是请求路由的抽象，充当请求与响应之间的桥梁。路由器管理服务路由、函数和错误。

一个路由器可以拥有多个路由，每个路由可以在该路径上执行不同的操作，例如执行函数、提供页面或返回服务器资源。

让我们创建第一个路由器，并将 `IndexPage` 方法关联到根路径。

```csharp
Router mainRouter = new Router();

mainRouter.MapGet("/", IndexPage);
```

现在我们的路由器可以接收请求并发送响应。然而，`mainRouter` 并未绑定到主机或服务器，单独使用是无效的。下一步是创建我们的 ListeningHost。

## 监听主机和端口

一个 [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) 可以托管一个路由器，并为同一路由器提供多个监听端口。一个 [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) 是 HTTP 服务器将监听的前缀。

这里，我们可以创建一个指向两个端点的 `ListeningHost`：

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

现在我们的 HTTP 服务器将监听指定的端点，并将请求转发到我们的路由器。

## 服务器配置

服务器配置负责大部分 HTTP 服务器本身的行为。在此配置中，我们可以将 `ListeningHosts` 与服务器关联。

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // 将我们的 ListeningHost 添加到此服务器配置中
```

常用服务器配置选项：

| Property | Default | 使用场景 | 备注 |
| --- | --- | --- | --- |
| [RemoteRequestsAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.md) | `RequestListenAction.Accept` | 服务应拒绝非本地请求，除非它们通过受信任的反向代理进入。 | 仅在部署拓扑明确时将其设为 `Drop`。 |
| [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md) | `false` | 客户端或代理需要在 `X-Request-Id` 响应头中看到 Sisk 请求 ID。 | 与包含 `HttpRequest.RequestId` 的日志配合使用。 |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout.md) | `120` 秒 | 空闲的 Keep-Alive 连接应在适当时机关闭。 | 由 HTTP 引擎实现。 |
| [NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md) | `false` | 您收到的头部存在编码不匹配。 | 处理会有额外开销，除非必要请保持关闭。 |
| [SendSiskHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader.md) | `true` | 您想隐藏或暴露 `X-Powered-By` Sisk 头部。 | 为更严格的生产环境头部策略请禁用。 |
| [OptionsLogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode.md) | `LogOutput.Both` | 您想减少或重定向自动 `OPTIONS` 处理产生的日志。 | 使用与路由相同的日志模式值。 |
| [AsyncRequestProcessing](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing.md) | `true` | 您需要确定性的单请求处理以便诊断。 | 禁用会限制吞吐量。 |
| [DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md) | `true` | 实现了 `IDisposable` 的请求袋值应自动释放。 | 除非在其他地方管理所有权，否则保持启用。 |
| [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) | `true` | 值处理器应将异步可枚举转换为阻塞的可枚举值。 | 当您自行实现异步流处理时请禁用。 |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive.md) | `true` | 响应后连接应保持可复用。 | 对于不善于处理持久连接的客户端或中间件请禁用。 |
| [ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md) | `false` | GET 路由应重定向到带尾随斜杠的 URL。 | 仅适用于非正则路由。 |
| [MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md) | `0` | 请求体需要大小限制。 | `0` 表示无限制，直至框架或内存上限。 |
| [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md) | `false` | 当客户端支持时应自动压缩响应。 | 已经是 `CompressedContent` 的响应不会再次压缩。 |

接下来，我们可以创建 HTTP 服务器：

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // 启动服务器
Console.ReadKey(); // 防止应用程序退出
```

现在我们可以编译可执行文件并使用以下命令运行 HTTP 服务器：

```bash
dotnet watch
```

运行时，打开浏览器并访问服务器路径，您应该会看到：

<img src="/assets/img/localhost.png" >
