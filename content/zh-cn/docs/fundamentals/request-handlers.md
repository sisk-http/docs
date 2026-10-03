---
title: "请求处理"
linkTitle: "请求处理程序"
weight: 20
aliases:
  - "/docs/cn/fundamentals/request-handlers.html"
sourceHash: "77d35afbd210c7a6"
---

请求处理程序，也称为“中间件”，是在路由器上执行请求之前或之后运行的函数。它们可以在每个路由或每个路由器上定义。

请求处理程序有两种类型：

- **BeforeResponse**：定义请求处理程序将在调用路由器操作之前执行。
- **AfterResponse**：定义请求处理程序将在调用路由器操作之后执行。在此上下文中发送 HTTP 响应将覆盖路由器的操作响应。

两种请求处理程序都可以覆盖实际的路由器回调函数响应。顺便说一下，请求处理程序可用于验证请求，例如身份验证、内容或任何其他信息，如存储信息、日志或其他可在响应前后执行的步骤。

![](/assets/img/requesthandlers1.png)

通过这种方式，请求处理程序可以中断所有执行并在完成循环之前返回响应，丢弃过程中的其他所有内容。

示例：假设用户身份验证请求处理程序未对其进行身份验证。它将阻止请求生命周期继续并导致挂起。如果这种情况发生在第二个位置的请求处理程序中，则第三个及之后的处理程序将不会被评估。

![](/assets/img/requesthandlers2.png)

## 创建请求处理程序

要创建请求处理程序，我们可以创建一个继承 [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) 接口的类，格式如下：

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // 返回 null 表示请求循环可以继续
            return null;
        }
        else
        {
            // 返回 HttpResponse 对象表示此响应将覆盖相邻的响应。
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

在上面的示例中，我们指出如果请求中存在 `Authorization` 头部，则应继续执行，下一个请求处理程序或路由器回调将被调用，以后者为准。如果请求处理程序通过其属性 [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) 在响应之后执行并返回非 null 值，它将覆盖路由器的响应。

每当请求处理程序返回 `null` 时，表示请求必须继续，调用下一个对象，或循环以路由器的响应结束。

如果你继承内置的 [RequestHandler](/api/Sisk.Core.Routing.RequestHandler) 类，可以返回 `Next()` 来明确表达此意图：

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

对于需要 I/O 的处理程序，继承自 [AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler)：

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

也可以使用 `RequestHandler.Create` 或 `AsyncRequestHandler.Create` 创建小型内联处理程序：

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## 将请求处理程序关联到单个路由

你可以为路由定义一个或多个请求处理程序。

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

或者创建一个 [Route](/api/Sisk.Core.Routing.Route) 对象：

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## 将请求处理程序关联到路由器

你可以定义一个全局请求处理程序，它将在路由器的所有路由上运行。

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## 将请求处理程序关联到属性

你可以在方法属性上与路由属性一起定义请求处理程序。

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

请注意，需要传递所需的请求处理程序类型，而不是对象实例。这样，请求处理程序将由路由器解析器实例化。你可以使用 [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) 属性在类构造函数中传递参数。

示例：

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

你也可以创建实现 RequestHandler 的自定义属性：

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

并像下面这样使用：

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## 绕过全局请求处理程序

在路由上定义全局请求处理程序后，你可以在特定路由上忽略此请求处理程序。

```cs {title="Router.cs"}
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: the same instance of what is in the global request handlers
    new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> 如果要绕过请求处理程序，必须使用之前实例化的相同引用来跳过。创建另一个请求处理程序实例将不会跳过全局请求处理程序，因为其引用会改变。请记住在 GlobalRequestHandlers 和 BypassGlobalRequestHandlers 中使用相同的请求处理程序引用。
