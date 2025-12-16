# 使用 SSL

在开发中使用 SSL 可能是必要的，尤其是在需要安全的环境中，例如大多数 Web 开发场景。Sisk 基于 HttpListener 构建，而 HttpListener 不支持原生的 HTTPS，只支持 HTTP。然而，有一些变通方法可以让你在 Sisk 中使用 SSL。请参见以下内容：

## 通过 Sisk.Cadente.CoreEngine

- 支持平台：Linux、macOS、Windows
- 难度：简单

你可以在 Sisk 项目中使用实验性的 **Cadente** 引擎，而无需在计算机或项目中进行额外的配置。要使用 Cadente 服务器，你需要在项目中安装 `Sisk.Cadente.CoreEngine` 包。

要配置 SSL，你可以使用构建器的 `UseSsl` 和 `UseEngine` 方法：

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注意：此包仍处于实验阶段。

## 通过 IIS 在 Windows 上

- 支持平台：Windows
- 难度：中等

如果你在 Windows 上，你可以使用 IIS 来启用 HTTP 服务器的 SSL。如果你想让你的应用程序监听其他主机而不是 "localhost"，建议你先按照 [此教程](/docs/cn/registering-namespace) 进行操作。

要使其生效，你需要通过 Windows 功能安装 IIS。IIS 对 Windows 和 Windows Server 用户免费。要在应用程序中配置 SSL，请准备好 SSL 证书，即使它是自签名的。接下来，你可以参见 [如何在 IIS 7 或更高版本上设置 SSL](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)。

## 通过 mitmproxy

- 支持平台：Linux、macOS、Windows
- 难度：简单

**mitmproxy** 是一个拦截代理工具，允许开发人员和安全测试人员检查、修改和记录客户端（如 Web 浏览器）和服务器之间的 HTTP 和 HTTPS 流量。你可以使用 **mitmdump** 实用程序在客户端和 Sisk 应用程序之间启动反向 SSL 代理。

1. 首先，在你的机器上安装 [mitmproxy](https://mitmproxy.org/)。
2. 启动你的 Sisk 应用程序。对于这个例子，我们将使用端口 8000 作为不安全的 HTTP 端口。
3. 启动 mitmproxy 服务器以监听安全端口 8001：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

就绪！你现在可以通过 `https://localhost:8001/` 访问你的应用程序。你的应用程序不需要运行才能启动 `mitmdump`。

或者，你可以在项目中添加对 [mitmproxy 帮助程序](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) 的引用。这仍然需要在你的计算机上安装 mitmproxy。

## 通过 Sisk.SslProxy 包

- 支持平台：Linux、macOS、Windows
- 难度：简单

> [!IMPORTANT]
>
> Sisk.SslProxy 包已弃用，推荐使用 `Sisk.Cadente.CoreEngine` 包，并且不会再维护。

Sisk.SslProxy 包是启用 Sisk 应用程序 SSL 的一种简单方法。然而，它是一个 **非常实验性** 的包。使用此包可能不稳定，但你可以成为少数为使此包可行和稳定做出贡献的人。要开始使用，你可以安装 Sisk.SslProxy 包：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> 你必须在 Visual Studio 包管理器中启用 "包括预览版" 来安装 Sisk.SslProxy。

同样，这是一个实验项目，因此请不要考虑将其投入生产。

目前，Sisk.SslProxy 可以处理大多数 HTTP/1.1 功能，包括 HTTP Continue、Chunked-Encoding、WebSockets 和 SSE。请参见 [这里](/docs/cn/extensions/ssl-proxy) 了解更多关于 SslProxy 的信息。