# 依赖注入

通常，会为请求的生命周期内持续存在的成员和实例分配内存，例如数据库连接、已验证的用户或会话令牌。实现这一点的一种可能方法是通过 [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext) ，它创建一个在整个请求生命周期内持续存在的字典。

该字典可以被 [请求处理程序](/docs/fundamentals/request-handlers) 访问，并在整个请求过程中定义变量。例如，验证用户的请求处理程序将用户设置在 `HttpContext.RequestBag` 中，在请求逻辑中，可以通过 `HttpContext.RequestBag.Get<User>()` 来检索该用户。

以下是一个示例：

<div class="script-header">
    <span>
        RequestHandlers/AuthenticateUser.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // advance to the next request handler or request logic
    }
}
```

<div class="script-header">
    <span>
        Controllers/HelloController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public static HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
```

这是对此操作的初步示例。`User` 实例是在专门用于身份验证的请求处理程序中创建的，并且所有使用此请求处理程序的路由都保证在其 `HttpContext.RequestBag` 实例中将有一个 `User`。

可以通过诸如 [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) 或 [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync) 之类的方法来定义获取实例的逻辑，当实例尚未在 `RequestBag` 中定义时。

从 1.3 版本开始，引入了静态属性 [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) ，允许访问当前执行的 `HttpContext` 的请求上下文。这使得可以在当前请求之外暴露 `HttpContext` 的成员，并在路由对象中定义实例。

以下示例定义了一个控制器，该控制器具有通常由请求上下文访问的成员。

<div class="script-header">
    <span>
        Controllers/Controller.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // 创建一个 DbContext 或获取现有的一个
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // 如果属性在请求包中没有定义 User 时访问，将抛出异常
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // 也支持暴露 HttpRequest 实例
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

并定义继承自控制器的类型：

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts")]
public class PostsController : Controller
{
    [RouteGet]
    public IEnumerable<Blog> ListPosts()
    {
        return Database.Posts
            .Where(post => post.AuthorId == AuthenticatedUser.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthenticatedUser.Id);

        return post ?? new HttpResponse(404);
    }
}
```

对于上面的示例，您需要在路由器中配置一个 [值处理程序](/docs/fundamentals/responses.html#implicit-response-types) ，以便路由器返回的对象转换为有效的 [HttpResponse](/api/Sisk.Core.Http.HttpResponse)。

请注意，方法不带有 `HttpRequest request` 参数，如其他方法中所示。这是因为，从 1.3 版本开始，路由器支持两种类型的委托用于路由响应：[RouteAction](/api/Sisk.Core.Routing.RouteAction) ，这是默认的委托，它接收一个 `HttpRequest` 参数，以及 [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction) 。`HttpRequest` 对象仍然可以通过静态 `HttpContext` 的 [Request](/api/Sisk.Core.Http.HttpContext.Request) 属性访问。

在上面的示例中，我们定义了一个可处置对象 `DbContext` ，并且我们需要确保在 HTTP 会话结束时处置所有在 `DbContext` 中创建的实例。为此，我们可以使用两种方法来实现这一点。一种方法是创建一个在路由器操作之后执行的 [请求处理程序](/docs/fundamentals/request-handlers) ，另一种方法是通过自定义 [服务器处理程序](/docs/advanced/http-server-handlers)。

对于第一种方法，我们可以直接在继承自 `RouterModule` 的 [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) 方法中内联创建请求处理程序：

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // 获取请求处理程序上下文中定义的 DbContext 并处置它
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> 从 Sisk 1.4 版本开始，引入了属性 [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) ，它默认启用，用于定义 HTTP 服务器是否应在 HTTP 会话关闭时处置上下文包中的所有 `IDisposable` 值。

上述方法将确保在 HTTP 会话结束时处置 `DbContext`。您可以为需要在响应结束时处置的其他成员执行此操作。

对于第二种方法，您可以创建一个自定义的 [服务器处理程序](/docs/advanced/http-server-handlers) ，它将在 HTTP 会话结束时处置 `DbContext`。

<div class="script-header">
    <span>
        Server/Handlers/ObjectDisposerHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

并在应用程序生成器中使用它：

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

这是处理代码清理并将请求的依赖项与将使用的模块类型分离的一种方法，减少了路由器操作中重复的代码量。这是一种类似于在 ASP.NET 等框架中使用依赖注入的做法。