# Cadente

Cadente is an experimental managed HTTP/1.1 listener implementation for Sisk. It serves as a replacement for the default `System.Net.HttpListener`, offering greater control and flexibility, especially on non-Windows platforms.

## Overview

By default, Sisk uses `HttpListener` (from `System.Net`) as its underlying HTTP server engine. While `HttpListener` is stable and performant on Windows (where it uses the kernel-mode HTTP.sys driver), its implementation on Linux and macOS is managed and historically has had limitations, such as lack of native SSL support (requiring a reverse proxy like Nginx or Sisk.SslProxy) and varying performance characteristics.

Cadente aims to solve these issues by providing a fully managed HTTP/1.1 server written in C#. Its key goals are:

- **Native SSL Support:** Works on all platforms without needing external proxies or complex configuration.
- **Cross-Platform Consistency:** Identical behavior on Windows, Linux, and macOS.
- **Performance:** Designed to be a high-performance alternative to the managed `HttpListener`.
- **Independence:** Decoupled from `System.Net.HttpListener`, insulating Sisk from potential future deprecations or lack of maintenance of that component in .NET.

> [!WARNING]
> **Experimental Status**
> 
> Cadente is currently in an experimental stage (Beta). It is not yet recommended for critical production environments. The API and behavior may change.

## Installation

Cadente is available as a separate package. To use it with Sisk, you need the `Sisk.Cadente.CoreEngine` package.

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Using with Sisk

To use Cadente as the HTTP engine for your Sisk application, you need to configure the `HttpServer` to use `CadenteHttpServerEngine` instead of the default engine.

The `CadenteHttpServerEngine` adapts the Cadente `HttpHost` to the `HttpServerEngine` abstraction required by Sisk.

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### Advanced Configuration

You can customize the underlying `HttpHost` instance by passing a setup action to the `CadenteHttpServerEngine` constructor. This is useful for configuring timeouts or other low-level settings.

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // Configure client read/write timeouts
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## Standalone Usage

Although primarily designed for Sisk, Cadente can be used as a standalone HTTP server (similar to `HttpListener`).

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