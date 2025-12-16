# 使用 SSL

在需要安全性的环境中进行开发时，使用 SSL 可能是必要的，例如大多数 Web 开发场景。Sisk 基于 HttpListener 工作，而 HttpListener 不支持原生 HTTPS，只支持 HTTP。不过，有一些变通方法可以让你在 Sisk 中使用 SSL。见下文：

## 通过 Sisk.Cadente.CoreEngine

- 可用平台：Linux、macOS、Windows
- 难度：easy

可以在 Sisk 项目中使用实验性的 [**Cadente**](/docs/cn/cadente) 引擎，而无需在计算机或项目中进行额外配置。你需要在项目中安装 `Sisk.Cadente.CoreEngine` 包，才能在 Sisk 服务器中使用 Cadente 服务器。

要配置 SSL，可以使用构建器的 `UseSsl` 和 `UseEngine` 方法：

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注意：此包仍处于实验阶段。

## 通过 Windows 上的 IIS

- 可用平台：Windows
- 难度：medium

如果你使用 Windows，可以通过 IIS 为你的 HTTP 服务器启用 SSL。为此，建议你事先阅读 [此教程](/docs/cn/registering-namespace)，以便在你的应用程序监听的主机不是 “localhost” 时进行相应配置。

要实现此功能，需要通过 Windows 功能安装 IIS。IIS 对 Windows 和 Windows Server 用户免费提供。要在应用程序中配置 SSL，请准备好 SSL 证书，即使是自签名证书也可以。随后，你可以查看 [如何在 IIS 7 或更高版本上设置 SSL](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)。

## 通过 mitmproxy

- 可用平台：Linux、macOS、Windows
- 难度：easy

**mitmproxy** 是一种拦截代理工具，允许开发者和安全测试人员检查、修改和记录客户端（如网页浏览器）与服务器之间的 HTTP 和 HTTPS 流量。你可以使用 **mitmdump** 实用程序在客户端和 Sisk 应用之间启动反向 SSL 代理。

1. 首先，在你的机器上安装 [mitmproxy](https://mitmproxy.org/)。
2. 启动你的 Sisk 应用。此示例中，我们使用 8000 端口作为不安全的 HTTP 端口。
3. 启动 mitmproxy 服务器，在安全端口 8001 上监听：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

即可开始使用！你已经可以通过 `https://localhost:8001/` 访问你的应用。即使你的应用未运行，也可以启动 `mitmdump`。

另外，你可以在项目中添加对 [mitmproxy helper](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) 的引用。这仍然要求在电脑上已安装 mitmproxy。

## 通过 Sisk.SslProxy 包

- 可用平台：Linux、macOS、Windows
- 难度：easy

> [!IMPORTANT]
> 
> Sisk.SslProxy 包已被 `Sisk.Cadente.CoreEngine` 包取代并不再维护。

Sisk.SslProxy 包是一种在 Sisk 应用上启用 SSL 的简易方式。但它是一个 **极其实验性的** 包。使用此包可能不够稳定，但你可以成为少数为其可行性和稳定性做出贡献的人之一。要开始使用，可以通过以下方式安装 Sisk.SslProxy 包：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
> 
> 必须在 Visual Studio 包管理器中启用 “Include prerelease” 才能安装 Sisk.SslProxy。

同样，这仍是一个实验项目，切勿考虑将其投入生产环境。

目前，Sisk.SslProxy 能处理大多数 HTTP/1.1 功能，包括 HTTP Continue、Chunked-Encoding、WebSockets 和 SSE。更多关于 SslProxy 的信息请参阅 [此处](/docs/cn/extensions/ssl-proxy)。