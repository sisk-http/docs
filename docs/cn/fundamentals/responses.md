响应表示 HTTP 请求的 HTTP 响应。它们由服务器发送给客户端，作为请求资源、页面、文档、文件或其他对象的指示。

HTTP 响应由状态、标头和内容组成。

在本文件中，我们将教您如何使用 Sisk 架构 HTTP 响应。

## 设置 HTTP 状态

HTTP 状态列表自 HTTP/1.0 以来一直相同，Sisk 支持所有状态。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

或者使用流畅语法：

```cs
new HttpResponse()
    .WithStatus(200) // 或者
    .WithStatus(HttpStatusCode.Ok) // 或者
    .WithStatus(HttpStatusInformation.Ok);
```

您可以查看 [此处](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) 获取所有可用 HttpStatusCode 的完整列表。您还可以通过使用 [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 结构提供您自己的状态代码。

## 内容和内容类型

Sisk 支持使用本机 .NET 内容对象发送响应正文。例如，您可以使用 [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) 类发送 JSON 响应：

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

如果服务器无法从响应内容中隐式获取 Content-Length 标头，则响应将使用 Chunked-Encoding 发送。

您还可以通过发送 [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) 或使用 GetResponseStream 方法来流式传输响应。

## 响应标头

您可以添加、编辑或删除发送到响应中的标头。以下示例演示如何向客户端发送重定向响应：

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

或者使用流畅语法：

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

当您使用 HttpHeaderCollection 的 [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) 方法时，您是在添加标头到请求中，而不会更改已经发送的标头。 [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) 方法使用指定的名称替换具有相同名称的标头值。 HttpHeaderCollection 的索引器内部调用 Set 方法来替换标头。

## 发送 cookie

Sisk 提供了方便定义客户端 cookie 的方法。通过此方法设置的 cookie 已经进行了 URL 编码，符合 RFC-6265 标准。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

或者使用流畅语法：

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

还有其他 [更完整的版本](/api/Sisk.Core.Http.CookieHelper.SetCookie) 具有相同方法。

## 分块响应

您可以将传输编码设置为分块以发送大型响应。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

使用分块编码时，Content-Length 标头会自动省略。

## 响应流

响应流是一种受管理的方式，允许您分段发送响应。它比使用 HttpResponse 对象更低级别的操作，因为它们要求您手动发送标头和内容，然后关闭连接。

此示例打开文件只读流，将流复制到响应输出流，并且不会将整个文件加载到内存中。这对于处理中等或大型文件很有用。

```cs
// 获取响应输出流
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 设置响应编码为分块编码
// 同样，您不应该在使用分块编码时发送 content-length 标头
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// 将文件流复制到响应输出流
fileStream.CopyTo(responseStream.ResponseStream);

// 关闭流
return responseStream.Close();
```

## 隐式响应类型

从版本 0.15 开始，您可以使用除 HttpResponse 之外的其他返回类型，但必须配置路由器如何处理每种类型的对象。

该概念始终返回引用类型并将其转换为有效的 HttpResponse 对象。返回 HttpResponse 的路由不会进行任何转换。

值类型（结构）不能用作返回类型，因为它们与 [RouterCallback](/api/Sisk.Core.Routing.RouterCallback) 不兼容，因此必须将其包装在 ValueResult 中才能在处理程序中使用。

考虑一个不使用 HttpResponse 的路由模块的以下示例：

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
        int id = request.Query["id"].GetInteger();
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

这样，现在需要在路由器中定义如何处理每种类型的对象。对象始终是处理程序的第一个参数，并且输出类型必须是有效的 HttpResponse。此外，路由结果的对象永远不能为 null。

对于 ValueResult 类型，不需要指示输入对象是 ValueResult，只需要 T，因为 ValueResult 是其原始组件的对象反射。

类型关联不比较注册类型与路由器回调返回类型的比较。相反，它检查路由器结果类型是否可分配给注册类型。

注册类型为 Object 的处理程序将回退到所有先前未验证的类型。值处理程序的插入顺序也至关重要，因此注册 Object 处理程序将忽略所有其他特定于类型的处理程序。始终先注册特定值处理程序以确保顺序。

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
    // 在这里做一些事情与 enumerableValue
});

// 注册类型为 object 的值处理程序必须是最后一个
// 值处理程序，它将用作回退
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```