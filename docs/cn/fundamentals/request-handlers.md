请求处理程序，也称为“中间件”，是在路由执行请求之前或之后运行的函数。它们可以按路由或按路由器定义。

存在两种类型的请求处理程序：

- **BeforeResponse**: 定义请求处理程序将在调用路由器操作之前执行。
- **AfterResponse**: 定义请求处理程序将在调用路由器操作之后执行。在此上下文中发送 HTTP 响应将覆盖路由器的操作响应。

两个请求处理程序都可以覆盖实际路由器回调函数的响应。顺便说一句，请求处理程序可用于验证请求，例如身份验证、内容或任何其他信息，例如存储信息、日志或可以在响应之前或之后执行的其他步骤。

![](/assets/img/requesthandlers1.png)

这样，请求处理程序可以中断所有此执行并返回响应，从而在完成循环之前丢弃其他所有内容。

示例：假设用户身份验证请求处理程序未对其进行身份验证。它将阻止请求生命周期继续，并挂起。如果这发生在第二个请求处理程序中，则不会评估第三个及以后的请求处理程序。

![](/assets/img/requesthandlers2.png)

## 创建请求处理程序

要创建请求处理程序，我们可以创建一个继承 [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) 接口的类，采用以下格式：

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
            // 返回 HttpResponse 对象表示此响应将覆盖相邻响应。
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

在上面的示例中，我们指示如果请求中包含 `Authorization` 标头，则应继续执行，并调用下一个请求处理程序或路由器回调，无论哪个先到。如果请求处理程序在响应之后执行，并且其 [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) 属性返回非空值，它将覆盖路由器的响应。

每当请求处理程序返回 `null` 时，它都表示请求必须继续，必须调用下一个对象或以路由器响应结束周期。

## 将请求处理程序与单个路由关联

您可以为路由定义一个或多个请求处理程序。

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

或者创建 [Route](/api/Sisk.Core.Routing.Route) 对象：

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## 将请求处理程序与路由器关联

您可以定义一个全局请求处理程序，它将在路由器上的所有路由上运行。

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## 将请求处理程序与属性关联

您可以在方法属性以及路由属性中定义请求处理程序。

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse()
            .WithContent(new StringContent("Hello world!"));
    }
}
```

请注意，必须传递所需的请求处理程序类型，而不是对象实例。这样，路由器解析器将实例化请求处理程序。您可以通过 [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) 属性使用构造函数参数将参数传递给类。

示例：

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

您还可以创建自己的属性，该属性实现 RequestHandler：

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

并使用它：

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

## 跳过全局请求处理程序

在路由上定义全局请求处理程序后，您可以忽略特定路由上的此请求处理程序。

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
        myRequestHandler,                    // ok: 与全局请求处理程序中实例化的相同引用
        new AuthenticateUserRequestHandler() // wrong: 不会跳过全局请求处理程序
    }
});
```

> [!NOTE]
> 如果您要跳过请求处理程序，则必须使用与在全局请求处理程序中实例化的相同引用。创建另一个请求处理程序实例将不会跳过全局请求处理程序，因为其引用将发生变化。请务必在 GlobalRequestHandlers 和 BypassGlobalRequestHandlers 中使用相同的请求处理程序引用。



