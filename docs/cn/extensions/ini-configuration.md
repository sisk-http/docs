# INI 配置提供程序

Sisk 有一种方法可以获取启动配置，而不仅仅是 JSON。事实上，任何实现 [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) 的管道都可以与 [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder)一起使用，从任何文件类型中读取服务器配置。

[Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) 包提供了一个基于流的 INI 文件读取器，它不会为常见的语法错误抛出异常，并且具有简单的配置语法。这个包可以在 Sisk 框架之外使用，为需要高效 INI 文档读取器的项目提供了灵活性。

## 安装

要安装包，可以从以下开始：

```bash
$ dotnet add package Sisk.IniConfiguration
```

并在代码中使用，如下面的示例所示：

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

                // 添加 IniConfigurationPipeline 到配置读取器
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

上面的代码将在进程的当前目录（CurrentDirectory）中查找一个 app.ini 文件。INI 文件的内容如下：

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

## INI 风格和语法

当前实现风格：

- 属性和节名是 **大小写不敏感** 的。
- 属性名和值是 **修剪** 的。
- 值可以用单引号或双引号引起来。引号内可以有换行符。
- 支持使用 `#` 和 `;` 的注释。**尾部注释也是允许的**。
- 属性可以有多个值。

详细的 INI 解析器语法文档可以在 [GitHub](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md) 上找到。

使用以下 INI 代码作为示例：

```ini
One = 1
Value = 这是一个值
Another value = "这个值
    有一个换行符"
; 下面的代码有一些颜色
[some section]
Color = Red
Color = Blue
Color = Yellow ; 不要使用黄色
```

可以使用以下代码解析：

```csharp
// 从字符串解析 INI 文本
IniDocument doc = IniDocument.FromString(iniText);

// 获取一个值
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// 获取多个值
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## 配置参数

| 节和名称 | 允许多个值 | 描述 |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | 是 | 服务器监听地址/端口。 |
| `Server.Encoding` | 否 | 服务器默认编码。 |
| `Server.MaximumContentLength` | 否 | 服务器最大内容长度（以字节为单位）。 |
| `Server.IncludeRequestIdHeader` | 否 | 指定是否应发送 X-Request-Id 标头。 |
| `Server.ThrowExceptions` | 否 | 指定是否应抛出未处理的异常。 |
| `Server.AccessLogsStream` | 否 | 指定访问日志输出流。 |
| `Server.ErrorsLogsStream` | 否 | 指定错误日志输出流。 |
| `Cors.AllowMethods` | 否 | 指定 CORS Allow-Methods 标头值。 |
| `Cors.AllowHeaders` | 否 | 指定 CORS Allow-Headers 标头值。 |
| `Cors.AllowOrigins` | 否 | 指定多个 Allow-Origin 标头，逗号分隔。[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) 有更多信息。 |
| `Cors.AllowOrigin` | 否 | 指定一个 Allow-Origin 标头。 |
| `Cors.ExposeHeaders` | 否 | 指定 CORS Expose-Headers 标头值。 |
| `Cors.AllowCredentials` | 否 | 指定 CORS Allow-Credentials 标头值。 |
| `Cors.MaxAge` | 否 | 指定 CORS Max-Age 标头值。 |