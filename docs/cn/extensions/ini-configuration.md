# INI 配置提供程序

Sisk 提供了一种除了 JSON 之外的获取启动配置的方法。实际上，任何实现 [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) 的管道都可以与 [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder) 一起使用，从任何文件类型读取服务器配置。

[Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) 包提供了一个基于流的 INI 文件读取器，它不会为常见的语法错误抛出异常，并且具有简单的配置语法。该包可以在 Sisk 框架之外使用，为需要高效 INI 文档读取器的项目提供灵活性。

## 安装

要安装该包，您可以从以下开始：

```bash
$ dotnet add package Sisk.IniConfiguration
```

并在您的代码中使用它，如下例所示：

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);

                // 向配置读取器添加 IniConfigurationPipeline
                config.WithConfigurationPipeline<IniConfigurationPipeline>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();

        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

上面的代码将查找进程当前目录（CurrentDirectory）中的 app.ini 文件。INI 文件如下所示：

```ini
[Server]
# 支持多个监听地址
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## INI 语言和语法

当前实现的语言版本：

- 属性和部分名称不区分大小写。
- 属性名称和值会被修剪。
- 值可以用单引号或双引号引起来。引号内部可以有换行符。
- 使用 `#` 和 `;` 支持注释。也允许**尾随注释**。
- 属性可以有多个值。

有关 Sisk 中使用的 INI 解析器“语言”的详细文档，请参阅 [GitHub 上的文档](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md)。

使用以下 ini 代码作为示例：

```ini
One = 1
Value = this is an value
Another value = "this value
    has an line break on it"

; the code below has some colors
[some section]
Color = Red
Color = Blue
Color = Yellow ; do not use yellow
```

使用以下代码解析它：

```csharp
// 从字符串解析 ini 文本
IniDocument doc = IniDocument.FromString(iniText);

// 获取一个值
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// 获取多个值
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## 配置参数

| 部分和名称 | 是否允许多个值 | 描述 |
| ------------- | --------------------- | ----------- |
| `Server.Listen` | 是 | 服务器监听地址/端口。 |
| `Server.Encoding` | 否 | 服务器默认编码。 |
| `Server.MaximumContentLength` | 否 | 服务器最大内容长度（以字节为单位）。 |
| `Server.IncludeRequestIdHeader` | 否 | 指定 HTTP 服务器是否应发送 X-Request-Id 标头。 |
| `Server.ThrowExceptions` | 否 | 指定是否应抛出未处理的异常。 |
| `Server.AccessLogsStream` | 否 | 指定访问日志输出流。 |
| `Server.ErrorsLogsStream` | 否 | 指定错误日志输出流。 |
| `Cors.AllowMethods` | 否 | 指定 CORS Allow-Methods 标头值。 |
| `Cors.AllowHeaders` | 否 | 指定 CORS Allow-Headers 标头值。 |
| `Cors.AllowOrigins` | 否 | 指定多个 Allow-Origin 标头，用逗号分隔。有关 [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) 的更多信息。 |
| `Cors.AllowOrigin` | 否 | 指定一个 Allow-Origin 标头。 |
| `Cors.ExposeHeaders` | 否 | 指定 CORS Expose-Headers 标头值。 |
| `Cors.AllowCredentials` | 否 | 指定 CORS Allow-Credentials 标头值。 |
| `Cors.MaxAge` | 否 | 指定 CORS Max-Age 标头值。 |
