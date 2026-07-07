# 请求

请求是表示 HTTP 请求消息的结构体。[HttpRequest](/api/Sisk.Core.Http.HttpRequest) 对象包含了在整个应用程序中处理 HTTP 消息的实用函数。

一个 HTTP 请求由方法、路径、版本、头部和正文组成。

在本文档中，我们将教您如何获取这些元素。

## 获取请求方法

要获取收到的请求的方法，可以使用 Method 属性：

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

此属性返回由 [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) 对象表示的请求方法。

> [!NOTE]
> 与路由方法不同，此属性不提供 [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) 项。相反，它返回真实的请求方法。

## 获取请求 URL 组件

您可以通过请求的某些属性获取 URL 的各种组件。以下示例使用的 URL 为：

```
http://localhost:5000/user/login?email=foo@bar.com
```

| 组件名称 | 描述 | 组件值 |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | 获取请求路径。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | 获取请求路径和查询字符串。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | 获取完整的 URL 请求字符串。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | 获取请求主机。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | 获取请求主机和端口。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | 获取请求查询字符串。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 以命名值集合的形式获取请求查询。 | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | 判断请求是否使用 SSL（true）或未使用（false）。 | `false` |

您也可以使用 [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) 属性，它将上述所有信息合并在一个对象中。

## 请求元数据和取消

Sisk 还会为每个请求附加操作元数据。这些属性对日志、追踪、本地化、诊断以及长时间运行的操作非常有用：

| 属性或方法 | 用途 |
| --- | --- |
| [RequestId](/api/Sisk.Core.Http.HttpRequest.RequestId) | 请求的唯一标识符。启用 [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader) 可将其作为 `X-Request-Id` 返回。 |
| [RequestedAt](/api/Sisk.Core.Http.HttpRequest.RequestedAt) | Sisk 创建请求对象的时间点。 |
| [RemoteAddress](/api/Sisk.Core.Http.HttpRequest.RemoteAddress) | 从连接解析得到的客户端地址，或来自您的 [ForwardingResolver](/docs/cn/advanced/forwarding-resolvers)。 |
| [Culture](/api/Sisk.Core.Http.HttpRequest.Culture) | 从 `Accept-Language` 解析得到的最佳语言区域，若未匹配则回退到当前语言区域。 |
| [DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) | 当客户端断开连接时（如果配置的 HTTP 引擎支持）发出的取消令牌。 |
| [Bag](/api/Sisk.Core.Http.HttpRequest.Bag) | 在请求处理程序和路由操作之间共享的键/值存储。 |
| [GetRawHttpRequest](/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest) | 用于诊断的请求文本表示。 |

## 获取请求正文

某些请求包含正文，例如表单、文件或 API 事务。您可以通过以下属性获取请求正文：

```cs
// 将请求正文作为字符串获取，使用请求的编码作为解码器
string body = request.Body;

// 或者获取字节数组
byte[] bodyBytes = request.RawBody;

// 或者直接流式读取
Stream requestStream = request.GetRequestStream();

// 或者异步读取正文
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

也可以通过属性 [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) 判断请求是否有正文，以及通过 [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) 判断 HTTP 服务器是否已完整接收远端的内容。

`GetRequestStream` 只能读取一次。如果使用此方法读取，`RawBody` 和 `Body` 的值也将不可用。请求流在请求上下文结束时会自动释放，无需手动 `Dispose`。此外，您可以使用 [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) 属性获取用于手动解码请求的最佳编码。

服务器对读取请求内容有大小限制，这同样适用于 [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) 和 [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body)。这些属性会将整个输入流复制到本地缓冲区，大小等同于 [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength)。

如果发送的内容超过用户配置的 [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength)，服务器会返回 413 Content Too Large 响应。若未配置限制或限制过大，当客户端发送的内容超过 [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue)（约 2 GB）且尝试通过上述属性访问时，服务器会抛出 [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0)。此时仍可通过流式方式处理内容。

> [!NOTE]
> 虽然 Sisk 允许这样做，但始终建议遵循 HTTP 语义，在不允许的请求方法中不要获取或提供内容。请阅读 [RFC 9110 “HTTP Semantics”](https://httpwg.org/spec/rfc9110.html)。

## 读取 JSON 请求

对于 JSON API，建议使用内置的 JSON 辅助方法，而不是手动读取 `Body` 并反序列化。它们使用 [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) 并默认使用 [HttpRequest.DefaultJsonSerializerOptions](/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions)。

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

在已经是异步路由或希望在取消时停止反序列化的情况下，使用异步重载：

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

您可以为特定端点传入自定义的 [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions)：

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

对于 Native AOT 或对裁剪敏感的应用程序，使用由 `JsonSerializerContext` 生成的 `JsonTypeInfo<T>` 重载：

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

JSON 辅助方法同样遵循“一次读取”规则：在 Sisk 通过 `GetJsonContent`、`GetJsonContentAsync`、`Body` 或 `RawBody` 读取请求流后，您不能再通过 `GetRequestStream()` 读取相同的正文。

## 获取请求上下文

HTTP Context 是 Sisk 专有的对象，用于存储 HTTP 服务器、路由、路由器和请求处理程序的信息。它可以帮助您在对象难以组织的环境中保持清晰。

您可以使用静态方法 `HttpContext.GetCurrentContext()` 获取当前正在执行的 [HttpContext](/api/Sisk.Core.Http.HttpContext)。该方法返回当前线程正在处理的请求的上下文。

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### 日志模式

[HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) 属性允许您控制当前请求的日志行为。您可以为特定请求启用或禁用日志，覆盖默认的服务器配置。

```cs
// 为此请求禁用日志
context.LogMode = LogOutputMode.None;
```

### 请求包

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) 对象保存了从一个请求处理程序传递到另一个点的信息，并可在最终目的地消费。该对象也可被在路由回调之后运行的请求处理程序使用。

> [!TIP]
> 此属性也可以通过 [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) 访问。

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

上述请求处理程序会在请求包中定义 `AuthenticatedUser`，随后可在最终回调中使用：

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

您也可以使用 `Bag.Set()` 与 `Bag.Get()` 辅助方法按类型单例获取或设置对象。

`TypedValueDictionary` 类同样提供 `GetValue` 与 `SetValue` 方法以获得更细粒度的控制。

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## 获取表单数据

您可以使用下面的示例将表单数据获取为 [StringKeyStoreCollection](/api/Sisk.Core.Entity.StringKeyStoreCollection)：

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

当请求正文可能较大或需要取消支持时，使用异步版本：

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## 获取 multipart 表单数据

Sisk 的 HTTP 请求允许您获取上传的 multipart 内容，例如文件、表单字段或任何二进制内容。

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // 以下方法将整个请求输入读取为
    // MultipartObject 数组
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Multipart 表单数据提供的文件名。
        // 若对象不是文件则返回 null。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // multipart 表单数据对象的字段名。
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // multipart 表单数据的内容长度。
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // 根据文件头部判断图像格式（针对已知的内容类型）。
        // 若内容不是已识别的常见文件格式，则此方法返回
        // MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

在异步路由中使用 [GetMultipartFormContentAsync](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync)：

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

您可以进一步阅读 Sisk 的 [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) 以及其方法、属性和功能。

## 检测客户端断开

自 Sisk v1.15 起，框架通过 [HttpRequest.DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) 提供取消令牌。当配置的 HTTP 引擎支持断开检测时，若客户端在响应完成前关闭连接，该令牌会被取消。这对于在客户端不再等待结果时停止长时间运行的操作非常有用。

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // 从请求获取断开令牌
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

该令牌并非所有 HTTP 引擎都兼容，每个引擎都需要相应实现。

默认的基于 `System.Net.HttpListener` 的 Sisk 引擎不支持客户端断开检测。使用默认引擎时，`DisconnectToken` 为 `CancellationToken.None`；实际上它是一个不可取消的令牌，应视为不可用。

[Cadente 引擎](/docs/cn/cadente) 支持 `DisconnectToken`。如果您的路由依赖断开感知的取消，请使用 Cadente 或其他明确实现此行为的引擎。即使使用支持的引擎，取消也是协作式的：将令牌传递给异步 API 并在自己的长时间运行工作中检查它。

## Server‑sent events 支持

Sisk 支持 [Server‑sent events](https://developer.mozilla.org/en-US/docs/cn/Web/API/Server-sent_events)，允许以流的方式发送块并保持服务器与客户端之间的连接。

调用 [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法会将 HttpRequest 置于监听状态。此时该 HTTP 请求的上下文不再期待 HttpResponse，因为它会与服务器端事件发送的包交叉。

发送完所有包后，回调必须返回 [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) 方法，以向服务器发送最终响应并指示流已结束。

无法预知所有将要发送的包的总长度，因此无法使用 `Content‑Length` 头部来确定连接结束。

大多数浏览器默认情况下，服务器端事件不支持发送除 GET 方法之外的 HTTP 头或方法。因此，在使用需要特定请求头的 event‑source 请求时需格外小心，因为它们可能不会携带这些头。

此外，大多数浏览器在客户端未调用 [EventSource.close](https://developer.mozilla.org/en-US/docs/cn/Web/API/EventSource/close) 方法时会重新启动流，这会导致服务器端产生无限的额外处理。为避免此类问题，通常会发送一个最终包，指示事件源已完成所有包的发送。

下面的示例展示了浏览器如何与支持 Server‑side events 的服务器通信。

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

随后逐步向客户端发送消息：

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

运行此代码时，预期得到类似下图的结果：

<img src="/assets/img/server side events demo.gif" />

## 解析代理的 IP 与主机

Sisk 可与代理一起使用，因此在客户端到代理的事务中，IP 地址可能会被代理端点替换。

您可以在 Sisk 中使用 [forwarding resolvers](/docs/cn/advanced/forwarding-resolvers) 定义自己的解析器。

## 头部编码

某些实现的头部编码可能会出现问题。在 Windows 上不支持 UTF‑8 头部，因而使用 ASCII。Sisk 内置了编码转换器，可用于解码错误编码的头部。

此操作成本较高，默认情况下已禁用，可通过 [HttpServerConfiguration.NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings) 启用。