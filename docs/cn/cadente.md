# Cadente

Cadente 是 Sisk 的一个实验性的托管 HTTP/1.1 监听器实现。它作为默认的 `System.Net.HttpListener` 的替代品，提供了更大的控制和灵活性，尤其是在非 Windows 平台上。

## 概述

默认情况下，Sisk 使用 `HttpListener` (来自 `System.Net`) 作为其底层 HTTP 服务器引擎。虽然 `HttpListener` 在 Windows 上是稳定和高性能的（因为它使用内核模式的 HTTP.sys 驱动程序），但其在 Linux 和 macOS 上的实现是托管的，并且历史上存在一些限制，例如缺乏本地 SSL 支持（需要反向代理，如 Nginx 或 Sisk.SslProxy）和不同的性能特征。

Cadente 的目标是通过提供一个完全托管的 HTTP/1.1 服务器（用 C# 编写）来解决这些问题。其主要目标是：

- **本地 SSL 支持：** 在所有平台上无需外部代理或复杂配置即可工作。
- **跨平台一致性：** 在 Windows、Linux 和 macOS 上具有相同的行为。
- **性能：** 设计为高性能的替代品，以替代托管的 `HttpListener`。
- **独立性：** 与 `System.Net.HttpListener` 解耦，隔离 Sisk 免受该组件在 .NET 中可能的未来弃用或缺乏维护的影响。

> [!WARNING]
> **实验状态**
> 
> Cadente 目前处于实验阶段（Beta）。不建议在关键的生产环境中使用。API 和行为可能会改变。

## 安装

Cadente 作为一个单独的包提供。要将其用于 Sisk，您需要 `Sisk.Cadente.CoreEngine` 包。

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## 使用 Sisk

要将 Cadente 用作 Sisk 应用程序的 HTTP 引擎，您需要配置 `HttpServer` 以使用 `CadenteHttpServerEngine` 代替默认引擎。

`CadenteHttpServerEngine` 将 Cadente 的 `HttpHost` 适配到 Sisk 所需的 `HttpServerEngine` 抽象。

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### 高级配置

您可以通过将设置操作传递给 `CadenteHttpServerEngine` 构造函数来自定义底层的 `HttpHost` 实例。这对于配置超时或其他低级设置很有用。

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // 配置客户端读/写超时
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## 独立使用

虽然 Cadente 主要设计用于 Sisk，但也可以将其用作独立的 HTTP 服务器（类似于 `HttpListener`）。

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Hello, world!");
    }
}
```