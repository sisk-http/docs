# 开始使用 Sisk

Sisk 可以在任何 .NET 环境中运行。在本指南中，我们将教您如何使用 .NET 创建一个 Sisk 应用程序。如果您尚未安装它，请从 [这里](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) 下载 SDK。

在本教程中，我们将介绍如何创建项目结构、接收请求、获取 URL 参数和发送响应。本指南将重点介绍使用 C# 构建一个简单的服务器。您也可以使用您喜欢的编程语言。

> [!NOTE]
>您可能对快速入门项目感兴趣。请查看 [此仓库](https://github.com/sisk-http/quickstart) 以获取更多信息。

## 创建项目

让我们将我们的项目命名为"My Sisk Application"。一旦您设置了 .NET，您可以使用以下命令创建您的项目：

```bash
dotnet new console -n my-sisk-application
```

接下来，导航到您的项目目录并使用 .NET 实用工具安装 Sisk：

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

您可以在 [这里](https://www.nuget.org/packages/Sisk.HttpServer/) 找到在项目中安装 Sisk 的其他方法。

现在，让我们创建一个 HTTP 服务器实例。对于这个示例，我们将配置它以监听端口 5000。

## 构建 HTTP 服务器

Sisk 允许您一步一步地手动构建您的应用程序，因为它路由到 HttpServer 对象。然而，这对于大多数项目来说可能不是很方便。因此，我们可以使用构建器方法，它使得让我们的应用程序启动变得更容易。

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

了解 Sisk 的每个重要组件至关重要。稍后在本文档中，您将了解更多关于 Sisk 的工作原理。

## 手动（高级）设置

您可以在文档的 [此部分](/docs/advanced/manual-setup) 中学习每个 Sisk 机制的工作原理，它解释了 HttpServer、Router、ListeningPort 和其他组件之间的行为和关系。