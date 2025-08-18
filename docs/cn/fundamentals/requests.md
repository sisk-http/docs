# 请求

请求是表示 HTTP 请求消息的结构体。`[HttpRequest](/api/Sisk.Core.Http.HttpRequest)` 对象包含在整个应用程序中处理 HTTP 消息的有用函数。

HTTP 请求由方法、路径、版本、头部和正文组成。

在本文档中，我们将教你如何获取这些元素。

## 获取请求方法

要获取收到请求的方法，可以使用 `Method` 属性：

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

此属性返回一个由 [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) 对象表示的请求方法。

> [!NOTE]
> 与路由方法不同，此属性不服务于 [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) 项。相反，它返回真实的请求方法。

## 获取请求 URL 组件

你可以通过请求的某些属性获取 URL 的各种组件。以以下 URL 为例：

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
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | 获取请求查询。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 获取请求查询的命名值集合。 | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | 判断请求是否使用 SSL（true）或不使用（false）。 | `false` |

你也可以使用 [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) 属性，它将上述所有内容包含在一个对象中。

## 获取请求正文

某些请求包含正文，例如表单、文件或 API 事务。你可以通过属性获取请求正文：

```cs
// 以字符串形式获取请求正文，使用请求编码作为编码器
string body = request.Body;

// 或以字节数组获取
byte[] bodyBytes = request.RawBody;

// 或者，你可以流式读取。
Stream requestStream = request.GetRequestStream();
```

还可以通过属性 [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) 判断请求是否有正文，以及通过 [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) 判断 HTTP 服务器是否已完全接收来自远程点的内容。

不能通过 `GetRequestStream` 多次读取请求内容。如果使用此方法读取，`RawBody` 和 `Body` 中的值也将不可用。在请求上下文中不需要显式释放请求流，它会在创建它的 HTTP 会话结束时被释放。你还可以使用 [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) 属性获取最佳编码来手动解码请求。

服务器对读取请求内容有限制，适用于 [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) 和 [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body)。这些属性会将整个输入流复制到一个与 [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength) 相同大小的本地缓冲区。

如果发送的内容大于用户配置中定义的 [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength)，服务器会返回状态码 413 Content Too Large 的响应。除此之外，如果未配置限制或限制过大，服务器在客户端发送的内容超过 [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue)（2 GB）并尝试通过上述属性访问内容时，将抛出 [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0)。你仍然可以通过流式处理来处理内容。

> [!NOTE]
> 虽然 Sisk 允许这样做，但始终建议遵循 HTTP 语义来创建你的应用程序，并且不要在不允许的方法中获取或提供内容。阅读关于 [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html) 的内容。

## 获取请求上下文

HTTP Context 是一个专属的 Sisk 对象，用于存储 HTTP 服务器、路由、路由器和请求处理程序信息。你可以使用它来在这些对象难以组织的环境中进行组织。

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) 对象包含从请求处理程序传递到另一个点的存储信息，并可在最终目的地消费。此对象也可被在路由回调后运行的请求处理程序使用。

> [!TIP]
> 此属性也可通过 [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) 属性访问。

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

上述请求处理程序将在请求包中定义 `AuthenticatedUser`，并可在最终回调中稍后消费：

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

你还可以使用 `Bag.Set()` 和 `Bag.Get()` 辅助方法按其类型单例获取或设置对象。

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

你可以使用以下示例中的 [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) 获取表单数据的值：

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

## 获取 multipart 表单数据

Sisk 的 HTTP 请求允许你获取上传的 multipart 内容，例如文件、表单字段或任何二进制内容。

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
    // 以下方法将整个请求输入读取到
    // MultipartObjects 数组中
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Multipart 表单数据提供的文件名。
        // 如果对象不是文件，则返回 null。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Multipart 表单数据对象字段名。
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Multipart 表单数据内容长度。
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // 根据每个已知内容类型的文件头确定图像格式。
        // 如果内容不是已识别的常见文件格式，此方法将返回 MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

你可以阅读更多关于 Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) 及其方法、属性和功能。

## 检测客户端断开

自 Sisk v1.15 版本起，框架提供了一个 CancellationToken，当客户端与服务器之间的连接在收到响应之前提前关闭时会抛出。此令牌可用于检测客户端不再需要响应并取消长时间运行的操作。

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // 从请求获取断开令牌
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

此令牌并不兼容所有 HTTP 引擎，每个都需要实现。

## 服务器发送事件支持

Sisk 支持 [Server-sent events](https://developer.mozilla.org/en-US/docs/cn/Web/API/Server-sent_events)，允许以流的方式发送块并保持服务器与客户端之间的连接。

调用 [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法将把 HttpRequest 放入其监听器状态。从此，HTTP 请求的上下文将不再期望 HttpResponse，因为它会覆盖服务器端事件发送的包。

发送所有包后，回调必须返回 [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) 方法，它将向服务器发送最终响应并指示流已结束。

无法预测将发送的所有包的总长度，因此无法使用 `Content-Length` 标头确定连接结束。

大多数浏览器默认不支持发送除 GET 方法之外的 HTTP 标头或方法。因此，在使用需要特定请求头的事件源请求的请求处理程序时，请小心，因为它们可能不会有这些头。

此外，大多数浏览器在客户端收到所有包后未调用 [EventSource.close](https://developer.mozilla.org/en-US/docs/cn/Web/API/EventSource/close) 方法时会重新启动流，导致服务器端无限额外处理。为避免此类问题，通常会发送一个最终包，指示事件源已完成发送所有包。

下面的示例显示浏览器如何与支持服务器端事件的服务器通信。

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

并逐步向客户端发送消息：

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

Sisk 可以与代理一起使用，因此 IP 地址可能会被代理端点替换，从客户端到代理的事务中。

你可以在 Sisk 中使用 [forwarding resolvers](/docs/cn/advanced/forwarding-resolvers) 定义自己的解析器。

## 头部编码

头部编码可能会成为某些实现的一个问题。在 Windows 上，UTF-8 头部不受支持，因此使用 ASCII。Sisk 内置了编码转换器，可用于解码错误编码的头部。

此操作成本高且默认禁用，但可以在 [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) 标志下启用。