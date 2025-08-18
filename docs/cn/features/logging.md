# 日志

你可以配置 Sisk 自动写入访问日志和错误日志。可以定义日志轮转、扩展和频率。

[LogStream](/api/Sisk.Core.Http.LogStream) 类提供了一种异步写日志并保持在可等待写队列中的方式。

本文将向你展示如何为你的应用程序配置日志记录。

## 基于文件的访问日志

日志写入文件时会打开文件，写入行文本，然后在每行写完后关闭文件。此过程是为了保持日志写入的响应性。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        …
        
        await app.StartAsync();
    }
}
```

上述代码会将所有传入请求写入 `logs/access.log` 文件。请注意，如果文件不存在会自动创建，但其前置文件夹不会。无需手动创建 `logs/` 目录，因为 LogStream 类会自动创建它。

## 基于流的日志记录

你可以将日志文件写入 TextWriter 对象实例，例如 `Console.Out`，通过在构造函数中传入 TextWriter 对象：

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

对于基于流的日志中的每条消息，都会调用 `TextWriter.Flush()` 方法。

## 访问日志格式化

你可以通过预定义变量自定义访问日志格式。考虑以下行：

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

它将写出类似以下的消息：

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

你可以按下表描述的格式来格式化日志文件：

| Value  | 代表含义                                                                 | 示例                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | 月份中的日期（两位数字）                                                        | 05                                    |
| %dmmm  | 月份全名                                                                         | July                                  |
| %dmm   | 月份缩写（三个字母）                                                               | Jul                                  |
| %dm    | 月份编号（两位数字）                                                               | 07                                    |
| %dy    | 年份（四位数字）                                                                   | 2023                                 |
| %th    | 12 小时制小时数                                                                    | 03                                    |
| %tH    | 24 小时制小时数（HH）                                                               | 15                                    |
| %ti    | 分钟（两位数字）                                                                    | 30                                    |
| %ts    | 秒（两位数字）                                                                    | 45                                    |
| %tm    | 毫秒（三位数字）                                                                    | 123                                   |
| %tz    | 时区偏移（UTC 总小时数）                                                             | +03:00                               |
| %ri    | 客户端远程 IP 地址                                                               | 192.168.1.100                        |
| %rm    | HTTP 方法（大写）                                                                   | GET                                   |
| %rs    | URI 方案（http/https）                                                             | https                                |
| %ra    | URI 权威（域名）                                                                    | example.com                          |
| %rh    | 请求主机                                                                          | www.example.com                       |
| %rp    | 请求端口                                                                          | 443                                  |
| %rz    | 请求路径                                                                          | /path/to/resource                    |
| %rq    | 查询字符串                                                                          | ?key=value&another=123               |
| %sc    | HTTP 响应状态码                                                                    | 200                                  |
| %sd    | HTTP 响应状态描述                                                                    | OK                                   |
| %lin   | 请求的可读大小                                                                    | 1.2 KB                               |
| %linr  | 请求的原始大小（字节）                                                               | 1234                                |
| %lou   | 响应的可读大小                                                                    | 2.5 KB                               |
| %lour  | 响应的原始大小（字节）                                                               | 2560                                |
| %lms   | 毫秒级 elapsed 时间                                                              | 120                                  |
| %ls    | 执行状态                                                                          | Executed                |
| %{header-name}    | 表示请求的 `header-name` 头部。                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:res-name}    | 表示响应的 `res-name` 头部。 | |

## 轮转日志

你可以配置 HTTP 服务器在日志文件达到一定大小时将其轮转为压缩的 .gz 文件。大小会按你定义的阈值定期检查。

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

上述代码会每六小时检查一次 LogStream 的文件是否已达到 64MB 限制。如果是，文件将被压缩为 .gz 文件，然后 `access.log` 被清理。

在此过程中，写入文件会被锁定，直到文件被压缩并清理完毕。此期间所有待写入的行将排队等待压缩结束。

此功能仅适用于基于文件的 LogStreams。

## 错误日志

当服务器没有将错误抛给调试器时，它会在有错误时将错误转发到日志写入。你可以通过以下方式配置错误写入：

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

此属性仅在错误未被回调或 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) 捕获时才会写入日志。

服务器写入的错误始终包含日期时间、请求头（不包括正文）、错误跟踪以及内部异常跟踪（如果有）。

## 其他日志实例

你的应用程序可以拥有零个或多个 LogStreams，没有限制可以拥有多少日志通道。因此，可以将应用程序的日志定向到除默认 AccessLog 或 ErrorLog 之外的文件。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## 扩展 LogStream

你可以扩展 `LogStream` 类以编写自定义格式，兼容当前的 Sisk 日志引擎。下面的示例允许通过 Spectre.Console 库将彩色消息写入 Console：

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

另一种自动为每个请求/响应写入自定义日志的方法是创建一个 [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler)。下面的示例更完整。它将请求和响应正文以 JSON 写入 Console。对于调试请求非常有用。此示例使用 ContextBag 和 HttpServerHandler。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router += new Route(RouteMethod.Any, "/json", request =>
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

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // At this point, the connection is open and the client has sent the header specifying
            // that the content is JSON.The line below reads the content and leaves it stored in the request.
            //
            // If the content is not read in the request action, the GC is likely to collect the content
            // after sending the response to the client, so the content may not be available after the response is closed.
            //
            _ = request.RawBody;

            // add hint in the context to tell that this request has an json body on it
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
            // reformats the JSON using the CypherPotato.LightJson library
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // check if the response is JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // gets the internal server handling status
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
