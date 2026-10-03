# Http server handlers

Source: https://docs.sisk-framework.org/zh-cn/docs/advanced/http-server-handlers.html

在 Sisk 0.16 版本中，我们引入了 `HttpServerHandler` 类，旨在扩展 Sisk 的整体行为并为 Sisk 提供额外的事件处理程序，例如处理 Http 请求、路由、上下文袋等。

该类集中处理整个 HTTP 服务器以及单个请求生命周期中发生的事件。Http 协议没有会话概念，因此无法在请求之间保留信息。Sisk 目前提供了一种方式，让您实现会话、上下文、数据库连接以及其他有用的提供程序，以帮助您的工作。

请参阅 [此页面](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) 了解每个事件的触发时机及其目的。您也可以查看 [HTTP 请求的生命周期](https://docs.sisk-framework.org/zh-cn/docs/advanced/request-lifecycle.md) 以了解请求的处理过程以及事件的触发位置。HTTP 服务器允许您同时使用多个处理程序。每次事件调用都是同步的，即它会阻塞当前线程，直至与该函数关联的所有处理程序执行完毕。

与 RequestHandlers 不同，它们不能应用于某些路由组或特定路由，而是作用于整个 HTTP 服务器。您可以在 Http Server Handler 中添加条件。此外，每个 Sisk 应用程序只会为每个 `HttpServerHandler` 定义一个单例，因此每种 `HttpServerHandler` 只会有一个实例。

使用 HttpServerHandler 的一个实际例子是：在请求结束时自动释放数据库连接。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // 检查请求的上下文袋中是否已定义 DbContext
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

有了上述代码，`GetDbContext` 扩展方法允许直接从 `HttpRequest` 对象创建连接上下文。未释放的连接在使用数据库时可能导致问题，因此在 `OnHttpRequestClose` 中将其终止。

您可以在构建器中或直接使用 [HttpServer.RegisterHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md) 在 Http 服务器上注册处理程序。

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

这样，`UsersController` 类即可像下面这样使用数据库上下文：

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("用户已添加。");
    }
}
```

上述代码使用了 `JsonOk` 和 `JsonMessage` 方法，这些方法内置于 `ApiController`，而 `ApiController` 继承自 `RouterController`：

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

开发者可以使用此类实现会话、上下文和数据库连接。提供的代码展示了一个使用 `DatabaseConnectionHandler` 的实用示例，在每个请求结束时自动释放数据库连接。

集成非常简便，只需在服务器设置期间注册处理程序。`HttpServerHandler` 类为在 HTTP 应用中管理资源和扩展 Sisk 行为提供了强大的工具集。
