# SSL 代理

> [!WARNING]
> 此功能是实验性的，不应在生产环境中使用。如果您想让 Sisk 与 SSL 协作，请参阅 [此文档](/docs/cn/deploying.html#proxying-your-application)。

Sisk SSL 代理是一个模块，提供了 Sisk 中 [ListeningHost](/api/Sisk.Core.Http.ListeningHost) 的 HTTPS 连接，并将 HTTPS 消息路由到不安全的 HTTP 上下文。该模块是为使用 [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) 运行的服务提供 SSL 连接而构建的，因为它不支持 SSL。

代理在同一应用程序中运行，并侦听 HTTP/1.1 消息，将其以相同的协议转发给 Sisk。目前，此功能是高度实验性的，可能不稳定到不能在生产环境中使用。

目前，SslProxy 支持几乎所有 HTTP/1.1 功能，例如 keep-alive、分块编码、WebSockets 等。对于打开到 SSL 代理的连接，会创建一个到目标服务器的 TCP 连接，并将代理转发到已建立的连接。

SslProxy 可以与 HttpServer.CreateBuilder 一起使用，如下所示：

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // 添加 SSL 到项目
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

您必须为代理提供有效的 SSL 证书。为了确保证书被浏览器接受，请记得将其导入到操作系统中，以便正确功能。