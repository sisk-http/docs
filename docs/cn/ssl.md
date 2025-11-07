# 使用 SSL

在需要安全性的环境（例如大多数 Web 开发场景）下，开发时使用 SSL 可能是必要的。Sisk 基于 HttpListener，HttpListener 本身不支持原生 HTTPS，只支持 HTTP。然而，有一些变通方法可以让你在 Sisk 中使用 SSL。请参阅下面的说明：

## 通过 Sisk.Cadente.CoreEngine

- 可用平台：Linux、macOS、Windows
- 努力程度：简单

你可以在 Sisk 项目中使用实验性的 **Cadente** 引擎，而无需在计算机或项目中进行额外配置。你需要在项目中安装 `Sisk.Cadente.CoreEngine` 包，以便在 Sisk 服务器中使用 Cadente 服务器。

要配置 SSL，你可以使用构建器的 `UseSsl` 和 `UseEngine` 方法：

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注：此包仍处于实验阶段。

## 通过 Windows 上的 IIS

- 可用平台：Windows
- 努力程度：中等

如果你在 Windows 上，可以使用 IIS 为你的 HTTP 服务器启用 SSL。为此，建议你先按照[此教程](/docs/cn/registering-namespace)操作，如果你希望应用程序监听除 “localhost” 之外的主机。

为使其工作，你必须通过 Windows 功能安装 IIS。IIS 对 Windows 和 Windows Server 用户免费提供。要在应用程序中配置 SSL，请准备好 SSL 证书，即使它是自签名的。接下来，你可以查看[如何在 IIS 7 或更高版本上设置 SSL](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)。

## 通过 mitmproxy

- 可用平台：Linux、macOS、Windows
- 努力程度：简单

**mitmproxy** 是一个拦截代理工具，允许开发者和安全测试人员检查、修改和记录客户端（如 Web 浏览器）与服务器之间的 HTTP 和 HTTPS 流量。你可以使用 **mitmdump** 工具在客户端和 Sisk 应用之间启动一个反向 SSL 代理。

1. 首先，在你的机器上安装 [mitmproxy](https://mitmproxy.org/)。
2. 启动你的 Sisk 应用。此示例中，我们使用 8000 端口作为不安全的 HTTP 端口。
3. 启动 mitmproxy 服务器，在安全端口 8001 上监听：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

完成后即可使用 `https://localhost:8001/` 访问你的应用。你不需要让应用运行即可启动 `mitmdump`。

另外，你可以在项目中添加对[mitmproxy helper](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy)的引用。仍然需要在电脑上安装 mitmproxy。

## 通过 Sisk.SslProxy 包

- 可用平台：Linux、macOS、Windows
- 努力程度：简单

> [!IMPORTANT]
>
> Sisk.SslProxy 包已被弃用，推荐使用 `Sisk.Cadente.CoreEngine` 包，并将不再维护。

Sisk.SslProxy 包是为你的 Sisk 应用启用 SSL 的一种简单方式。然而，它是一个**极其实验性的**包。使用此包可能不稳定，但你可以成为少数人之一，帮助使其可行且稳定。要开始使用，你可以安装 Sisk.SslProxy 包：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> 你必须在 Visual Studio 包管理器中启用“包含预发行版”，才能安装 Sisk.SslProxy。

同样，它是一个实验项目，绝不要考虑将其投入生产。

目前，Sisk.SslProxy 可以处理大多数 HTTP/1.1 功能，包括 HTTP Continue、Chunked-Encoding、WebSockets 和 SSE。更多关于 SslProxy 的信息请参阅[此处](/docs/cn/extensions/ssl-proxy)。