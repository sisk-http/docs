# 日志记录

您可以配置 Sisk 自动写入访问和错误日志。它也可以定义日志轮换、扩展和频率。

[LogStream](/api/Sisk.Core.Http.LogStream) 类提供了一种异步写入日志和保持可等待写入队列的方式。

在本文中，我们将向您展示如何为您的应用程序配置日志记录。

## 基于文件的访问日志

日志写入文件时，会打开文件，写入行文本，然后为每行写入关闭文件。这种过程是为了保持日志的写入响应性。

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
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

上面的代码将写入所有传入的请求到 `logs/access.log` 文件。注意，如果文件不存在，它将自动创建，但是文件夹不会自动创建。您不需要创建 `logs/` 目录，因为 `LogStream` 类会自动创建它。

## 基于流的日志记录

您可以将日志文件写入 `TextWriter` 对象实例，例如 `Console.Out`，通过在构造函数中传递 `TextWriter` 对象：

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream("logs/access.log");
    })
    .Build();
```

对于流式日志记录中的每个消息，`TextWriter.Flush()` 方法都会被调用。

## 访问日志格式

您可以通过预定义变量自定义访问日志格式。考虑以下行：

```csharp
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

它将写入一条消息，如下所示：

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

您可以通过表格中描述的格式格式化日志文件：

| 值  | 代表什么                                                                 | 示例                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | 月份中的某一天（以两位数字格式化）                                        | 05                                    |
| %dmmm  | 月份的全名                                                            | July                                  |
| %dmm   | 月份的缩写（三个字母）                                  | Jul                                  |
| %dm    | 月份号（以两位数字格式化）                                          | 07                                    |
| %dy    | 年份（以四位数字格式化）                                                 | 2023                                 |
| %th    | 12 小时格式的小时                                                          | 03                                    |
| %tH    | 24 小时格式的小时（HH）                                                    | 15                                    |
| %ti    | 分钟（以两位数字格式化）                                               | 30                                    |
| %ts    | 秒（以两位数字格式化）                                               | 45                                    |
| %tm    | 毫秒（以三位数字格式化）                                        | 123                                   |
| %tz    | 时区偏移（以 UTC 为单位的总小时）                                         | +03:00                               |
| %ri    | 客户端的远程 IP 地址                                                       | 192.168.1.100                        |
| %rm    | HTTP 方法（大写）                                                          | GET                                   |
| %rs    | URI 方案（http/https）                                                          | https                                |
| %ra    | URI 权威（域）                                                           | example.com                          |
| %rh    | 请求的主机                                                             | www.example.com                       |
| %rp    | 请求的端口                                                             | 443                                  |
| %rz    | 请求的路径                                                             | /path/to/resource                    |
| %rq    | 查询字符串                                                                    | ?key=value&another=123               |
| %sc    | HTTP 响应状态代码                                                      | 200                                  |
| %sd    | HTTP 响应状态描述                                              | OK                                   |
| %lin   | 请求的可读大小                                                          | 1.2 KB                               |
| %linr  | 请求的原始大小（字节）                                                | 1234                                |
| %lou   | 响应的可读大小                                                          | 2.5 KB                               |
| %lour  | 响应的原始大小（字节）                                               | 2560                                |
| %lms   | 耗时的毫秒数                                                   | 120                                  |
| %ls    | 执行状态                                                                | Executed                |

## 日志轮换

> [!TIP]
> 在 Sisk 0.15 及更早版本中，此功能仅在 Sisk.ServiceProvider 包中可用。在 Sisk 0.16 及更高版本中，此功能已在核心包中实现。

您可以配置 HTTP 服务器，当日志文件达到一定大小时，将其轮换到压缩的 .gz 文件。大小是由您定义的阈值周期性检查的。

```csharp
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

上面的代码将每 6 小时检查一次 LogStream 的文件是否达到 1MB 限制。如果达到限制，文件将被压缩到 .gz 文件，然后 `access.log` 将被清空。

在此过程中，写入文件将被锁定，直到文件被压缩和清空。在此期间，所有要写入的行将在队列中等待压缩完成。

此功能仅适用于基于文件的 LogStreams。

## 错误日志记录

当服务器不将错误抛给调试器时，它会将错误转发到日志写入器。您可以使用以下代码配置错误写入：

```csharp
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

此属性仅在错误未被回调或 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) 属性捕获时写入日志。

服务器写入的错误始终包含日期和时间、请求头（不包括正文）、错误跟踪和内部异常跟踪（如果有）。

## 其他日志实例

您的应用程序可以有零个或多个 LogStreams，没有限制。因此，您可以将应用程序的日志定向到其他文件，而不是默认的 AccessLog 或 ErrorLog。

```csharp
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("应用程序在 {0} 启动", DateTime.Now);
```

## 扩展 LogStream

您可以扩展 `LogStream` 类以写入自定义格式，兼容当前的 Sisk 日志引擎。以下示例允许通过 Spectre.Console 库将彩色消息写入控制台：

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

另一种自动为每个请求/响应写入自定义日志的方法是创建 [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler)。以下示例更为完整。它将请求和响应的正文以 JSON 格式写入控制台。它可以用于调试请求。这个示例使用了 ContextBag 和 HttpServerHandler。

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

```csharp
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // 在此时，连接已经打开，客户端已经发送了指定内容为 JSON 的头。
            // 下一行读取内容并将其存储在请求中。
            //
            // 如果在请求操作中不读取内容，GC 可能会在发送响应给客户端后收集内容，因此内容可能在响应关闭后不可用。
            //
            _ = request.RawBody;

            // 在上下文中添加提示，指示此请求具有 JSON 正文
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