# 根据请求实例化成员

通常，会为请求的生命周期分配成员和实例，例如数据库连接、已验证的用户或会话令牌。一种可能性是通过 [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext)，它创建一个在整个请求生命周期内有效的字典。

此字典可由 [请求处理程序](/docs/fundamentals/request-handlers) 访问，并在整个请求中定义变量。例如，一个验证用户请求处理程序将此用户设置到 `HttpContext.RequestBag` 中，并且在请求逻辑中，可以使用 `HttpContext.RequestBag.Get<User>()` 获取此用户。

以下是一个示例：

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // 继续到下一个请求处理程序或请求逻辑
    }
}

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

这是一个此操作的初步示例。`User` 的实例是在专门用于身份验证的请求处理程序中创建的，并且使用此请求处理程序的所有路由都将保证它们在 `HttpContext.RequestBag` 的实例中将有一个 `User`。

可以通过类似于 [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) 或 [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync) 的方法，在 `RequestBag` 中未先前定义的情况下定义获取实例的逻辑。

从版本 1.3 开始，引入了静态属性 [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current)，允许访问正在执行的请求上下文的当前 `HttpContext`。这使得可以在请求上下文之外公开 `HttpContext` 的成员，并在路由对象中定义实例。

以下示例定义了一个控制器，该控制器具有请求上下文通常访问的成员。

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // 创建 DbContext 或获取现有 DbContext
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // 如果在请求袋中未定义用户，则访问此属性将引发异常
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // 支持公开 HttpRequest 实例
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

并定义继承自控制器的类型：

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

对于上述示例，您需要在路由器中配置 [值处理程序](/docs/fundamentals/responses.html#implicit-response-types)，以便路由器返回的对象被转换为有效的 [HttpResponse](/api/Sisk.Core.Http.HttpResponse)。

请注意，这些方法没有像其他方法中那样包含 `HttpRequest request` 参数。这是因为从版本 1.3 开始，路由器支持两种类型的委托用于路由响应：[RouteAction](/api/Sisk.Core.Routing.RouteAction)，这是默认的委托，它接收 `HttpRequest` 参数，以及 [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction)。可以通过线程上的静态 `HttpContext` 的 `Request` 属性通过两个委托访问 `HttpRequest` 对象。

在上述示例中，我们定义了一个可释放对象 `DbContext`，我们需要确保在 HTTP 会话结束时释放所有在 `DbContext` 中创建的实例。为此，我们可以使用两种方法来实现这一点。一种方法是在路由器操作之后执行的请求处理程序，另一种方法是通过自定义 [服务器处理程序](/docs/advanced/http-server-handlers)。

对于第一种方法，我们可以直接在 `RouterModule` 继承的 `OnSetup` 方法中创建请求处理程序：

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
                // 获取在请求处理程序上下文中定义的 DbContext，并释放它
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

上述方法将确保在 HTTP 会话最终结束时释放 `DbContext`。您可以为需要在响应结束时释放的更多成员执行此操作。

对于第二种方法，您可以创建一个自定义 [服务器处理程序](/docs/advanced/http-server-handlers) 来释放 `DbContext`，当 HTTP 会话最终结束时。

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

并在构建器中使用它：

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

这是处理代码清理并通过将请求的依赖项与将使用的模块类型分开的方式来实现的，从而减少了路由器每个操作中的重复代码量。这是一种类似于 ASP.NET 等框架中依赖注入所使用的实践。