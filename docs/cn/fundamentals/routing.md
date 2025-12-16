# 路由

[Router](/api/Sisk.Core.Routing.Router) 是构建服务器的第一步。它负责存储 [Route](/api/Sisk.Core.Routing.Route) 对象，这些对象是将 URL 和其方法映射到服务器执行的操作的端点。每个操作负责接收请求并将响应交付给客户端。

路由是路径表达式（“路径模式”）和它们可以监听的 HTTP 方法的对。当请求发送到服务器时，它将尝试找到一个与接收到的请求匹配的路由，然后调用该路由的操作并将结果响应交付给客户端。

在 Sisk 中，有多种方式来定义路由：它们可以是静态的、动态的或自动扫描的，可以使用属性定义，也可以直接在 Router 对象中定义。

```cs
Router mainRouter = new Router();

// 将 GET / 路由映射到以下操作
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

为了理解路由可以做什么，我们需要了解请求可以做什么。一个 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 将包含您需要的所有内容。Sisk 还包括一些额外的功能，可以加快整体开发速度。

对于服务器接收到的每个操作，都会调用一个类型为 [RouteAction](/api/Sisk.Core.Routing.RouteAction) 的委托。这个委托包含一个参数，持有一个 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 对象，该对象包含有关请求的所有必要信息。从这个委托返回的对象必须是 [HttpResponse](/api/Sisk.Core.Http.HttpResponse) 或通过 [隐式响应类型](/docs/cn/fundamentals/responses#implicit-response-types) 映射到它的对象。

## 匹配路由

当请求发送到 HTTP 服务器时，Sisk 搜索一个满足请求路径表达式的路由。该表达式始终在路由和请求路径之间进行测试，而不考虑查询字符串。

此测试没有优先级，并且仅限于单个路由。当没有路由与该请求匹配时，返回 [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) 响应给客户端。当路径模式匹配，但 HTTP 方法不匹配时，返回 [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) 响应给客户端。

Sisk 检查路由碰撞的可能性，以避免这些问题。当定义路由时，Sisk 将查找可能与正在定义的路由碰撞的可能路由。该测试包括检查路由设置为接受的路径和方法。

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
        // StreamContent 内部
        // 流在发送响应后被释放。
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

[RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性的 HttpResponse 包含有关请求路径变量的所有信息。

每个发送到服务器的路径在执行路径模式测试之前都会被规范化，遵循以下规则：

- 所有空段都从路径中删除，例如：`////foo//bar` 变为 `/foo/bar`。
- 路径匹配是 **区分大小写** 的，除非 [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) 设置为 `true`。

[Query](/api/Sisk.Core.Http.HttpRequest.Query) 和 [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性的 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 返回一个 [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection) 对象，其中每个索引属性返回一个非空 [StringValue](/api/Sisk.Core.Entity.StringValue)，可以用作选项/单子将其原始值转换为托管对象。

以下示例读取路由参数“id”并从中获取一个 `Guid`。如果参数不是有效的 Guid，抛出异常，并在服务器不处理 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) 时返回 500 错误给客户端。

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> 路径的尾部 `/` 在请求路径和路由路径中都被忽略，即，如果您尝试访问定义为 `/index/page` 的路由，您也可以使用 `/index/page/` 访问它。
>
> 您还可以强制 URL 以 `/` 结尾，方法是启用 [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash) 标志。

### 使用类实例创建路由

您还可以使用带有 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 属性的反射动态定义路由。这样，具有此属性的类的实例将在目标路由器中定义其路由。

要将方法定义为路由，它必须用 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 标记，例如该属性本身或 [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute)。方法可以是静态的、实例的、公共的或私有的。当使用 `SetObject(type)` 或 `SetObject<TType>()` 方法时，实例方法将被忽略。

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

以下行将定义 `MyController` 的 `Index` 和 `Hello` 方法作为路由，因为它们都被标记为路由，并且提供了类的实例，而不是其类型。如果提供的是类型而不是实例，则仅定义静态方法。

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

从 Sisk 0.16 版开始，可以启用 AutoScan，它将搜索实现 `RouterModule` 的用户定义类，并将其自动关联到路由器。这不支持 AOT 编译。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上述指令将搜索所有实现 `ApiController` 的类型，但不包括类型本身。两个可选参数指示方法将如何搜索这些类型。第一个参数表示将在其中搜索类型的程序集，第二个参数表示定义类型的方式。

## 正则路由

您可以将路由标记为使用正则表达式进行解释，而不是使用默认的 HTTP 路径匹配方法。

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

或者使用 [RegexRoute](/api/Sisk.Core.Routing.RegexRoute) 类：

```cs
mainRouter.SetRoute(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

您还可以从正则表达式模式中捕获组到 [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 内容中：

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
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## 路由前缀

您可以使用 [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) 属性为类或模块中的所有路由添加前缀，并将前缀设置为字符串。

请参阅以下使用 BREAD 架构（浏览、读取、编辑、添加和删除）的示例：

<div class="script-header">
    <span>
        Controller/Api/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users/<id>
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

在上面的示例中，HttpResponse 参数已省略，以便通过全局上下文 [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) 使用。请参阅下一节以获取更多信息。

## 无请求参数的路由

路由可以在不需要 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 参数的情况下定义，并且仍然可以在请求上下文中获取请求及其组件。让我们考虑一个 `ControllerBase` 抽象，它作为 API 的所有控制器的基础，并且该抽象提供 `Request` 属性来获取当前的 [HttpRequest](/api/Sisk.Core.Http.HttpRequest)。

<div class="script-header">
    <span>
        Controller/ControllerBase.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public abstract class ControllerBase
{
    // 从当前线程获取请求
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // 下面的行从当前 HTTP 会话获取数据库，如果不存在则创建一个新数据库
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

并且所有其后代都可以使用不带请求参数的路由语法：

<div class="script-header">
    <span>
        Controller/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // 从当前请求读取 JSON 数据
        UserCreationDto? user = JsonSerializer.DeserializeAsync<UserCreationDto>(Request.Body);
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

有关当前上下文和依赖注入的更多详细信息，请参阅 [依赖注入](/docs/cn/features/instancing) 教程。

## 任意方法路由

您可以定义一个路由，使其仅通过其路径匹配，并跳过 HTTP 方法。这对于在路由回调内部执行方法验证可能很有用。

```cs
// 将匹配任何 HTTP 方法的 /
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## 任意路径路由

任意路径路由测试所有发送到 HTTP 服务器的路径，subject 到路由方法被测试。如果路由方法是 RouteMethod.Any 且路由在其路径表达式中使用 [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath)，则此路由将监听所有发送到 HTTP 服务器的请求，并且不能定义其他路由。

```cs
// 下面的路由将匹配所有 POST 请求
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 忽略路由匹配大小写

默认情况下，路由的解释与请求是区分大小写的。要使其忽略大小写，请启用此选项：

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

这也将为使用正则表达式匹配的路由启用 `RegexOptions.IgnoreCase` 选项。

## 未找到（404）回调处理程序

您可以为找不到任何已知路由的请求创建一个自定义回调。

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // 自 0.14 版以来
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

路由回调可以在服务器执行期间抛出错误。如果不正确处理，可能会终止 HTTP 服务器的整体功能。路由器具有一个回调，当路由回调失败并防止服务中断时将被调用。

此方法仅在 [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) 设置为 false 时可访问。

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```