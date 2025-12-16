# HTTP 服务器处理程序

在 Sisk 0.16 版本中，我们引入了 `HttpServerHandler` 类，旨在扩展 Sisk 的整体行为，并为 Sisk 提供额外的事件处理程序，例如处理 HTTP 请求、路由器、上下文包等。

该类集中了整个 HTTP 服务器和请求的生命周期中发生的事件。HTTP 协议没有会话，因此无法在请求之间保留信息。Sisk 目前提供了一种方式，允许您实现会话、上下文、数据库连接和其他有用的提供程序，以帮助您的工作。

请参阅 [此页面](/api/Sisk.Core.Http.Handlers.HttpServerHandler) 以了解每个事件的触发位置和其目的。你也可以查看 [HTTP 请求的生命周期](/v1/advanced/request-lifecycle) 以了解请求发生了什么以及事件在哪里触发。HTTP 服务器允许你同时使用多个处理程序。每个事件调用都是同步的，即它将阻塞当前线程，直到与该函数关联的所有处理程序执行并完成。

与 RequestHandlers 不同，它们不能应用于某些路由组或特定路由。相反，它们应用于整个 HTTP 服务器。你可以在你的 HTTP 服务器处理程序中应用条件。此外，每个 Sisk 应用程序都定义了每个 HttpServerHandler 的单例，因此每个 `HttpServerHandler` 只有一个实例。

使用 HttpServerHandler 的一个实用示例是自动在请求结束时释放数据库连接。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // 检查请求是否在其上下文包中定义了 DbContext
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // 允许用户从 HTTP 请求创建 DbContext 并将其存储在其请求包中
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

上面的代码中，`GetDbContext` 扩展方法允许直接从 HttpRequest 对象创建连接上下文并将其存储在其请求包中。未释放的连接可能会在运行数据库时引起问题，因此在 `OnHttpRequestClose` 中终止它。

你可以在你的构建器中或直接使用 [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler) 注册处理程序到 HTTP 服务器。

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

这样，`UsersController` 类就可以使用数据库上下文：

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

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("User added.");
    }
}
```

上面的代码使用了 `JsonOk` 和 `JsonMessage` 方法，这些方法内置于 `ApiController` 中，后者继承自 `RouterController`：

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

开发人员可以使用此类实现会话、上下文和数据库连接。提供的代码展示了一个使用 DatabaseConnectionHandler 的实用示例，自动在每个请求结束时释放数据库连接。

集成非常简单，处理程序在服务器设置期间注册。HttpServerHandler 类提供了一个强大的工具集，用于在 HTTP 应用程序中管理资源和扩展 Sisk 行为。