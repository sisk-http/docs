# 响应

响应代表对象，它们是对 HTTP 请求的 HTTP 响应。它们由服务器发送到客户端，作为请求资源、页面、文档、文件或其他对象的指示。

一个 HTTP 响应由状态、头部和内容组成。

在本文档中，我们将教您如何使用 Sisk 架构 HTTP 响应。

## 设置 HTTP 状态

HTTP 状态列表自 HTTP/1.0 以来一直保持不变，Sisk 支持所有这些状态。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

或者使用流式语法：

```cs
new HttpResponse()
    .WithStatus(200) // 或
    .WithStatus(HttpStatusCode.Ok) // 或
    .WithStatus(HttpStatusInformation.Ok);
```

您可以在 [这里](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) 查看所有可用的 HttpStatusCode 列表。您还可以使用 [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 结构提供自己的状态代码。

## 正文和内容类型

Sisk 支持使用本机 .NET 内容对象在响应中发送正文。您可以使用 [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) 类发送 JSON 响应，例如：

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

服务器将始终尝试从您定义的内容中计算 `Content-Length`，如果您没有在头部显式定义它。如果服务器无法从响应内容中隐式获取 `Content-Length` 头，响应将以分块编码发送。

您还可以通过发送 [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) 或使用 [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) 方法来流式传输响应。

## 响应头

您可以添加、编辑或删除响应中发送的头部。以下示例显示如何向客户端发送重定向响应。

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

或者使用流式语法：

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

当您使用 `HttpHeaderCollection` 的 `Add` 方法时，您是在不修改已发送的头部的情况下添加一个头部。`Set` 方法用指定的值替换同名的头部。`HttpHeaderCollection` 的索引器在内部调用 `Set` 方法来替换头部。

您还可以使用 [GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue) 方法检索头部值。该方法有助于从响应头部和内容头部（如果设置了内容）中获取值。

```cs
// 返回 "Content-Type" 头的值，检查 response.Headers 和 response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## 发送 cookie

Sisk 有方法来方便地在客户端定义 cookie。使用此方法设置的 cookie 已经是 URL 编码的，并符合 RFC-6265 标准。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

或者使用流式语法：

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

还有其他 [更完整的版本](/api/Sisk.Core.Http.CookieHelper.SetCookie) 的同一方法。

## 分块响应

您可以将传输编码设置为分块来发送大型响应。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

使用分块编码时，`Content-Length` 头将被自动省略。

## 响应流

响应流是一种管理方式，允许您分段发送响应。它比使用 `HttpResponse` 对象是一种更低级的操作，因为它需要您手动发送头部和内容，然后关闭连接。

以下示例打开一个文件的只读流，将流复制到响应输出流中，并且不将整个文件加载到内存中。这对于提供中型或大型文件很有用。

```cs
// 获取响应输出流
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 设置响应编码以使用分块编码
// 同时，您不应该在使用分块编码时发送 content-length 头
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// 将文件流复制到响应输出流
fileStream.CopyTo(responseStream.ResponseStream);

// 关闭流
return responseStream.Close();
```

## GZip、Deflate 和 Brotli 压缩

您可以使用压缩的 HTTP 内容在 Sisk 中发送压缩的响应。首先，将您的 [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) 对象封装在以下压缩器之一中，以向客户端发送压缩的响应。

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // 或 Content = new BrotliContent(new HtmlContent(myHtml)),
        // 或 Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

您还可以将这些压缩内容与流一起使用。

```cs
router.MapGet("/archive.zip", request => {
    
    // 不要在这里应用 "using"。HttpServer 将在发送响应后丢弃您的内容。
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

使用这些内容时，`Content-Encoding` 头将被自动设置。

## 自动压缩

可以使用 [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) 属性自动压缩 HTTP 响应。该属性自动将路由器的响应内容封装在可压缩的内容中，该内容由请求接受，前提是响应不是从 [CompressedContent](/api/Sisk.Core.Http.CompressedContent) 继承的。

对于每个请求，只选择一种可压缩的内容，根据 `Accept-Encoding` 头的顺序：

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

如果请求指定它接受任何这些压缩方法，响应将被自动压缩。

## 隐式响应类型

您可以使用除 `HttpResponse` 之外的其他返回类型，但需要配置路由器如何处理每种类型的对象。

概念是始终返回一个引用类型并将其转换为有效的 `HttpResponse` 对象。返回 `HttpResponse` 的路由不需要进行任何转换。

不能使用值类型（结构）作为返回类型，因为它们与 [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) 不兼容，因此必须将它们封装在 `ValueResult` 中才能在处理程序中使用。

考虑以下示例来自不使用 `HttpResponse` 返回类型的路由器模块：

```csharp
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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

现在，需要在路由器中定义如何处理每种类型的对象。对象始终是处理程序的第一个参数，输出类型必须是有效的 `HttpResponse`。路由的输出对象永远不应为 null。

对于 `ValueResult` 类型，不需要指出输入对象是 `ValueResult`，只需要 `T`，因为 `ValueResult` 是其原始组件的反射对象。

类型关联不检查注册的类型与路由器回调返回的类型是否匹配。相反，它检查路由器结果的类型是否可以分配给注册的类型。

注册 `Object` 类型的处理程序将忽略所有以前未验证的类型。注册值处理程序的顺序也很重要，因此注册 `Object` 处理程序将忽略所有其他特定类型的处理程序。始终先注册特定值处理程序，以确保顺序。

```cs
Router r = new Router();
r.SetObject(new UsersController());

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

// 注册 Object 类型的值处理程序必须是最后一个
// 值处理程序，它将作为回退使用
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## 关于可枚举对象和数组的注意事项

实现 [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) 的隐式响应对象将通过 `ToArray()` 方法读入内存，然后通过定义的值处理程序进行转换。为此，`IEnumerable` 对象将转换为对象数组，响应转换器将始终接收到 `Object[]` 而不是原始类型。

考虑以下场景：

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

在上面的示例中，`IEnumerable<string>` 转换器 **永远不会被调用**，因为输入对象将始终是 `Object[]`，而且它不能转换为 `IEnumerable<string>`。但是，下一个接收 `IEnumerable<object>` 的转换器将接收到输入，因为其值是兼容的。

如果您需要实际处理要枚举的对象的类型，您需要使用反射来获取集合元素的类型。所有可枚举对象（列表、数组和集合）都被 HTTP 响应转换器转换为对象数组。

实现 [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) 的值将在 [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) 属性启用时被服务器自动处理，类似于 `IEnumerable` 的情况。异步枚举被转换为阻塞枚举器，然后转换为对象的同步数组。