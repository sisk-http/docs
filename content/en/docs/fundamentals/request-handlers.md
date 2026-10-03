---
title: "Request handling"
linkTitle: "Request handlers"
weight: 20
aliases:
  - "/docs/fundamentals/request-handlers.html"
---

Request handlers, also known as "middlewares", are functions that run before or after a request is executed on the router. They can be defined per route or per router.

There are two types of request handlers:

- **BeforeResponse**: defines that the request handler will be executed before calling the router action.
- **AfterResponse**: defines that the request handler will be executed after calling the router action. Sending an HTTP response in this context will overwrite the router's action response.

Both requests handlers can override the actual router callback function response. By the way, request handlers can be useful for validating a request, such as authentication, content, or any other information, such as storing information, logs, or other steps that can be performed before or after a response.

![](/assets/img/requesthandlers1.png)

This way, a request handler can interrupt all this execution and return a response before finishing the cycle, discarding everything else in the process.

Example: let's assume that a user authentication request handler does not authenticate him. It will prevent the request lifecycle from being continued and will hang. If this happens in the request handler at position two, the third and onwards will not be evaluated.

![](/assets/img/requesthandlers2.png)

## Creating an request handler

To create a request handler, we can create a class that inherits the [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) interface, in this format:

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Returning null indicates that the request cycle can be continued
            return null;
        }
        else
        {
            // Returning an HttpResponse object indicates that this response will overwrite adjacent responses.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

In the above example, we indicated that if the `Authorization` header is present in the request, it should continue and the next request handler or the router callback should be called, whichever comes next. If it's a request handler is executed after the response by their property [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) and return an non-null value, it will overwrite the router's response.

Whenever a request handler returns `null`, it indicates that the request must continue and the next object must be called or the cycle must end with the router's response.

> [!WARNING]
> A request handler instance is created once and shared by every request it handles, including concurrent requests. **Never store individual request state in the request handler class itself** (fields or properties such as the current user, a parsed token, or a timer), because that value leaks into other requests. Store per-request values in the [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) of the `HttpContext` instead:
>
> ```cs
> public HttpResponse? Execute(HttpRequest request, HttpContext context)
> {
>     // wrong: this.currentUser = FindUser(request);
>     context.RequestBag.Set(FindUser(request));
>     return null;
> }
> ```

If you inherit from the built-in [RequestHandler](/api/Sisk.Core.Routing.RequestHandler) class, you can return `Next()` to make that intent explicit:

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

For handlers that need I/O, inherit from [AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler):

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

Small inline handlers can also be created with `RequestHandler.Create` or `AsyncRequestHandler.Create`:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## Associating a request handler with a single route

You can define one or more request handlers for a route.

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

Or creating an [Route](/api/Sisk.Core.Routing.Route) object:

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## Associating a request handler with a router

You can define a global request handler that will runned on all routes on a router.

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Associating a request handler with an attribute

You can define a request handler on a method attribute along with a route attribute.

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

Note that it is necessary to pass the desired request handler type and not an object instance. That way, the request handler will be instantiated by the router parser. You can pass arguments in the class constructor with the [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) property.

Example:

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

You can also create your own attribute that implements RequestHandler:

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

And use it as:

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Bypassing an global request handler

After defining a global request handler on a route, you can ignore this request handler on specific routes.

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
> If you're bypassing a request handler you must use the same reference of what you instanced before to skip. Creating another request handler instance will not skip the global request handler since it's reference will change. Remember to use the same request handler reference used in both GlobalRequestHandlers and BypassGlobalRequestHandlers.
