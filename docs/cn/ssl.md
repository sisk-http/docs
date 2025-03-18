# 使用 SSL

在开发中使用 SSL 可能是必要的，尤其是在需要安全的环境中，例如大多数 Web 开发场景。Sisk 构建在 HttpListener 之上，HttpListener 不支持原生的 HTTPS，只支持 HTTP。然而，有一些变通方法可以让你在 Sisk 中使用 SSL。请参见以下内容：

## 通过 IIS 在 Windows 上

- 可用平台：Windows
- 工作量：中等

如果你在 Windows 上，你可以使用 IIS 来启用 HTTP 服务器的 SSL。为了使其生效，建议你先按照 [此教程](/docs/registering-namespace) 进行操作，如果你想让你的应用程序监听其他主机而不是 "localhost"。

要使其生效，你必须通过 Windows 功能安装 IIS。IIS 对 Windows 和 Windows Server 用户免费。要在你的应用程序中配置 SSL，请准备好 SSL 证书，即使它是自签名的。接下来，你可以查看 [如何在 IIS 7 或更高版本上设置 SSL](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)。

## 通过 mitmproxy

- 可用平台：Linux、macOS、Windows
- 工作量：简单

**mitmproxy** 是一个拦截代理工具，允许开发人员和安全测试人员检查、修改和记录客户端（例如 Web 浏览器）和服务器之间的 HTTP 和 HTTPS 流量。你可以使用 **mitmdump** 实用程序在客户端和 Sisk 应用程序之间启动反向 SSL 代理。

1. 首先，在你的机器上安装 [mitmproxy](https://mitmproxy.org/)。
2. 启动你的 Sisk 应用程序。对于这个例子，我们将使用 8000 端口作为不安全的 HTTP 端口。
3. 启动 mitmproxy 服务器以监听安全端口 8001：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

就这样！你可以通过 `https://localhost:8001/` 访问你的应用程序。你的应用程序不需要运行才能启动 `mitmdump`。

或者，你可以在你的项目中添加对 [mitmproxy 帮助程序](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) 的引用。这仍然需要在你的计算机上安装 mitmproxy。

## 通过 Sisk.SslProxy 包

- 可用平台：Linux、macOS、Windows
- 工作量：简单

Sisk.SslProxy 包是启用 Sisk 应用程序 SSL 的一种简单方法。然而，它是一个 **非常实验性** 的包。使用这个包可能会不稳定，但你可以成为少数人中的一员，他们将为使这个包可行和稳定做出贡献。要开始使用，你可以安装 Sisk.SslProxy 包：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> 你必须在 Visual Studio 包管理器中启用 "启用预发布包" 来安装 Sisk.SslProxy。

再次提醒，这是一个实验项目，所以不要考虑将其投入生产。

目前，Sisk.SslProxy 可以处理大多数 HTTP/1.1 功能，包括 HTTP Continue、Chunked-Encoding、WebSockets 和 SSE。请参阅 [这里](/docs/extensions/ssl-proxy) 了解更多关于 SslProxy 的信息。