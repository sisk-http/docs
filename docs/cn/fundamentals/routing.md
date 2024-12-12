路由是构建服务器的第一步。它负责容纳路由对象（/api/Sisk.Core.Routing.Route），这些对象是将 URL 和其方法映射到服务器执行的操作的端点。每个操作负责接收请求并向客户端发送响应。

路由是路径表达式（“路径模式”）和它们可以侦听的 HTTP 方法的组合。当向服务器发出请求时，它将尝试找到与接收到的请求匹配的路由，然后它将调用该路由的操作并向客户端发送生成的响应。

在 Sisk 中有多种定义路由的方式：它们可以是静态的、动态的或自动扫描的，由属性定义，也可以直接在路由对象中定义。

```cs
Router mainRouter = new Router();

// 将 GET / 路由映射到以下操作
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

要了解路由的功能，我们需要了解请求的功能。HttpRequest（/api/Sisk.Core.Http.HttpRequest）将包含您需要的所有信息。Sisk 还包含一些加速整体开发的额外功能。

对于服务器接收到的每个操作，将调用类型为 RouteAction（/api/Sisk.Core.Routing.RouteAction）的委托。此委托包含一个参数，其中包含一个 HttpRequest（/api/Sisk.Core.Http.HttpRequest），其中包含有关服务器接收到的请求的所有必要信息。此委托的结果必须是 HttpResponse（/api/Sisk.Core.Http.HttpResponse）或通过隐式响应类型（/docs/fundamentals/responses#implicit-response-types）映射到它的对象。

## 匹配路由

当 HTTP 服务器收到请求时，Sisk 会搜索满足接收到的请求路径表达式的路由。表达式始终在路由和请求路径之间进行测试，而不考虑查询字符串。

此测试没有优先级，并且仅限于单个路由。当没有路由与该请求匹配时，将向客户端返回 Router.NotFoundErrorHandler（/api/Sisk.Core.Routing.Router.NotFoundErrorHandler）响应。当路径模式匹配，但 HTTP 方法不匹配时，将向客户端发送 Router.MethodNotAllowedErrorHandler（/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler）响应。

Sisk 检查路由冲突的可能性以避免这些问题。在定义路由时，Sisk 将查找可能与正在定义的路由发生冲突的可能路由。此测试包括检查路径和路由设置接受的方法。

### 使用路径模式创建路由

您可以使用各种 `SetRoute` 方法定义路由。

```cs
// SetRoute 方式
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) => {
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// Map* 方式
mainRouter.MapGet("/form", (request) => {
    var formData = request.GetFormData();
    return new HttpResponse(); // 空 200 ok
});

// Route.* 助手方法
mainRouter += Route.Get("/image.png", (request) => {
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // streamContent 内的 Stream
        // 在发送响应后会释放
        Content = new StreamContent(imageStream)
    };
});

// 多个参数
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) => {
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

HttpRequest（/api/Sisk.Core.Http.HttpRequest）的 RouteParameters 属性包含有关接收到的请求路径变量的所有信息。

在执行路径模式测试之前，服务器接收到的所有路径都将被标准化，遵循以下规则：

- 从路径中删除所有空段，例如： `////foo//bar` 变为 `/foo/bar`。
- 路径匹配是 **区分大小写的**，除非 Router.MatchRoutesIgnoreCase（/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase）设置为 `true`。

HttpRequest（/api/Sisk.Core.Http.HttpRequest）的 Query 和 RouteParameters 属性返回一个 StringValueCollection（/api/Sisk.Core.Entity.StringValueCollection）对象，其中每个索引属性返回一个非空 StringValue（/api/Sisk.Core.Entity.StringValue），可以将其用作选项/单态来将其原始值转换为托管对象。

以下示例读取路由参数“id”，并从中获取一个 Guid。如果参数不是有效的 Guid，则会抛出异常，并且如果服务器未处理 Router.CallbackErrorHandler（/api/Sisk.Core.Routing.Router.CallbackErrorHandler），则向客户端返回 500 错误。

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) => {
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> 路径在请求和路由路径中都忽略了尾随 `/`，也就是说，如果您尝试访问定义为 `/index/page` 的路由，您也可以使用 `/index/page/` 访问。
>
> 您还可以强制 URL 以 `/` 结尾，方法是启用 [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash) 标志。

### 使用类实例创建路由

您还可以使用反射动态定义路由，并使用带有 `RouteAttribute`（/api/Sisk.Core.Routing.RouteAttribute）属性的类实例。这样，其方法实现此属性的类实例的路由将定义在目标路由器中。

对于方法要被定义为路由，它必须标记为 `RouteAttribute`（/api/Sisk.Core.Routing.RouteAttribute），例如属性本身或 `RouteGetAttribute`（/api/Sisk.Core.Routing.RouteGetAttribute）。该方法可以是静态的、实例的、公共的或私有的。当使用 `SetObject(type)` 或 `SetObject<TType>()` 方法时，将忽略实例方法。

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

    // 静态方法也行
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

以下行将定义 `MyController` 中的 `Index` 和 `Hello` 方法作为路由，因为这两个方法都标记为路由，并且已经提供了类的实例，而不是其类型。如果提供了类型而不是实例，则只会定义静态方法。

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

从 Sisk 版本 0.16 开始，可以启用 AutoScan，它将搜索实现 `RouterModule` 的用户定义类，并自动将其与路由器关联。这在 AOT 编译中不受支持。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上面的指令将搜索实现 `ApiController` 但不是类型本身的所有类型。两个可选参数指示方法将如何搜索这些类型。第一个参数表示搜索这些类型的程序集，第二个参数表示定义这些类型的方式。

## 正则表达式路由

您可以使用正则表达式来匹配路由，而不是使用默认的 HTTP 路径匹配方法。

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

也可以使用 `RegexRoute`（/api/Sisk.Core.Routing.RegexRoute）类：

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))", request => {
    string filename = request.Query["filename"].GetString();
    return new HttpResponse().WithContent($"Acessing file {filename}");
});
mainRouter.SetRoute(indexRoute);
```

您还可以将正则表达式模式中的分组捕获到 `Request.Query`（/api/Sisk.Core.Http.HttpRequest.Query）内容中：

## 任何方法路由

您可以定义一个路由，使其仅匹配其路径，并跳过 HTTP 方法。这对于在路由回调中进行方法验证可能很有用。

```cs
// 将匹配任何 HTTP 方法的 / 路由
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## 任何路径路由

任何路径路由测试接收到的所有请求，subject to the route method being tested. If the route method is RouteMethod.Any and the route uses [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) in its path expression, this route will listen to all requests from the HTTP server, and no other routes can be defined.

```cs
// the following route will match all POST requests
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 忽略大小写路由匹配

默认情况下，路由与请求的解释是区分大小写的。要使其忽略大小写，请启用此选项：

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

这也会为路由启用 `RegexOptions.IgnoreCase` 选项。

## 未找到 (404) 回调处理程序

您可以创建自定义回调，用于处理请求不匹配任何已知路由的情况。

```cs
mainRouter.NotFoundErrorHandler = () => {
    return new HttpResponse(404)
    {
        // 
        Content = new HtmlContent("<h1>Not found</h1>")
        // older versions
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## 方法不允许 (405) 回调处理程序

您还可以创建自定义回调，用于处理请求匹配其路径，但方法不匹配的情况。

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) => {
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.");
};
```

## 内部错误处理程序

路由回调在服务器执行期间可能会抛出错误。如果未正确处理，则可能会导致服务器整体功能中断。路由器有一个回调，用于处理路由回调失败，并防止服务中断。

此方法仅在 `ThrowExceptions` 设置为 `false` 时才可访问。

```cs
mainRouter.CallbackErrorHandler = (ex, context) => {
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}");
};
```



























































































































































































































































































































































































































































































































































```cs












```cs




```cs




```cs




```cs




```cs




```cs
```cs




```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs
```cs