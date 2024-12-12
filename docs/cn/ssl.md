使用 SSL 进行开发在需要安全性的情况下可能很有必要，例如大多数 Web 开发场景。Sisk 运行在 HttpListener 之上，它不支持本机 HTTPS，仅支持 HTTP。但是，有一些解决方法允许您在 Sisk 中使用 SSL。请参阅以下内容：

## 通过 Windows 上的 IIS

- 可用平台：Windows
- 难度：中等

如果您使用的是 Windows，可以使用 IIS 在您的 HTTP 服务器上启用 SSL。为了使此功能正常工作，建议您事先按照 [此教程](/docs/registering-namespace) 进行操作，以便您的应用程序能够侦听除“localhost”以外的主机。

为了使此功能正常工作，您必须通过 Windows 功能安装 IIS。IIS 可免费提供给 Windows 和 Windows Server 用户。要配置应用程序中的 SSL，请准备好 SSL 证书，即使它是自签名的。接下来，您可以查看 [如何设置 IIS 7 或更高版本上的 SSL](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)。

## 通过 mitmproxy

- 可用平台：Linux、macOS、Windows
- 难度：简单

**mitmproxy** 是一种拦截代理工具，允许开发人员和安全测试人员检查、修改和记录客户端（例如 Web 浏览器）和服务器之间 的 HTTP 和 HTTPS 流量。您可以使用 **mitmdump** 实用程序在您的客户端和 Sisk 应用程序之间启动反向 SSL 代理。

1. 首先，在您的计算机上安装 [mitmprxy](https://mitmproxy.org/)。
2. 启动您的 Sisk 应用程序。在本例中，我们将使用 8000 端口作为不安全的 HTTP 端口。
3. 启动 mitmproxy 服务器以侦听 8001 端口上的安全端口：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

现在就可以开始了！您可以通过 `https://localhost:8001/` 访问您的应用程序。您的应用程序不需要运行才能启动 `mitmdump`。

## 通过 Sisk.SslProxy 包

- 可用平台：Linux、macOS、Windows
- 难度：简单

Sisk.SslProxy 包是启用 Sisk 应用程序 SSL 的一种简单方法。但是，它是一个 **非常实验性的** 包。使用此包可能不稳定，但您可以成为一小部分将有助于使此包可行和稳定的用户。要开始使用，您可以使用以下命令安装 Sisk.SslProxy 包：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> 您必须在 Visual Studio 包管理器中启用“启用预发布包”才能安装 Sisk.SslProxy。

再次强调，这是一个实验项目，因此请不要考虑将其投入生产环境。

目前，Sisk.SslProxy 可以处理大多数 HTTP/1.1 功能，包括 HTTP Continue、分块编码、WebSockets 和 SSE。有关 SslProxy 的更多信息，请参阅 [此处](/docs/extensions/ssl-proxy)。



