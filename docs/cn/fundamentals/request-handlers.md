# 请求处理

请求处理器，也称为“中间件”，是运行在请求在路由器上执行之前或之后的函数。它们可以为每个路由或每个路由器定义。

请求处理器有两种类型：

- **BeforeResponse**：定义请求处理器将在调用路由器操作之前执行。
- **AfterResponse**：定义请求处理器将在调用路由器操作之后执行。在此上下文中发送 HTTP 响应将覆盖路由器操作的响应。

两种请求处理器都可以覆盖实际路由器回调函数的响应。另外，请求处理器可以用于验证请求，例如身份验证、内容或其他信息，例如存储信息、日志或可以在响应之前或之后执行的其他步骤。

![](/assets/img/requesthandlers1.png)

这样，请求处理器可以中断整个执行过程并在完成周期之前返回响应，丢弃过程中的所有其他内容。

示例：假设用户身份验证请求处理器未能对其进行身份验证。它将防止请求生命周期继续并挂起。如果这发生在第二个请求处理器中，第三个及以后的处理器将不会被评估。

![](/assets/img/requesthandlers2.png)

## 创建请求处理器

要创建请求处理器，我们可以创建一个继承 [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) 接口的类，以以下格式：

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // 返回 null 表示请求周期可以继续
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

在上面的示例中，我们指示如果请求中存在 `Authorization` 标头，则应继续并调用下一个请求处理器或路由器回调，否则将返回未经授权的响应。

每当请求处理器返回 `null` 时，表示请求必须继续并调用下一个对象或以路由器的响应结束周期。

## 将请求处理器与单个路由关联

您可以为路由定义一个或多个请求处理器。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- 方法 IndexPage 将在此处执行
    new WriteToLogRequestHandler()            // after request handler
});
```

或者创建一个 [Route](/api/Sisk.Core.Routing.Route) 对象：

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## 将请求处理器与路由器关联

您可以定义一个全局请求处理器，它将在路由器上的所有路由上运行。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## 将请求处理器与属性关联

您可以将请求处理器定义为方法属性，连同路由属性。

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

请注意，需要传递所需的请求处理器类型，而不是对象实例。这样，请求处理器将由路由器解析器实例化。您可以使用 [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) 属性传递类构造函数的参数。

示例：

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

您还可以创建自己的属性，它实现了 RequestHandler：

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

并将其用作：

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## 跳过全局请求处理器

在路由器上定义全局请求处理器后，您可以在特定路由上忽略此请求处理器。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: 与全局请求处理器中相同的实例
        new AuthenticateUserRequestHandler() // wrong: 不会跳过全局请求处理器
    }
});
```

> [!NOTE]
> 如果您要跳过请求处理器，则必须使用与之前实例化的相同的引用来跳过。创建另一个请求处理器实例将不会跳过全局请求处理器，因为其引用将更改。请记住在 GlobalRequestHandlers 和 BypassGlobalRequestHandlers 中使用相同的请求处理器引用。