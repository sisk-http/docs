# 入门指南

欢迎来到 Sisk 文档！

最后，什么是 Sisk Framework？它是一个开源的轻量级库，使用 .NET 构建，旨在成为最小化、灵活和抽象的。它允许开发人员快速创建互联网服务，几乎不需要任何配置。Sisk 使您的现有应用程序能够拥有一个托管的 HTTP 模块，完整且可丢弃。

Sisk 的价值观包括代码透明度、模块化、性能和可扩展性，并且可以处理各种类型的应用程序，例如 Restful、JSON-RPC、Web-sockets 等。

其主要功能包括：

| 资源 | 描述 |
| ------- | --------- |
| [路由](/docs/cn/fundamentals/routing) | 支持前缀、自定义方法、路径变量、值转换器等的路径路由器。 |
| [请求处理器](/docs/cn/fundamentals/request-handlers) | 也称为中间件，提供一个接口来构建自己的请求处理器，与请求之前或之后的操作一起工作。 |
| [压缩](/docs/cn/fundamentals/responses#gzip-deflate-and-brotli-compression) | 使用 Sisk轻松压缩响应内容。 |
| [Web sockets](/docs/cn/features/websockets) | 提供接受完整 Web sockets 的路由，用于读取和写入客户端。 |
| [服务器发送事件](/docs/cn/features/server-sent-events) | 提供向支持 SSE 协议的客户端发送服务器事件的功能。 |
| [日志记录](/docs/cn/features/logging) | 简化日志记录。记录错误、访问、定义按大小轮换日志、同一日志的多个输出流等。 |
| [多主机](/docs/cn/advanced/multi-host-setup) | 为多个端口创建 HTTP 服务器，每个端口都有自己的路由器，每个路由器都有自己的应用程序。 |
| [服务器处理器](/docs/cn/advanced/http-server-handlers) | 扩展您自己的 HTTP 服务器实现。使用扩展、改进和新功能进行自定义。 |

## 第一步

Sisk 可以在任何 .NET 环境中运行。在本指南中，我们将教您如何使用 .NET 创建 Sisk 应用程序。如果您尚未安装它，请从 [这里](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) 下载 SDK。

在本教程中，我们将介绍如何创建项目结构、接收请求、获取 URL 参数和发送响应。本指南将重点介绍使用 C# 构建一个简单的服务器。您也可以使用您喜欢的编程语言。

> [!NOTE]
>您可能对快速入门项目感兴趣。请查看 [此存储库](https://github.com/sisk-http/quickstart) 以获取更多信息。

## 创建项目

让我们将项目命名为"My Sisk Application"。一旦您设置了 .NET，您可以使用以下命令创建项目：

```bash
dotnet new console -n my-sisk-application
```

接下来，导航到您的项目目录，并使用 .NET 实用工具安装 Sisk：

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

您可以在 [这里](https://www.nuget.org/packages/Sisk.HttpServer/) 找到在项目中安装 Sisk 的其他方法。

现在，让我们创建一个 HTTP 服务器实例。对于这个示例，我们将配置它以监听端口 5000。

## 构建 HTTP 服务器

Sisk 允许您一步一步地手动构建应用程序，因为它路由到 HttpServer 对象。然而，这可能对于大多数项目来说并不方便。因此，我们可以使用构建器方法，它使得让应用程序启动变得更容易。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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

了解 Sisk 的每个重要组件至关重要。稍后在本文档中，您将了解更多关于 Sisk 工作原理的信息。

## 手动（高级）设置

您可以在文档的 [此部分](/docs/cn/advanced/manual-setup) 中了解每个 Sisk 机制的工作原理，它解释了 HttpServer、Router、ListeningPort 和其他组件之间的行为和关系。