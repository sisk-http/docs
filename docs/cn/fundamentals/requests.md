# 请求

请求是代表 HTTP 请求消息的结构。 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 对象包含处理 HTTP 消息的有用函数，用于整个应用程序。

HTTP 请求由方法、路径、版本、头部和正文组成。

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

此属性返回请求的方法，表示为 [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) 对象。

> [!NOTE]
> 与路由方法不同，此属性不提供 [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) 项。相反，它返回实际的请求方法。

## 获取请求 URL 组件

您可以通过请求的某些属性从 URL 中获取各种组件。对于此示例，让我们考虑以下 URL：

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| 组件名称 | 描述 | 组件值 |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | 获取请求路径。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | 获取请求路径和查询字符串。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | 获取整个 URL 请求字符串。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | 获取请求主机。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | 获取请求主机和端口。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | 获取请求查询。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 获取请求查询，以命名值集合形式。 | `{StringValueCollection 对象}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | 确定请求是否使用 SSL（true）或不使用（false）。 | `false` |

您也可以使用 [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) 属性，该属性包含上述所有内容。

## 获取请求正文

一些请求包含正文，例如表单、文件或 API 事务。您可以从以下属性获取请求正文：

```cs
// 以字符串形式获取请求正文，使用请求编码作为编码器
string body = request.Body;

// 或以字节数组形式获取
byte[] bodyBytes = request.RawBody;

// 或者，您可以流式传输它。
Stream requestStream = request.GetRequestStream();
```

还可以使用 [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) 和 [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) 属性确定请求是否包含正文以及是否已加载。

无法多次通过 `GetRequestStream` 读取请求内容。如果使用此方法读取，则 `RawBody` 和 `Body` 的值也将不可用。在请求的上下文中，不需要处理请求流，因为它将在创建的 HTTP 会话结束时处理。另外，您可以使用 [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) 属性获取解码请求的最佳编码。

服务器对读取请求内容有限制，这适用于 [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) 和 [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body)。这些属性将整个输入流复制到一个与 [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength) 相同大小的本地缓冲区中。

如果客户端发送的内容大于 [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength)（在用户配置中定义），则返回状态代码 413 的响应给客户端。另外，如果没有配置限制或限制太大，服务器将在客户端发送的内容超过 [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue)（2 GB）时抛出 [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0)，并尝试通过上述属性之一访问内容。您仍然可以通过流式处理来处理内容。

> [!NOTE]
> 虽然 Sisk 允许这样做，但为了创建您的应用程序，始终遵循 HTTP 语义并避免在不允许的方法中获取或提供内容是一个好主意。请阅读 [RFC 9110“HTTP 语义”](https://httpwg.org/spec/rfc9110.html)。

## 获取请求上下文

HTTP 上下文是 Sisk 的一个独特对象，存储 HTTP 服务器、路由、路由器和请求处理程序信息。您可以使用它来组织自己在这些对象难以组织的环境中。

您可以使用静态方法 `HttpContext.GetCurrentContext()` 获取当前执行的 [HttpContext](/api/Sisk.Core.Http.HttpContext)。此方法返回当前线程中处理的请求的上下文。

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### 日志模式

[HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) 属性允许您控制当前请求的日志记录行为。您可以为特定请求启用或禁用日志记录，覆盖默认服务器配置。

```cs
// 禁用此请求的日志记录
context.LogMode = LogOutputMode.None;
```

### 请求包

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) 对象包含存储的信息，该信息从一个请求处理程序传递到另一个点，并可以在最终目的地消耗。该对象也可以由在路由回调之后运行的请求处理程序使用。

> [!TIP]
> 此属性也可以通过 [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) 属性访问。

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

上面的请求处理程序将在请求包中定义 `AuthenticatedUser`，并可以稍后在最终回调中使用：

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

您还可以使用 `Bag.Set()` 和 `Bag.Get()` 帮助器方法按类型单例获取或设置对象。

`TypedValueDictionary` 类还提供 `GetValue` 和 `SetValue` 方法以获得更多控制。

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

您可以在 [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) 中获取表单数据的值，方法如下：

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

## 获取多部分表单数据

Sisk 的 HTTP 请求允许您获取上传的多部分内容，例如文件、表单字段或任何二进制内容。

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
    // 以下方法将整个请求输入读入 MultipartObject 数组
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // 多部分表单数据对象的文件名。
        // 如果对象不是文件，则返回 null。
        Console.WriteLine("文件名       : " + uploadedObject.Filename);

        // 多部分表单数据对象的字段名。
        Console.WriteLine("字段名      : " + uploadedObject.Name);

        // 多部分表单数据内容长度。
        Console.WriteLine("内容长度  : " + uploadedObject.ContentLength);

        // 根据每个已知内容类型的文件头确定图像格式。
        // 如果内容不是公认的常见文件格式，则此方法将返回 MultipartObjectCommonFormat.Unknown
        Console.WriteLine("常见格式   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

您可以阅读更多关于 Sisk [多部分表单对象](/api/Sisk.Core.Entity.MultipartObject)及其方法、属性和功能的信息。

## 检测客户端断开连接

从 Sisk v1.15 开始，框架提供了一个在客户端和服务器之间的连接在接收到响应之前过早关闭时抛出的 CancellationToken。此令牌可用于检测客户端是否不再需要响应并取消长时间运行的操作。

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // 从请求中获取断开连接令牌
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

此令牌与所有 HTTP 引擎不兼容，每个引擎都需要实现。

## 服务器发送事件支持

Sisk 支持 [服务器发送事件](https://developer.mozilla.org/en-US/docs/cn/Web/API/Server-sent_events)，允许将块作为流发送并保持服务器和客户端之间的连接。

调用 [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法将使 HttpRequest 进入其监听状态。从此，当前 HTTP 请求的上下文将不再期望 HttpResponse，因为服务器发送的事件将覆盖服务器发送的数据包。

发送所有数据包后，回调必须返回 [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) 方法，该方法将发送最终响应到服务器并指示流媒体已结束。

由于无法预测将发送的所有数据包的总长度，因此无法使用 `Content-Length` 标头确定连接的末尾。

大多数浏览器的默认设置不支持服务器发送事件发送 HTTP 标头或除 GET 方法以外的方法。因此，在使用需要特定请求标头的请求处理程序的事件源请求时要小心，因为它们可能没有这些标头。

此外，大多数浏览器如果客户端没有在接收到所有数据包后调用 [EventSource.close](https://developer.mozilla.org/en-US/docs/cn/Web/API/EventSource/close) 方法，则会重新启动流，这将导致服务器端无限增加处理。为了避免此类问题，通常会发送一个最终数据包，指示事件源已完成发送所有数据包。

以下示例显示浏览器如何与支持服务器发送事件的服务器进行通信。

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
        <b>水果:</b>
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

并逐渐将消息发送给客户端：

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
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

运行此代码时，我们期望得到类似以下的结果：

<img src="/assets/img/server side events demo.gif" />

## 解析代理 IP 和主机

Sisk 可以与代理一起使用，因此 IP 地址可以在客户端到代理的交易中由代理端点替换。

您可以在 Sisk 中使用 [转发解析器](/docs/cn/advanced/forwarding-resolvers) 定义自己的解析器。

## 标头编码

标头编码可能是某些实现的问题。在 Windows 上，不支持 UTF-8 标头，因此使用 ASCII。Sisk 具有内置的编码转换器，可以用于解码不正确编码的标头。

此操作代价高昂，默认情况下禁用，但可以在 [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) 标志下启用。