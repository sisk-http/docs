# 日志

Source: https://docs.sisk-framework.org/zh-cn/docs/features/logging.html

您可以配置 Sisk 自动写入访问日志和错误日志。可以定义日志轮转、扩展名和频率。

[LogStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.LogStream.md) 类提供了一种异步写入日志并将其保存在可等待写入队列中的方式。`LogStream` 类实现了 `IAsyncDisposable`，确保在流关闭之前写入所有未完成的日志。

本文将向您展示如何为应用程序配置日志记录。

## 基于文件的访问日志

将日志写入文件时，会打开文件、写入行文本，然后在每行写入后关闭文件。采用此过程是为了保持日志写入的响应性。

```cs {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

上述代码会将所有传入请求写入 `logs/access.log` 文件。请注意，如果文件不存在会自动创建，但其所在的文件夹不会自动创建。无需手动创建 `logs/` 目录，因为 LogStream 类会自动创建它。

## 基于流的日志记录

您可以通过在构造函数中传入 `TextWriter` 对象，将日志写入 `TextWriter` 实例，例如 `Console.Out`：

```cs {title="Program.cs"}
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

对于基于流的日志写入的每条消息，都会调用 `TextWriter.Flush()` 方法。

## 访问日志格式化

您可以通过预定义变量自定义访问日志格式。考虑下面这行代码：

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

它会写出类似如下的消息：

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

您可以按照下表所述的格式来定义日志文件：

| 值                | 表示含义                                             | 示例                                 |
|-------------------|------------------------------------------------------|--------------------------------------|
| %dd               | 月份的日期（两位数字）                               | 05                                   |
| %dmmm             | 月份的全称                                           | July                                 |
| %dmm              | 月份的缩写（三个字母）                               | Jul                                  |
| %dm               | 月份数字（两位数字）                                 | 07                                   |
| %dy               | 年份（四位数字）                                     | 2023                                 |
| %th               | 12 小时制的小时                                      | 03                                   |
| %tH               | 24 小时制的小时（HH）                                | 15                                   |
| %ti               | 分钟（两位数字）                                     | 30                                   |
| %ts               | 秒（两位数字）                                       | 45                                   |
| %tm               | 毫秒（三位数字）                                     | 123                                  |
| %tz               | 时区偏移（UTC 总小时）                               | +03:00                               |
| %ri               | 客户端的远程 IP 地址                                 | 192.168.1.100                        |
| %rm               | HTTP 方法（大写）                                    | GET                                  |
| %rs               | URI 方案（http/https）                               | https                                |
| %ra               | URI 权威（域名）                                     | example.com                          |
| %rh               | 请求的主机                                           | www.example.com                     |
| %rp               | 请求的端口                                           | 443                                  |
| %rz               | 请求的路径                                           | /path/to/resource                    |
| %rq               | 查询字符串                                           | ?key=value&another=123               |
| %sc               | HTTP 响应状态码                                      | 200                                  |
| %sd               | HTTP 响应状态描述                                    | OK                                   |
| %lin              | 请求的可读大小                                       | 1.2 KB                               |
| %linr             | 请求的原始大小（字节）                               | 1234                                 |
| %lou              | 响应的可读大小                                       | 2.5 KB                               |
| %lour             | 响应的原始大小（字节）                               | 2560                                 |
| %lms              | 以毫秒为单位的耗时                                   | 120                                  |
| %ls               | 执行状态                                             | Executed                             |
| %{header-name}   | 表示请求的 `header-name` 头部。                      | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name}  | 表示响应的 `header-name` 头部。                      | `application/json`                  |

您也可以使用 `HttpServerConfiguration.DefaultAccessLogFormat` 来使用默认的访问日志格式。

## 轮转日志

您可以配置 HTTP 服务器在日志文件达到一定大小时将其轮转为压缩的 .gz 文件。大小会按照您定义的阈值定期检查。

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

上述代码会每六小时检查一次 LogStream 的文件是否已达到 64 MB 限制。如果已达到，则会将文件压缩为 .gz 文件，并随后清理 `access.log`。

在此过程中，文件写入会被锁定，直至文件压缩并清理完成。此期间产生的所有写入行都会进入队列，等待压缩结束后再写入。

此功能仅适用于基于文件的 LogStream。

## 错误日志记录

当服务器不将错误抛给调试器时，会在有错误时将其转发到日志写入。您可以通过以下方式配置错误写入：

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

只有当错误未被回调或 [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md) 属性捕获时，此属性才会向日志写入内容。

服务器写入的错误日志始终包含日期时间、请求头（不包括正文）、错误堆栈以及内部异常堆栈（如果有的话）。

## 其他日志实例

您的应用程序可以拥有零个或多个 LogStream，日志通道数量没有限制。因此，您可以将应用程序的日志定向到除默认 AccessLog 或 ErrorLog 之外的其他文件。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## 扩展 LogStream

您可以扩展 `LogStream` 类以写入自定义格式，兼容当前的 Sisk 日志引擎。下面的示例演示如何通过 Spectre.Console 库将彩色消息写入控制台：

```cs {title="CustomLogStream.cs"}
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

另一种为每个请求/响应自动写入自定义日志的方式是创建一个 [HttpServerHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md)。下面的示例更为完整。它将请求和响应的主体以 JSON 形式写入控制台，可用于一般的请求调试。此示例使用了 ContextBag 和 HttpServerHandler。

```cs {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

```cs {title="JsonMessageHandler.cs"}
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // 此时连接已打开，客户端已发送声明内容为 JSON 的头部。下面的代码读取内容并将其保存在请求中。
            //
            // 如果在请求处理阶段未读取内容，GC 可能会在向客户端发送响应后回收该内容，导致响应关闭后内容不可用。
            //
            _ = request.RawBody;

            // 在上下文中添加提示，标记此请求包含 JSON 正文
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // 使用 CypherPotato.LightJson 库重新格式化 JSON
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // 检查响应是否为 JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // 获取内部服务器处理状态
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```
