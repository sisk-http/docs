在Sisk版本0.16中，我们引入了`HttpServerHandler`类，旨在扩展整体Sisk的行为，并为Sisk提供额外的事件处理程序，例如处理Http请求、路由器、上下文袋等。

该类集中处理HTTP服务器及其请求生命周期中发生的事件。HTTP协议没有会话，因此无法在一次请求到另一次请求之间保留信息。Sisk目前提供了一种方法，您可以实现会话、上下文、数据库连接和其他有用的提供程序，以帮助您的工作。

请参考[此页面](/api/Sisk.Core.Http.Handlers.HttpServerHandler)以了解每个事件何时触发以及其用途。您还可以查看[HTTP请求的生命周期](/v1/advanced/request-lifecycle)以了解请求的发生过程以及事件何时触发。HTTP服务器允许您同时使用多个处理程序。每个事件调用都是同步的，也就是说，它将阻塞当前线程，直到与该函数关联的所有处理程序都执行完毕。

与RequestHandler不同，它们不能应用于某些路由组或特定路由。而是应用于整个HTTP服务器。您可以在Http Server Handler中应用条件。此外，每个Sisk应用程序都定义了每个HttpServerHandler的单例，因此每个`HttpServerHandler`只定义一个实例。

使用HttpServerHandler的一个实际例子是在请求结束时自动释放数据库连接。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // 检查请求是否在其上下文袋中定义了一个DbContext
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // 允许用户从一个HttpRequest对象创建DbContext
    // 并将其存储在其请求袋中
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

使用上面的代码，`GetDbContext`扩展允许直接从HttpRequest对象创建连接上下文。未释放的连接可能会导致在与数据库运行时出现问题，因此在`OnHttpRequestClose`中将其终止。

您可以在构建器或直接使用[HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler)在Http服务器上注册处理程序。

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

这样，`UsersController`类可以使用数据库上下文：

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

上面的代码使用`JsonOk`和`JsonMessage`等方法，这些方法是继承自`RouterController`的`ApiController`内置的：

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

开发人员可以使用此类实现会话、上下文和数据库连接。提供的代码展示了一个使用DatabaseConnectionHandler的实际例子，自动在每个请求结束时释放数据库连接。

集成非常简单，处理程序在服务器设置期间注册。HttpServerHandler类为管理资源和扩展Sisk HTTP应用程序的行为提供了一个强大的工具集。



