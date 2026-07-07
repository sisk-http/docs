# 路由

The [Router](/api/Sisk.Core.Routing.Router) 是构建服务器的第一步。它负责保存 [Route](/api/Sisk.Core.Routing.Route) 对象，这些对象是将 URL 及其方法映射到服务器执行的操作的端点。每个操作负责接收请求并向客户端返回响应。

路由是路径表达式（“路径模式”）与它们可以监听的 HTTP 方法的配对。当向服务器发出请求时，服务器会尝试找到匹配该请求的路由，然后调用该路由的操作并将产生的响应返回给客户端。

在 Sisk 中定义路由有多种方式：可以是静态的、动态的或自动扫描的，使用属性定义，或直接在 Router 对象中定义。

```cs
Router mainRouter = new Router();

// 将 GET / 路由映射到以下操作
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

要了解路由能够做什么，需要先了解请求能够做什么。一个 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 包含了你所需的一切。Sisk 还提供了一些额外功能，以加快整体开发。

对于服务器接收到的每个操作，都会调用类型为 [RouteAction](/api/Sisk.Core.Routing.RouteAction) 的委托。该委托包含一个参数，持有一个包含所有关于服务器接收的请求的必要信息的 [HttpRequest](/api/Sisk.Core.Http.HttpRequest)。该委托返回的对象必须是 [HttpResponse](/api/Sisk.Core.Http.HttpResponse) 或通过 [implicit response types](/docs/cn/fundamentals/responses#implicit-response-types) 映射到它的对象。

## 匹配路由

当 HTTP 服务器收到请求时，Sisk 会搜索满足请求路径表达式的路由。该表达式始终在路由和请求路径之间进行测试，不考虑查询字符串。

此测试没有优先级，并且仅针对单一路由。当没有路由与该请求匹配时，返回 [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) 响应给客户端。当路径模式匹配但 HTTP 方法不匹配时，返回 [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) 响应给客户端。

Sisk 会检查路由冲突的可能性以避免这些问题。定义路由时，Sisk 会查找可能与正在定义的路由冲突的路由。此测试包括检查路径和路由设置接受的方法。

### 使用路径模式创建路由

对于新应用，优先使用 `Map*` 方法。它们在调用点保持 HTTP 方法可见，并匹配当前的 `Router` API。较旧的 `SetRoute` 方法仍作为兼容包装存在，但新示例应使用 `Map`、`MapGet`、`MapPost`、`MapPut`、`MapDelete`、`MapPatch`、`MapAny`、`MapOptions` 或 `MapHead`。

```cs
// Map* 方法是定义特定 HTTP 方法路由的常用方式。
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // 空的 200 OK
});

// 当需要路由选项时，Map 也可以接收 Route 实例。
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // StreamContent 内部
        // 流在发送后会被释放
        // 响应。
        Content = new StreamContent(imageStream)
    };
}));

// 多个参数
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

[RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性包含了收到请求的路径变量的所有信息。

服务器接收到的每个路径在执行路径模式测试之前都会被规范化，遵循以下规则：

- 所有空的路径段都会被移除，例如：`////foo//bar` 会变成 `/foo/bar`。
- 路径匹配是**区分大小写**的，除非 [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) 被设置为 `true`。

[Query](/api/Sisk.Core.Http.HttpRequest.Query) 和 [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 属性返回一个 [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection) 对象，其中每个索引属性返回一个非空的 [StringValue](/api/Sisk.Core.Entity.StringValue)，可用作 option/monad 将其原始值转换为受管理的对象。

下面的示例读取路由参数 “id” 并从中获取一个 `Guid`。如果参数不是有效的 Guid，则会抛出异常；如果服务器未处理 [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler)，则会向客户端返回 500 错误。

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> 路径的尾部 `/` 在请求和路由路径中都会被忽略，也就是说，如果你尝试访问定义为 `/index/page` 的路由，也可以使用 `/index/page/` 进行访问。
>
> 你也可以通过启用 [HttpServerConfiguration.ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash) 来强制 URL 以 `/` 结尾。

### 使用类实例创建路由

你也可以使用属性 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 通过反射动态定义路由。这样，类的实例中实现了该属性的方法将在目标路由器中定义其路由。

要将方法定义为路由，必须使用 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) 标记，例如该属性本身或 [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute)。方法可以是 static、实例、public 或 private。需要从对象映射实例和静态路由方法时使用 `MapInstance`。只想从类型映射静态路由方法时使用 `MapType`。

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
    
    // 静态方法也适用
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

下面的代码会将 `MyController` 的 `Index` 和 `Hello` 方法都定义为路由，因为两者都被标记为路由，并且提供了类的实例而不是类型。如果提供的是类型，则只会定义静态方法。

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

若只想映射类型的静态路由方法，使用：

```cs
mainRouter.MapType<MyController>();
```

自 Sisk 0.16 版本起，可以启用 AutoScan，自动搜索实现 `RouterModule` 的用户自定义类并将其自动关联到路由器。AOT 编译不支持此功能。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上述指令会搜索所有实现 `ApiController` 的类型，但**不包括该类型本身**。两个可选参数指示该方法如何搜索这些类型。第一个参数表示搜索这些类型的程序集，第二个参数指示这些类型的定义方式。

## 正则路由

如果不想使用默认的 HTTP 路径匹配方法，可以将路由标记为使用正则表达式解释。

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

或使用 [RegexRoute](/api/Sisk.Core.Routing.RegexRoute) 类：

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

你还可以将正则模式中的捕获组写入 [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) 内容：

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

## 前缀路由

你可以使用 [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) 属性为类或模块中的所有路由添加前缀，并将前缀设为字符串。

下面的示例使用 BREAD 架构（Browse、Read、Edit、Add 和 Delete）：

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
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
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

在上述示例中，省略了 HttpResponse 参数，转而通过全局上下文 [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) 使用。更多内容请参见下节。

## 没有请求参数的路由

路由可以在没有 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) 参数的情况下定义，并仍然能够在请求上下文中获取请求及其组件。这里考虑一个抽象类 `ControllerBase`，它作为 API 所有控制器的基础，并提供 `Request` 属性以获取当前的 [HttpRequest]。

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
    
    // 以下代码在调用时，从当前 HTTP 会话获取数据库，若不存在则创建一个新的
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

并让所有子类能够在不传入请求参数的情况下使用路由语法：

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
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

更多关于当前上下文和依赖注入的细节，请参见 [dependency injection](/docs/cn/features/instancing) 教程。

## 任意方法路由

你可以定义仅通过路径匹配而跳过 HTTP 方法的路由。这在路由回调内部进行方法验证时非常有用。

```cs
// 将匹配任意 HTTP 方法的 /
mainRouter.MapAny("/", callbackFunction);
```

## 任意路径路由

任意路径路由会测试 HTTP 服务器收到的任何路径，前提是路由方法也被测试。如果路由方法是 `RouteMethod.Any` 且路由在路径表达式中使用了 [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath)，则该路由将监听 HTTP 服务器的所有请求，且不能再定义其他路由。

```cs
// 以下路由将匹配所有 POST 请求
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 忽略大小写的路由匹配

默认情况下，路由与请求的解释是区分大小写的。要使其忽略大小写，请启用此选项：

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

这也会为使用正则匹配的路由启用 `RegexOptions.IgnoreCase` 选项。

## 未找到 (404) 回调处理程序

你可以为请求未匹配到任何已知路由时创建自定义回调。

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

## 方法不允许 (405) 回调处理程序

你也可以为请求匹配路径但不匹配方法时创建自定义回调。

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## 错误处理

在请求生命周期内（从前置执行请求处理程序、通过路由操作、到后置执行请求处理程序和数值处理程序）可能会抛出异常。这些异常由以下机制管理：

- 如果 [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) 为 `true`，异常会正常抛出且不会被 Sisk 捕获，如果异常未被捕获，HTTP 服务器可能会中断。
- 如果 [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) 为 `false`，异常会被 Sisk 捕获并处理。随后，如果已定义 `Router.CallbackErrorHandler`，它将使用捕获的异常和请求上下文被调用，并且**不会**转发到标准错误输出。如果未定义 `Router.CallbackErrorHandler`，异常将转发到标准错误输出，客户端将收到 HTTP 500 错误响应。如果未定义标准错误输出，错误将被静默忽略。

注意：在 `Router.CallbackErrorHandler` 中，你可以设置错误日志、访问日志、两者或都不记录的日志模式，并修改默认的日志写入行为：

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // 覆盖日志模式，使错误同时记录在访问日志和错误日志中
}
```

## 内部错误处理程序

路由回调在服务器执行期间可能抛出错误。如果未正确处理，HTTP 服务器的整体功能可能会被终止。路由器提供了一个回调，用于在路由回调失败时防止服务中断。

此方法仅在 [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) 设置为 false 时可达。

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```