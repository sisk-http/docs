Sisk 使用 HttpListener 网络接口，将虚拟主机绑定到系统以侦听请求。

在 Windows 上，此绑定有点限制，只允许 localhost 绑定为有效主机。尝试侦听其他主机时，服务器会抛出拒绝访问错误。本教程解释了如何授予对系统上任何主机侦听的授权。

```bat
@echo off

:: 在此处插入前缀，不带空格或引号
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

其中 `PREFIX` 是服务器将侦听的前缀 ("侦听主机->端口")。它必须使用 URL 方案、主机、端口和结尾的斜杠格式化，例如：

```bat
SET PREFIX=http://my-application.example.test/
```

这样您就可以通过以下方式在应用程序中侦听：

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