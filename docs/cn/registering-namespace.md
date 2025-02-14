# 在 Windows 上配置命名空间预留

Sisk 与 HttpListener 网络接口一起工作，将虚拟主机绑定到系统以侦听请求。

在 Windows 上，此绑定有一些限制，只允许将 localhost 绑定为有效主机。当尝试侦听另一个主机时，服务器会抛出访问被拒绝错误。此教程解释了如何授予在系统上侦听任何主机的授权。

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
@echo off

:: 在这里插入前缀，不要包含空格或引号
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

在 `PREFIX` 中，是服务器将要侦听的前缀（“侦听主机->端口”）。它必须以 URL 方案、主机、端口和末尾斜杠的格式编写，例如：

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://my-application.example.test/
```

这样，您就可以通过以下方式在应用程序中侦听：

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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