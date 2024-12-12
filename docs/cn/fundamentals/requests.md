请求是表示 HTTP 请求消息的结构。 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 对象包含用于在整个应用程序中处理 HTTP 消息的有用函数。

HTTP 请求由方法、路径、版本、标头和正文组成。

在本文档中，我们将教您如何获取这些元素的每个部分。

## 获取请求方法

要获取接收到的请求的方法，可以使用 Method 属性：

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

此属性返回请求的方法，由 [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) 对象表示。

> [!NOTE]
> 与路由方法不同，此属性不包含 [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) 项。而是返回实际的请求方法。

## 获取请求 URL 组件

您可以通过请求的某些属性获取 URL 的各种组件。 以下是一个示例 URL：

```
http://localhost:5000/user/login?email=foo@bar.com
```

| 组件名称 | 描述 | 组件值 |
|---|---|---|
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | 获取请求路径。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | 获取请求路径和查询字符串。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | 获取整个请求 URL 字符串。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | 获取请求主机。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | 获取请求主机和端口。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | 获取请求查询。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 获取请求查询作为命名值集合。 | `{StringValueCollection 对象}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | 确定请求是否使用 SSL（true）或不使用 SSL（false）。 | `false` |

您还可以使用 [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) 属性，该属性包含上述所有内容在一个对象中。

## 获取请求正文

某些请求包含正文，例如表单、文件或 API 事务。您可以从属性获取请求的正文：

```cs
// 获取请求正文作为字符串，使用请求编码作为编码器
string body = request.Body;

// 或以字节数组获取
byte[] bodyBytes = request.RawBody;

// 或流式传输它
Stream requestStream = request.GetRequestStream();
```

还可以确定请求中是否存在正文以及是否已加载正文，使用 [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) 和 [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) 属性。

通过 `GetRequestStream` 读取请求内容一次以上是不可能的。如果使用此方法读取，则 `RawBody` 和 `Body` 中的值也将不可用。在请求上下文中，无需处理请求流，因为它将在 HTTP 会话结束时自动处理。此外，您可以使用 [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) 属性获取最佳编码，以手动解码请求。

服务器对读取请求内容有限制，这适用于 [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) 和 [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.RawBody)。这些属性将整个输入流复制到与 [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength) 相同大小的本地缓冲区中。

如果发送的内容大于 [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) 中定义的用户配置，则服务器会向客户端返回状态 413 Content Too Large 的响应。此外，如果未配置限制或限制太大，则服务器将在内容发送到客户端超过 [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue)（2 GB）时抛出 [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception？view=net-8.0)。您可以通过流式传输来处理内容。

> [!NOTE]
> Sisk 遵循 RFC 9110 "HTTP Semantics"，它不允许某些请求方法具有正文。这些请求将立即返回 400 (Bad Request) 以及 `ContentServedOnIllegalMethod` 状态。GET、OPTIONS、HEAD 和 TRACE 方法不允许使用请求正文。您可以在这里阅读 [RFC 9910](https://httpwg.org/spec/rfc9110.html)。
>
> 您可以通过将 [ThrowContentOnNonSemanticMethods](/api/Sisk.Core.Http.HttpServerFlags.ThrowContentOnNonSemanticMethods) 设为 `false` 来禁用此功能。

## 获取请求上下文

HTTP 上下文是 Sisk 的一个专用对象，用于存储 HTTP 服务器、路由、路由器和请求处理程序信息。您可以使用它来组织在组织这些对象的环境中难以组织的代码。

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) 对象包含从一个请求处理程序传递到另一个点存储的信息，并且可以在最终目的地被消费。此对象也可以由在路由回调之后运行的请求处理程序使用。

> [!TIP]
> 此属性也可以通过 [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) 属性访问。

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers["Authorization"] != null)
        {
            context.RequestBag.Add("AuthenticatedUser", "Bob");
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

上面的请求处理程序将定义 `AuthenticatedUser` 在请求袋中，并在最终回调中可以被消费：

```cs
public class MyController
{
    [Route(RouteMethod.Get, "/")
    [RequestHandler(typeof(AuthenticateUserRequestHandler))
    static HttpResponse Index(HttpRequest request)
    {
        var user = request.Context.RequestBag["AuthenticatedUser"];
        res.Content = new StringContent($"Hello, {user}!");
        return res;
    }
}
```

您还可以使用 `Bag.Set()` 和 `Bag.Get()` 助手方法来获取或设置类型为 `object` 的对象。

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}

[RouteGet("/")]
[RequestHandler<Authenticate>
public static HttpResponse Test(HttpRequest request)
{
    var user = request.Bag.Get<User>();
}
```

## 获取表单数据

您可以使用 NameValueCollection 获取表单数据。

```cs
static HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password) == true)
    {
        ...
    }
}
```

## 获取多部分表单数据

Sisk 的 HTTP 请求允许您获取上传的 multipart 内容，例如文件、表单字段或任何二进制内容。

```cs
static HttpResponse Index(HttpRequest request)
{
    var multipartFormDataObjects = request.GetMultipartFormContent();

    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // 文件名由 Multipart form data 提供的名称。
        // Null 是返回的 object 如果不是文件。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // Multipart form data 
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // Multipart form data 内容长度。
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // 根据文件头来确定图像格式。如果内容不是一个已知的常见文件格式。
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

You can read more about Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) and its methods, properties and functionalities.

## Server-sent events support

Sisk supports [Server-sent events](https://developer.mozilla.

Calling the [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) method will put the HttpRequest in its listener state. From this, the context of this HTTP request will not expect an HttpResponse as it will overlap the packets sent by server side events.

After sending all packets, the callback must return the [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) method, which will send the final response to the server and indicate that the streaming has ended.

It is not possible to predict the total length of all packets that will be sent, so it is not possible to determine the end of the connection with `Content-Length header.

By default, most browsers restart streams if the [EventSource.close](https://developer.mozilla.org/en-US/api/EventSource.close) method is not called on the client side after receiving all the packets, causing infinite additional processing on the server side. To avoid this kind of problem, it's common to send a final packet indicating that the event source has finished sending all packets.

The example below shows how the browser can communicate with the server that supports Server-side events.

```html
<html>
    <b>Fruits:</b>
    <ul>
        <li>
            <li>
                <li>
                    <li>
                        <li>
                            <li>
                                <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                                    <li>
                               