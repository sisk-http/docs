Sisk SSL代理是一个模块，为Sisk中的[ListeningHost](/api/Sisk.Core.Http.ListeningHost)提供HTTPS连接，并将HTTPS消息路由到不安全的HTTP上下文。该模块旨在为使用[HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0)运行的服务提供SSL连接，而HttpListener不支持SSL。

代理在同一应用程序中运行，侦听HTTP/1.1消息，并将它们以相同协议转发到Sisk。目前，此功能处于高度实验阶段，可能不够稳定以在生产环境中使用。

目前，SslProxy支持几乎所有HTTP/1.1功能，例如保持活动连接、分块编码、WebSockets等。对于到SSL代理的开放连接，将创建一个TCP连接到目标服务器，并将代理转发到已建立的连接。

SslProxy可以用HttpServer.CreateBuilder使用，如下所示：

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // 添加SSL到项目
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

您必须为代理提供有效的SSL证书。为了确保浏览器接受证书，请务必将其导入操作系统，以便其正常工作。 


