---
title: "在 Windows 上配置命名空间保留"
linkTitle: "Windows 设置"
weight: 70
aliases:
  - "/docs/cn/registering-namespace.html"
sourceHash: "c0adab5c6258ef68"
---

> [!NOTE]
> 此配置是可选的，仅在您希望 Sisk 在 Windows 上使用 HttpListener 引擎监听除 “localhost” 之外的主机时才需要。

Sisk 使用 HttpListener 网络接口，该接口将虚拟主机绑定到系统以监听请求。

在 Windows 上，此绑定有些限制，只允许将 localhost 绑定为有效主机。当尝试监听其他主机时，服务器会抛出访问被拒绝错误。本教程说明如何授予授权，以便在系统上监听任意您想要的主机。

```bat {title="Namespace Setup.bat"}
@echo off

:: 在此插入前缀，不带空格或引号
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

在 `PREFIX` 中，填写服务器将监听的前缀（“监听主机->端口”）。它必须使用 URL 方案、主机、端口，并在末尾加上斜杠，例如：

```bat {title="Namespace Setup.bat"}
SET PREFIX=http://my-application.example.test/
```

这样您就可以在应用程序中通过以下方式进行监听：

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://my-application.example.test/")
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
