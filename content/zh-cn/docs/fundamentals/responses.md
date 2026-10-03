---
title: "响应"
weight: 40
aliases:
  - "/docs/cn/fundamentals/responses.html"
sourceHash: "2584dea87c2b28f3"
---

响应表示对 HTTP 请求的 HTTP 响应对象。它们由服务器发送给客户端，以指示对资源、页面、文档、文件或其他对象的请求。

HTTP 响应由状态、头部和内容组成。

在本文档中，我们将教您如何使用 Sisk 构建 HTTP 响应。

## 设置 HTTP 状态

自 HTTP/1.0 起，HTTP 状态列表保持不变，Sisk 支持所有状态码。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

或使用流式语法：

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

您可以在[此处](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode)查看可用的 HttpStatusCode 完整列表。您也可以使用 [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 结构提供自定义状态码。

## 正文和内容类型

Sisk 支持原生 .NET 内容对象在响应中发送正文。例如，您可以使用 [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) 类发送 JSON 响应：

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

如果您未在头部显式定义 `Content-Length`，服务器将始终尝试根据您在内容中定义的内容计算 `Content-Length`。如果服务器无法从响应内容隐式获取 Content-Length 头部，响应将使用分块传输编码（Chunked-Encoding）发送。

您也可以通过发送 [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) 或使用方法 [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) 来流式传输响应。

## 响应头

您可以添加、编辑或删除响应中发送的头部。下面的示例展示了如何向客户端发送重定向响应。

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

或使用流式语法：

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

当您使用 HttpHeaderCollection 的 [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) 方法时，您是在不更改已发送头部的情况下向请求添加头部。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) 方法会用指定的值替换同名头部。HttpHeaderCollection 的索引器内部调用 Set 方法来替换头部。

您还可以使用 [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue) 方法检索头部值。该方法有助于获取响应头部和内容头部（如果设置了内容）的值。

```cs
// 返回 "Content-Type" 头部的值，同时检查 response.Headers 和 response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## 发送 Cookie

Sisk 提供了便于在客户端定义 Cookie 的方法。通过此方法设置的 Cookie 已经进行 URL 编码，并符合 RFC-6265 标准。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

或使用流式语法：

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

同一方法还有其他[更完整的版本](/api/Sisk.Core.Helpers.CookieHelper.SetCookie)。

## 分块响应

您可以将传输编码设置为分块（chunked），以发送大型响应。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

使用分块编码时，Content-Length 头部会自动省略。

## 响应流

响应流是一种受管方式，允许您以分段方式发送响应。这比使用 HttpResponse 对象更底层，因为它需要您手动发送头部和内容，然后关闭连接。

此示例为文件打开只读流，将该流复制到响应输出流，并且不会将整个文件加载到内存中。这对于提供中等或大型文件非常有用。

```cs
// 获取响应输出流
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 设置响应编码以使用分块传输编码
// 同时在使用时不应发送 content-length 头部
// 分块编码
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// 将文件流复制到响应输出流
fileStream.CopyTo(responseStream.ResponseStream);

// 关闭流
return responseStream.Close();
```

## GZip、Deflate 和 Brotli 压缩

您可以在 Sisk 中发送压缩内容的响应。首先，将您的 [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) 对象封装在以下压缩器之一中，以向客户端发送压缩响应。

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // or Content = new BrotliContent(new HtmlContent(myHtml)),
        // or Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

您也可以在流中使用这些压缩内容。

```cs
router.MapGet("/archive.zip", request => {
    
    // do not apply "using" here. the HttpServer will discard your content
    // after sending the response.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

使用这些内容时，Content-Encoding 头部会自动设置。

## 自动压缩

可以通过 [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) 属性自动压缩 HTTP 响应。该属性会自动将路由器的响应内容封装为可压缩内容，只要响应未继承自 [CompressedContent](/api/Sisk.Core.Http.CompressedContent)，并且该内容被请求接受。

对于一次请求，只会选择一种可压缩内容，依据 Accept-Encoding 头部按以下顺序选择：

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

如果请求声明接受其中任意一种压缩方式，响应将自动进行压缩。

## 隐式响应类型

您可以使用除 HttpResponse 之外的其他返回类型，但需要配置路由器如何处理每种对象类型。

其概念是始终返回引用类型并将其转换为有效的 HttpResponse 对象。返回 HttpResponse 的路由不会进行任何转换。

值类型（结构体）不能用作返回类型，因为它们与 [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) 不兼容，因此必须包装在 ValueResult 中才能在处理程序中使用。

请参考以下未在返回类型中使用 HttpResponse 的路由模块示例：

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

有了这些，现在需要在路由器中定义它如何处理每种对象。对象始终是处理程序的第一个参数，输出类型必须是有效的 HttpResponse。此外，路由的输出对象不应为 null。

对于 ValueResult 类型，无需指明输入对象是 ValueResult 以及仅 T，因为 ValueResult 是从其原始组件反射得到的对象。

类型关联并不比较已注册的类型与路由回调返回对象的类型，而是检查路由结果的类型是否可分配给已注册的类型。

注册 Object 类型的处理程序将作为所有先前未验证类型的回退。值处理程序的插入顺序也很重要，因此注册 Object 处理程序会忽略所有其他特定类型的处理程序。始终先注册具体的值处理程序以确保顺序。

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// registering an value handler of object must be the last
// value handler which will be used as an fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## 延迟操作

当请求到达路由器时，首先会经过[请求处理程序](/docs/fundamentals/request-handlers)，在路由操作中处理，然后再由后执行的请求处理程序处理。路由操作的结果会传递给值处理程序，值处理程序的结果则作为响应发送给客户端。

此生命周期在异步上下文中进行。该异步上下文公开变量，用户可以将其添加到 [HttpContext Bag](/api/Sisk.Core.Http.HttpContext) 中，以在处理程序和路由操作之间共享数据。路由操作返回的值会加入此异步上下文，可由值处理程序访问。

延迟操作是在周期结束时执行的操作，即在向客户端交付响应之后，但仍在同一异步上下文中。这些操作可用于执行不必在发送响应前完成的长时间任务，例如保存日志、更新数据库、发送电子邮件等。

异常仍会在延迟操作中被捕获，并以与请求生命周期中任何位置抛出的异常相同的方式处理。不同之处在于客户端已经收到响应，因此异常由默认错误处理机制处理。

使用 [HttpContext.EnqueueDeferredAction](/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction) 方法延迟执行操作。该方法接收一个表示要执行的操作的异步函数以及可选的超时时间以限制操作的执行时间。如果操作未在时间限制内完成，将被取消。

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // 调度一个长时间运行的操作，该操作将在向客户端发送响应后执行，但仍在同一请求的异步上下文中
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## 关于可枚举对象和数组的说明

实现了 [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) 的隐式响应对象会在通过定义的值处理程序转换之前，通过 `ToArray()` 方法读取到内存中。为此，`IEnumerable` 对象会被转换为对象数组，响应转换器始终接收 `Object[]` 而非原始类型。

考虑以下情形：

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

在上述示例中，`IEnumerable<string>` 转换器**永远不会被调用**，因为输入对象始终是 `Object[]`，且无法转换为 `IEnumerable<string>`。然而，下面接收 `IEnumerable<object>` 的转换器会收到其输入，因为其值是兼容的。

如果您确实需要处理将被枚举的对象类型，则需要使用反射获取集合元素的类型。所有可枚举对象（列表、数组和集合）都会被 HTTP 响应转换器转换为对象数组。

如果启用了 [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) 属性，服务器会自动处理实现了 [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) 的值，类似于 `IEnumerable` 的处理方式。此选项在 `HttpServerConfiguration` 中默认启用；异步枚举会被转换为阻塞枚举器，然后再转换为同步的对象数组。仅在您为异步序列提供自定义值处理程序或流式响应策略时才禁用它。
