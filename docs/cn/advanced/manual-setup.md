# 手动（高级）设置

在本节中，我们将创建一个没有任何预定义标准的 HTTP 服务器，以完全抽象的方式构建。这里，您可以手动构建 HTTP 服务器的功能。每个 ListeningHost 都有一个路由器，一个 HTTP 服务器可以有多个 ListeningHost，每个 ListeningHost 指向不同的主机和端口。

首先，我们需要了解请求/响应概念。它非常简单：对于每个请求，必须有一个响应。Sisk 也遵循这个原则。让我们创建一个方法，响应一个“Hello, World！”消息，指定状态代码和头部。

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

下一步是将此方法与一个 HTTP 路由关联起来。

## 路由器

路由器是请求路由的抽象，作为服务的请求和响应之间的桥梁。路由器管理服务路由、函数和错误。

一个路由器可以有多个路由，每个路由可以在该路径上执行不同的操作，例如执行一个函数、提供一个页面或提供服务器上的资源。

让我们创建我们的第一个路由器，并将我们的 `IndexPage` 方法与索引路径关联起来。

```csharp
Router mainRouter = new Router();

// SetRoute 将所有索引路由与我们的方法关联起来。
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

现在我们的路由器可以接收请求并发送响应。然而，`mainRouter` 不绑定到一个主机或服务器，因此它不能单独工作。下一步是创建我们的 ListeningHost。

## Listening Hosts 和 Ports

一个 [ListeningHost](/api/Sisk.Core.Http.ListeningHost) 可以托管一个路由器和多个监听端口，用于同一个路由器。一个 [ListeningPort](/api/Sisk.Core.Http.ListeningPort) 是一个前缀，HTTP 服务器将在此监听。

这里，我们可以创建一个 `ListeningHost`，它指向两个端点，用于我们的路由器：

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

现在我们的 HTTP 服务器将监听指定的端点，并将其请求重定向到我们的路由器。

## 服务器配置

服务器配置负责 HTTP 服务器本身的大部分行为。在此配置中，我们可以将 `ListeningHosts` 关联到我们的服务器。

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // 将我们的 ListeningHost 添加到此服务器配置
```

接下来，我们可以创建我们的 HTTP 服务器：

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // 启动服务器
Console.ReadKey(); // 防止应用程序退出
```

现在我们可以编译我们的可执行文件，并使用以下命令运行我们的 HTTP 服务器：

```bash
dotnet watch
```

在运行时，打开您的浏览器并导航到服务器路径，您应该会看到：

<img src="/assets/img/localhost.png" >