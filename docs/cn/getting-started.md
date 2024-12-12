## Sisk 入门指南

Sisk 可以运行在任何 .NET 环境中。在本指南中，我们将教您如何使用 .NET 创建一个 Sisk 应用程序。如果您还没有安装，请从 [这里](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) 下载 SDK。

在本教程中，我们将介绍如何创建项目结构、接收请求、获取 URL 参数以及发送响应。本指南将重点介绍使用 C# 构建一个简单的服务器。您也可以使用您喜欢的编程语言。

> [!NOTE]
> 您可能对快速入门项目感兴趣。有关更多信息，请查看 [这个存储库](https://github.com/sisk-http/quickstart)。

## 创建项目

让我们将我们的项目命名为“我的 Sisk 应用程序”。在您设置好 .NET 后，可以使用以下命令创建项目：

```bash
dotnet new console -n my-sisk-application
```

接下来，导航到您的项目目录，并使用 .NET 实用工具安装 Sisk：

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

您可以在 [这里](https://www.nuget.org/packages/Sisk.HttpServer/) 找到有关在项目中安装 Sisk 的其他方法。

现在，让我们创建一个 HTTP 服务器实例。在本例中，我们将配置它在端口 5000 上侦听。

## 构建 HTTP 服务器

Sisk 允许您逐步手动构建应用程序，因为它会路由到 HttpServer 对象。但是，对于大多数项目来说，这可能不太方便。因此，我们可以使用构建器方法，这使得启动应用程序变得更加容易。

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

了解 Sisk 的每个重要组件非常重要。在本文档的后面部分，您将学习有关 Sisk 如何工作的更多信息。

## 手动（高级）设置

您可以在文档的 [这个部分](/docs/advanced/manual-setup) 中了解每个 Sisk 机制的工作原理，该部分解释了 HttpServer、Router、ListeningPort 以及其他组件的行为和关系。



