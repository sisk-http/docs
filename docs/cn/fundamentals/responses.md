# 响应

响应代表对象，它们是 HTTP 请求的 HTTP 响应。它们由服务器发送到客户端，表示请求资源、页面、文档、文件或其他对象。

HTTP 响应由状态、头部和内容组成。

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

您可以在 [这里](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) 查看所有可用的 HttpStatusCode。您也可以使用 [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 结构提供自己的状态代码。

## 正文和内容类型

Sisk 支持本地 .NET 内容对象来发送响应正文。您可以使用 [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) 类来发送 JSON 响应，例如：

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

服务器将始终尝试从您定义的内容中计算 `Content-Length`，如果您没有在头部中显式定义它。如果服务器无法从响应内容中隐式获取 `Content-Length` 头，响应将以分块编码发送。

您还可以通过发送 [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) 或使用 `GetResponseStream` 方法来流式传输响应。

## 响应头

您可以添加、编辑或删除发送在响应中的头。以下示例显示如何向客户端发送重定向响应。

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

当您使用 [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) 方法添加头时，您是在不修改已发送头的前提下添加一个头。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) 方法用指定值替换同名头。HttpHeaderCollection 的索引器内部调用 Set 方法替换头。

## 发送 Cookie

Sisk 有方法可以方便地在客户端定义 Cookie。使用此方法设置的 Cookie 已经是 URL 编码的，并符合 RFC-6265 标准。

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

响应流是一种管理方式，允许您分段发送响应。它比使用 HttpResponse 对象更低级，因为您需要手动发送头和内容，然后关闭连接。

以下示例打开一个文件的只读流，将流复制到响应输出流，并且不将整个文件加载到内存中。这对于提供中型或大型文件很有用。

```cs
// 获取响应输出流
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 设置响应编码以使用分块编码
// 同时，您不应该在使用分块编码时发送内容长度头
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// 将文件流复制到响应输出流
fileStream.CopyTo(responseStream.ResponseStream);

// 关闭流
return responseStream.Close();
```

## GZip、Deflate 和 Brotli 压缩

您可以使用 Sisk 发送压缩内容的 HTTP 响应。首先，将您的 [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) 对象封装在以下压缩器之一中，以发送压缩响应到客户端。

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
    
    // 不要在这里使用“using”。HttpServer 将在发送响应后丢弃您的内容
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

使用这些内容时，`Content-Encoding` 头将被自动设置。

## 隐式响应类型

从版本 0.15 开始，您可以使用除 HttpResponse 之外的其他返回类型，但需要配置路由器如何处理每种类型的对象。

概念是始终返回一个引用类型并将其转换为有效的 HttpResponse 对象。返回 HttpResponse 的路由不经历任何转换。

值类型（结构）不能用作返回类型，因为它们与 [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) 不兼容，因此必须将它们封装在 ValueResult 中才能在处理程序中使用。

考虑以下示例来自不在返回类型中使用 HttpResponse 的路由器模块：

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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

这样，现在需要在路由器中定义如何处理每种类型的对象。对象始终是处理程序的第一个参数，输出类型必须是有效的 HttpResponse。路由的输出对象永远不应为 null。

对于 ValueResult 类型，不需要指出输入对象是 ValueResult，只需要 T，因为 ValueResult 是其原始组件的反射。

类型关联不检查注册的类型与路由器回调返回的类型是否匹配。相反，它检查路由器结果的类型是否可以分配给注册的类型。

注册类型 Object 将回退到所有以前未验证的类型。值处理程序的插入顺序也很重要，因此注册 Object 处理程序将忽略所有其他特定类型的处理程序。始终先注册特定值处理程序，以确保顺序。

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // 在这里执行某些操作
});

// 注册 Object 值处理程序必须是最后一个值处理程序
// 它将被用作回退
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```