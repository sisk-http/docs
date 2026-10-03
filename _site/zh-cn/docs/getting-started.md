# 入门

Source: https://docs.sisk-framework.org/zh-cn/docs/getting-started.html

欢迎阅读 Sisk 文档！

Sisk 是一个开源的轻量级 .NET HTTP 框架。您可以使用它构建独立的 Web 服务，将 HTTP 模块嵌入现有应用程序，或在反向代理后运行服务，仅使用所需的配置。

Sisk 的价值观包括代码透明性、模块化、性能和可扩展性。它能够处理不同的应用模式，包括 RESTful API、JSON-RPC 服务、WebSocket、Server-Sent Events（服务器发送事件）以及静态文件服务。

它的主要特性包括：

| 资源 | 描述 |
| ------- | --------- |
| [路由](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/routing.md) | 一个支持前缀、自定义方法、路径变量、值转换器等功能的路径路由器。 |
| [请求处理程序](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/request-handlers.md) | 也称为 *中间件*，提供接口以构建您自己的请求处理程序，可在操作前后处理请求。 |
| [压缩](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/responses.md#gzip-deflate-and-brotli-compression) | 使用 Sisk 轻松压缩响应内容。 |
| [WebSocket](https://docs.sisk-framework.org/zh-cn/docs/features/websockets.md) | 提供接受完整 WebSocket 的路由，用于读取和写入客户端。 |
| [服务器发送事件](https://docs.sisk-framework.org/zh-cn/docs/features/server-sent-events.md) | 向支持 SSE 协议的客户端发送服务器事件。 |
| [日志](https://docs.sisk-framework.org/zh-cn/docs/features/logging.md) | 简化的日志记录。记录错误、访问，按大小定义轮转日志，同一日志的多输出流等。 |
| [多主机](https://docs.sisk-framework.org/zh-cn/docs/advanced/multi-host-setup.md) | 为多个端口提供 HTTP 服务器，每个端口拥有自己的路由器，每个路由器拥有自己的应用程序。 |
| [服务器处理程序](https://docs.sisk-framework.org/zh-cn/docs/advanced/http-server-handlers.md) | 扩展您自己的 HTTP 服务器实现。通过扩展、改进和新功能进行自定义。 |

## 第一步

Sisk 可以在任何 .NET 环境中运行。在本指南中，我们将教您如何使用 .NET 创建 Sisk 应用程序。如果您尚未安装，请从 [此处](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) 下载 SDK。

在本教程中，我们将介绍如何创建项目结构、接收请求、获取 URL 参数以及发送响应。本指南将重点使用 C# 构建一个简单的服务器。您也可以使用您喜欢的编程语言。

> [!NOTE]
> 您可能对快速入门项目感兴趣。请查看 [此仓库](https://github.com/sisk-http/quickstart) 获取更多信息。

## 创建项目

我们将项目命名为 “My Sisk Application”。在您设置好 .NET 后，可以使用以下命令创建项目：

```bash
dotnet new console -n my-sisk-application
```

接下来，进入项目目录并使用 .NET 工具安装 Sisk：

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

您可以在[此处](https://www.nuget.org/packages/Sisk.HttpServer/)找到在项目中安装 Sisk 的其他方式。

现在，让我们创建 HTTP 服务器的实例。此示例中，我们将其配置为监听 5000 端口。

## 构建 HTTP 服务器

Sisk 允许您手动一步一步构建应用程序，因为它会路由到 HttpServer 对象。但这对大多数项目来说可能不太方便。因此，我们可以使用构建器方法，使我们的应用更容易启动和运行。

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
            .Build();
        
        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hello, world!")
            };
        });
        
        await app.StartAsync();
    }
}
```

了解 Sisk 的每个关键组件非常重要。稍后在本文档中，您将进一步了解 Sisk 的工作原理。

## 手动（高级）设置

您可以在文档的[此章节](https://docs.sisk-framework.org/zh-cn/docs/advanced/manual-setup.md)了解每个 Sisk 机制的工作原理，其中解释了 HttpServer、Router、ListeningPort 以及其他组件之间的行为和关系。
