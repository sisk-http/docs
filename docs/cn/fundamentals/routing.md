# 路由

[路由器](/api/Sisk.Core.Routing.Router) 是构建服务器的第一步。它负责容纳 [路由](/api/Sisk.Core.Routing.Route) 对象，这些对象是将 URL 和其方法映射到服务器执行的操作的端点。每个操作负责接收请求并将响应发送回客户端。

路由是路径表达式（“路径模式”）和它们可以监听的 HTTP 方法的对。 当请求发送到服务器时，它将尝试找到匹配接收到的请求的路由，然后调用该路由的操作并将结果响应发送回客户端。

在 Sisk 中，有多种方式来定义路由：它们可以是静态的、动态的或自动扫描的，可以使用属性定义，也可以直接在路由器对象中定义。

```cs
Router mainRouter = new Router();

// 将 GET / 路由映射到以下操作
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

要了解路由可以做什么，我们需要了解请求可以做什么。 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 将包含所有需要的信息。 Sisk 还包括一些额外的功能，可以加快整体开发速度。

对于服务器接收到的每个操作，都会调用一个 [RouteAction](/api/Sisk.Core.Routing.RouteAction) 类型的委托。这个委托包含一个参数，持有一个 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 对象，包含有关请求的所有必要信息。从这个委托返回的对象必须是 [HttpResponse](/api/Sisk.Core.Http.HttpResponse) 或通过 [隐式响应类型](/docs/fundamentals/responses#implicit-response-types) 映射到它的对象。

## 匹配路由

当请求发送到 HTTP 服务器时，Sisk 会搜索一个满足请求路径表达式的路由。该表达式始终在路由和请求路径之间进行测试，而不考虑查询字符串。

此测试没有优先级，并且仅限于单个路由。当没有路由与该请求匹配时，返回 [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) 响应给客户端。当路径模式匹配，但 HTTP 方法不匹配时，发送 [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) 响应给客户端。

Sisk 检查路由碰撞的可能性，以避免这些问题。在定义路由时，Sisk 将查找可能与要定义的路由碰撞的可能路由。这个测试包括检查路由的路径和方法。

### 使用路径模式创建路由

您可以使用各种 `SetRoute` 方法定义路由。

```cs
// SetRoute 方式
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// Map* 方式
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // 空 200 ok
});

// Route.* 帮助方法
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // StreamContent 内部流在发送响应后被释放
        Content = new StreamContent(imageStream)
    };
});

// 多个参数
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

[RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性的 [HttpResponse](/api/Sisk.Core.Http.HttpRequest) 包含有关请求路径变量的所有信息。

每个发送到服务器的路径在执行路径模式测试之前都会被规范化，遵循以下规则：

- 所有空段都从路径中删除，例如：`////foo//bar` 变为 `/foo/bar`。
- 路径匹配是 **区分大小写** 的，除非 [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) 设置为 `true`。

[Query](/api/Sisk.Core.Http.HttpRequest.Query) 和 [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性的 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 返回一个 [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection) 对象，其中每个索引属性返回一个非空 [StringValue](/api/Sisk.Core.Entity.StringValue)，可以用作一个选项/单子来将其原始值转换为一个托管对象。

以下示例读取路由参数“id”并从中获取一个 `Guid`。如果参数不是有效的 Guid，抛出一个异常，并在服务器不处理 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) 时返回 500 错误给客户端。

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> 路径的尾部 `/` 在请求路径和路由路径中都会被忽略，即，如果您尝试访问定义为 `/index/page` 的路由，您也可以使用 `/index/page/` 来访问。
>
> 您还可以通过启用 [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash) 标志来强制 URL 以 `/` 结尾。

### 使用类实例创建路由

您还可以使用反射和 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 属性动态定义路由。这样，具有此属性的类的实例将在目标路由器中定义其路由。

要将方法定义为路由，它必须用 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 标记，例如该属性本身或 [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute)。该方法可以是静态的、实例的、公共的或私有的。当使用 `SetObject(type)` 或 `SetObject<TType>()` 方法时，实例方法将被忽略。

```cs
public class MyController
{
    // 将匹配 GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }

    // 静态方法也可以
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

以下行将定义 `MyController` 类的 `Index` 和 `Hello` 方法作为路由，因为它们都被标记为路由，并且提供了类的实例，而不是其类型。如果提供的是其类型而不是实例，则仅定义静态方法。

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

从 Sisk 0.16 版开始，可以启用 AutoScan，它将搜索实现 `RouterModule` 的用户定义类，并将其自动关联到路由器。这不支持 AOT 编译。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上述指令将搜索所有实现 `ApiController` 的类型，但不包括该类型本身。两个可选参数指示方法将如何搜索这些类型。第一个参数表示将在其中搜索类型的程序集，第二个参数表示类型将被定义的方式。

## 正则路由

您可以将路由标记为使用正则表达式来解释，而不是使用默认的 HTTP 路径匹配方法。

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

或者使用 [RegexRoute](/api/Sisk.Core.Routing.RegexRoute) 类：

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
});
mainRouter.SetRoute(indexRoute);
```

您还可以从正则表达式模式中捕获组到 [Request.Query](/api/Sisk.Core.Http.HttpRequest.Query) 内容中：

```cs
[RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
static HttpResponse RegexRoute(HttpRequest request)
{
    string filename = request.Query["filename"].GetString();
    return new HttpResponse().WithContent($"Acessing file {filename}");
}
```

## 任意方法路由

您可以定义一个路由，以便仅通过其路径匹配，并跳过 HTTP 方法。这可以用于在路由回调内部执行方法验证。

```cs
// 将匹配 / 的任何 HTTP 方法
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## 任意路径路由

任意路径路由测试从 HTTP 服务器接收的任何路径，受路由方法的约束。如果路由方法是 RouteMethod.Any，并且路由在其路径表达式中使用 [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath)，则此路由将监听所有 HTTP 服务器请求，并且不能定义其他路由。

```cs
// 下面的路由将匹配所有 POST 请求
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 忽略大小写路由匹配

默认情况下，路由与请求的解释是区分大小写的。要使其忽略大小写，请启用此选项：

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

这也将为使用正则表达式匹配的路由启用 `RegexOptions.IgnoreCase` 选项。

## 未找到（404）回调处理程序

您可以为没有匹配任何已知路由的请求创建一个自定义回调。

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // 自 v0.14 起
        Content = new HtmlContent("<h1>Not found</h1>")
        // 旧版本
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## 方法不允许（405）回调处理程序

您还可以为匹配其路径但不匹配方法的请求创建一个自定义回调。

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## 内部错误处理程序

路由回调可以在服务器执行期间抛出错误。如果不正确处理，可能会终止 HTTP 服务器的整体功能。路由器具有一个回调，当路由回调失败时调用，以防止服务中断。

此方法仅在 [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) 设置为 `false` 时可访问。

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```