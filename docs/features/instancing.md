# Instancing per-request members
It is common to dedicate members and instances that last for the lifetime of a request, such as a database connection, an authenticated user, or a session token. One of the possibilities is through the [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), which creates a dictionary that lasts for the entire lifetime of a request.

This dictionary can be accessed by [request handlers](/docs/fundamentals/request-handlers) and define variables throughout that request. For example, a request handler that authenticates a user sets this user within the `HttpContext.RequestBag`, and within the request logic, this user can be retrieved with `HttpContext.RequestBag.Get<User>()`.

Here’s an example:

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

This is a preliminary example of this operation. The instance of `User` was created within the request handler dedicated to authentication, and all routes that use this request handler will have the guarantee that there will be a `User` in their instance of `HttpContext.RequestBag`.

It is possible to define logic to obtain instances when not previously defined in the `RequestBag` through methods like [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) or [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Since version 1.3, the static property [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) was introduced, allowing access to the currently executing `HttpContext` of the request context. This enables exposing members of the `HttpContext` outside the current request and defining instances in route objects.

The example below defines a controller that has members commonly accessed by the context of a request.

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // create an DbContext or get the existing one
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // the following line will throw if the property is accessed when the User is not
    // defined in the request bag
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // Exposing the HttpRequest instance is supported too
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

And define types that inherit from the controller:

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

For the example above, you will need to configure a [value handler](/docs/fundamentals/responses.html#implicit-response-types) in your router so that the objects returned by the router are transformed into a valid [HttpResponse](/api/Sisk.Core.Http.HttpResponse).

Note that the methods do not have an `HttpRequest request` argument as present in other methods. This is because, since version 1.3, the router supports two types of delegates for routing responses: [RouteAction](/api/Sisk.Core.Routing.RouteAction), which is the default delegate that receives an `HttpRequest` argument, and [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). The `HttpRequest` object can still be accessed by both delegates through the [Request](/api/Sisk.Core.Http.HttpContext.Request) property of the static `HttpContext` on the thread.

In the example above, we defined a disposable object, the `DbContext`, and we need to ensure that all instances created in a `DbContext` are disposed of when the HTTP session ends. For this, we can use two ways to achieve this. One is to create a [request handler](/docs/fundamentals/request-handlers) that is executed after the router's action, and the other way is through a custom [server handler](/docs/advanced/http-server-handlers).

For the first method, we can create the request handler inline directly in the [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) method inherited from `RouterModule`:

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
                // get one DbContext defined in the request handler context and
                // dispose it
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

The method above will ensure that the `DbContext` is disposed of when the HTTP session is finalized. You can do this for more members that need to be disposed of at the end of a response.

For the second method, you can create a custom [server handler](/docs/advanced/http-server-handlers) that will dispose of the `DbContext` when the HTTP session is finalized.

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

And use it in your builder:

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

This is a way to handle code cleanup and keep the dependencies of a request separated by the type of module that will be used, reducing the amount of duplicated code within each action of a router. It is a practice similar to what dependency injection is used for in frameworks like ASP.NET.