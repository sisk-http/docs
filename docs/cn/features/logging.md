您可以配置 Sisk 自动写入访问日志和错误日志。可以定义日志轮转、扩展和频率。

[LogStream](/api/Sisk.Core.Http.LogStream) 类提供了一种异步写入日志并将其保留在可等待的写入队列中的方法。

在本文中，我们将向您展示如何配置应用程序的日志记录。

## 基于文件的访问日志

将日志写入文件会打开文件、写入行文本，然后关闭文件以写入每一行。采用此过程是为了在日志中保持写入响应性。

```cs
config.AccessLogsStream = new LogStream("logs/access.log");
```

上述代码将所有传入请求写入 `logs/access.log` 文件。请注意，如果文件不存在，则会自动创建该文件，但其父文件夹则不会。无需创建 `logs/` 目录，因为 LogStream 类会自动创建它。

## 基于流的日志记录

您可以通过在构造函数中传递 TextWriter 对象实例（例如 `Console.Out`）将日志文件写入 TextWriter 对象实例。

```cs
config.AccessLogsStream = new LogStream(Console.Out);
```

对于流式日志中写入的每个消息，都会调用 `TextWriter.Flush()` 方法。

## 访问日志格式

您可以通过预定义变量自定义访问日志格式。请考虑以下行：

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

它将写入类似于以下消息：

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ \[200 OK\] 689B -> 707B in 84ms \[Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36\]

您可以通过表格中描述的格式来格式化您的日志文件：

|Variable|Description|Example|
|---|---|---|
|%dd|当前时间戳的日，以 00 格式。|25|
|%dm|当前时间戳的月，以 00 格式。|03|
|%dmm|当前时间戳的月，以缩写形式。|mar.|
|%dmmm|当前时间戳的月，以完整名称形式。|三月|
|%dy|当前时间戳的年，以 0000 格式。|2023|
|%th|当前时间戳的小时，以 12 小时格式。|03|
|%tH|当前时间戳的小时，以 24 小时格式。|15|
|%ti|当前时间戳的分钟，以 00 格式。|25|
|%ts|当前时间戳的秒，以 00 格式。|32|
|%tm|当前时间戳的毫秒，以 000 格式。|633|
|%tz|当前时区差，以 +/- 0000 格式。|+0300, -0500, +0000|
|%ri|请求用户的 IP 地址（可能是 IPv4 或 IPv6）。|192.168.0.1|
|%rm|请求方法（大写）。|GET|
|%rs|请求用户的 URL 方案。|https, http|
|%ra|请求用户的 URL 权威。|my.contorso.com:8080|
|%rh|请求用户的 URL 主机。|my.contorso.com|
|%rp|请求用户的 URL 端口。|8080|
|%rz|请求用户的 URL 绝对路径。|/index.html|
|%rq|请求用户的 URL 查询字符串。?foo=bar&aaa=bbb|
|%sc|响应状态码，以 000 格式。|404|
|%sd|响应状态描述。|未找到|
|%lin|传入请求内容大小，以人类可读形式。|12,5kb|
|%lou|输出响应内容大小，以人类可读形式。|65,8kb|
|%lms|服务器处理请求和传递响应的时间，以毫秒格式（000）。|18|
|%{header}|获取 HTTP 标头的值，其中 header 是标头名称，如果标头不存在，则为空值。此字段不区分大小写。|%{user-agent}|


## 旋转日志

> [!TIP]
> 在 Sisk 0.15 及更早版本中，此功能仅在 Sisk.ServiceProvider 包中可用。在 Sisk 0.16 及更高版本中，此功能已在核心包中实现。

您可以配置 HTTP 服务器在日志文件达到特定大小时将其旋转到压缩的 .gz 文件。大小由您定义的 limiar 定期检查。

```cs
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

上述代码每六小时检查一次 LogStream 文件是否已达到 1 MB 的限制。如果达到，则压缩文件到 .gz 文件，然后清理 `access.log`。

在此过程中，写入文件将被锁定，直到文件被压缩和清理为止。所有进入写入的行的队列将等待压缩结束。

此功能仅适用于基于文件的 LogStream。

## 错误日志记录

当服务器未将错误转发到调试器时，它会将错误转发到日志记录。您可以使用以下内容配置错误写入：

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

此属性仅在错误未被回调或 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) 属性捕获时写入日志。

服务器写入的错误始终会写入日期和时间、请求标头（不包括正文）、错误跟踪和任何内部异常跟踪。

## 其他日志实例

您的应用程序可以具有零个或多个 LogStream，它可以具有任意数量的日志通道。因此，可以将应用程序的日志定向到与默认 AccessLog 或 ErrorLog 不同的文件。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## 扩展 LogStream

您可以扩展 `LogStream` 类以写入自定义格式，与当前 Sisk 日志引擎兼容。以下示例允许将彩色消息写入使用 Spectre.Console 库的控制台。

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

另一种自动为每个请求/响应写入自定义日志的方法是创建 [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler)。以下示例更加完整。它将请求和响应的正文以 JSON 格式写入控制台。这对于调试请求非常有用。此示例使用 ContextBag 和 HttpServerHandler。

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

        if (requestJson is not null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null
                outputMessage.AppendLine(requestJson);
        }
        outputMessage.AppendLine("<<< {responseMessage}");
        if (responseJson is not null
            outputMessage.AppendLine(responseJson);
        outputMessage.AppendLine("-----");
        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```










































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































