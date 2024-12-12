## 手动（高级）设置

在本节中，我们将创建一个没有任何预定义标准的 HTTP 服务器，以一种完全抽象的方式。在这里，您可以手动构建 HTTP 服务器的工作方式。每个 ListeningHost 都有一个路由器，一个 HTTP 服务器可以有多个 ListeningHost，每个 ListeningHost 指向不同主机上的不同端口。

首先，我们需要理解请求/响应的概念。它非常简单：对于每个请求，都必须有一个响应。Sisk 也遵循这个原则。让我们创建一个方法，它以 HTML 格式响应“Hello, World！”消息，并指定状态码和标头。

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

下一步是将此方法与 HTTP 路由关联。

## 路由器

路由器是请求路由的抽象，是服务请求和响应之间的桥梁。路由器管理服务路由、函数和错误。

一个路由器可以有多个路由，每个路由可以在该路径上执行不同的操作，例如执行一个函数、服务一个页面或提供服务器上的资源。

让我们创建第一个路由器，并将我们的 `IndexPage` 方法与索引路径关联。

```csharp
Router mainRouter = new Router();

// SetRoute 将所有索引路由与我们的方法关联。
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

现在我们的路由器可以接收请求并发送响应。但是，`mainRouter` 没有与主机或服务器关联，因此它无法单独工作。下一步是创建我们的 ListeningHost。

## 监听主机和端口

[ListeningHost](/api/Sisk.Core.Http.ListeningHost) 可以托管路由器和同一路由器的多个监听端口。[ListeningPort](/api/Sisk.Core.Http.ListeningPort) 是 HTTP 服务器将监听的前缀。

在这里，我们可以创建一个 `ListeningHost`，它指向我们路由器的两个端点：

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

现在我们的 HTTP 服务器将监听指定的端点并将请求重定向到我们的路由器。

## 服务器配置

服务器配置负责 HTTP 服务器本身的大多数行为。在此配置中，我们可以将 `ListeningHosts` 与我们的服务器关联。

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

现在我们可以编译我们的可执行文件并使用以下命令运行我们的 HTTP 服务器：

```bash
dotnet watch
```

在运行时，打开浏览器并导航到服务器路径，您应该会看到：

<img src="/assets/img/localhost.png" >