# 响应

响应表示HTTP请求的对象，是服务器发送给客户端的HTTP响应，用来指示请求的资源、页面、文档、文件或其他对象。

一个HTTP响应由状态、头部和内容组成。

在本文档中，我们将教您如何使用Sisk构建HTTP响应。

## 设置HTTP状态

自HTTP/1.0以来，HTTP状态列表保持不变，Sisk支持所有这些状态。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

或使用流畅语法：

```cs
new HttpResponse()
 .WithStatus(200) // 或
 .WithStatus(HttpStatusCode.Ok) // 或
 .WithStatus(HttpStatusInformation.Ok);
```

您可以在[此处](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode)查看可用的HttpStatusCode的完整列表。您也可以通过使用[HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation)结构提供自己的状态代码。

## 正文和内容类型

Sisk支持本地.NET内容对象来发送响应正文。例如，您可以使用[StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent)类发送JSON响应：

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

服务器将始终尝试从您在内容中定义的内容中计算`Content-Length`，如果您没有在头部明确定义。如果服务器无法从响应内容中隐含地获取Content-Length头部，响应将使用分块编码发送。

您也可以通过发送[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent)或使用[GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream)方法来流式传输响应。

## 响应头部

您可以添加、编辑或删除响应中发送的头部。下面示例演示了如何向客户端发送重定向响应：

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

或使用流畅语法：

```cs
new HttpResponse(301)
 .WithHeader("Location", "/login");
```

当您使用HttpHeaderCollection的[Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add)方法时，您正在添加一个头部到请求中，而不改变已经发送的头部。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set)方法用指定的值替换具有相同名称的头部。HttpHeaderCollection的索引器内部调用Set方法来替换头部。

## 发送Cookie

Sisk有方法方便地在客户端定义Cookie。通过此方法设置的Cookie已经URL编码并符合RFC-6265标准。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

或使用流畅语法：

```cs
new HttpResponse(301)
 .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

还有其他[更完整的版本](/api/Sisk.Core.Http.CookieHelper.SetCookie)相同的メソッド。

## 分块响应

您可以设置传输编码为分块，以发送大响应。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

使用分块编码时，Content-Length头部会自动省略。

## 响应流

响应流是一种托管方式，允许您分段发送响应。这是比使用HttpResponse对象更底层的操作，因为它们需要您手动发送头部和内容，然后关闭连接。

此示例打开文件的只读流，将流复制到响应输出流，并不加载整个文件到内存中。这对于服务中型或大文件非常有用。

```cs
// 获取响应输出流
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 设置响应编码使用分块编码
// 并且您不应该在分块编码时发送content-length头部
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// 将文件流复制到响应输出流
fileStream.CopyTo(responseStream.ResponseStream);

// 关闭流
return responseStream.Close();
```

## GZip、Deflate和Brotli压缩

您可以使用Sisk中的HTTP内容压缩发送压缩内容的响应。首先，将您的[HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent)对象封装在以下压缩器之一中，以向客户端发送压缩响应。

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

您也可以将这些压缩内容与流一起使用。

```cs
router.MapGet("/archive.zip", request => {
    
 // 不要在这里应用“using”。HttpServer将在发送响应后丢弃您的内容。
 // after sending the response.
 var archive = File.OpenRead("/path/to/big-file.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(archive)
 }
});
```

使用这些内容时，Content-Encoding头部会自动设置。

## 自动压缩

可以通过[EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression)属性自动压缩HTTP响应。此属性自动将路由器中的响应内容封装在请求接受的可压缩内容中，前提是响应不是从[CompressedContent](/api/Sisk.Core.Http.CompressedContent)继承的。

对于请求，只有一个可压缩的内容被选择，按照以下顺序：

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent)（br）
- [GZipContent](/api/Sisk.Core.Http.GZipContent)（gzip）
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent)（deflate）

如果请求指定接受这些压缩方法之一，则响应将自动压缩。

## 隐式响应类型

除了HttpResponse之外，您还可以使用其他返回类型，但需要配置路由器如何处理每种类型的对象。

概念是始终返回引用类型并将其转换为有效的HttpResponse对象。返回HttpResponse的路由不会进行任何转换。

值类型（结构）不能用作返回类型，因为它们与[RouterCallback](/api/Sisk.Core.Routing.RouterCallback)不兼容，因此必须将它们封装在ValueResult中才能在处理程序中使用。

考虑以下不使用HttpResponse作为返回类型的路由器模块的示例：

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

因此，现在需要在路由器中定义如何处理每种类型的对象。对象始终是处理程序的第一个参数，输出类型必须是有效的HttpResponse。此外，路由的输出对象永远不应为空。

对于ValueResult类型，不需要指示输入对象是ValueResult，而只需要T，因为ValueResult是其原始组件的反射对象。

类型关联不会比较已注册的内容与路由器回调返回的对象类型。相反，它检查路由器结果的类型是否可分配给已注册的类型。

注册Object类型的处理程序将退回到所有先前未验证的类型。值处理程序的插入顺序也很重要，因此注册Object处理程序将忽略所有其他特定于类型的处理程序。始终首先注册特定的值处理程序以确保顺序。

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

// 注册对象的值处理程序必须是最后一个
// 值处理程序，用作后备
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## 关于可枚举对象和数组的说明

实现了[IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0)的隐式响应对象在通过定义的值处理程序转换之前，会通过`ToArray()`方法读取到内存中。为了发生这种情况，`IEnumerable`对象被转换为对象数组，响应转换器将始终接收`Object[]`而不是原始类型。

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

在上面的示例中，`IEnumerable<string>`转换器**永远不会被调用**，因为输入对象始终是`Object[]`，并且不能转换为`IEnumerable<string>`。但是，接收`IEnumerable<object>`的转换器将接收其输入，因为其值是兼容的。

如果您需要实际处理将被枚举的对象类型，则需要使用反射来获取集合元素的类型。所有可枚举对象（列表、数组和集合）都由HTTP响应转换器转换为对象数组。

实现了[IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0)的值如果启用了[ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable)属性，则由服务器自动处理，类似于`IEnumerable`。异步枚举被转换为阻塞枚举器，然后转换为同步对象数组。