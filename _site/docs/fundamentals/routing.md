# Routing

Source: https://docs.sisk-framework.org/docs/fundamentals/routing.html

The [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) is the first step in building the server. It is responsible for housing [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md) objects, which are endpoints that map URLs and their methods to actions executed by the server. Each action is responsible for receiving a request and delivering a response to the client.

The routes are pairs of path expressions ("path pattern") and the HTTP method that they can listen to. When a request is made to the server, it will attempt to find a route that matches the received request, then it will call the action of that route and deliver the resulting response to the client.

There are multiple ways to define routes in Sisk: they can be static, dynamic or auto-scanned, defined by attributes, or directly in the Router object.

```cs
Router mainRouter = new Router();

// maps the GET / route into the following action
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

To understand what a route is capable of doing, we need to understand what a request is capable of doing. An [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) will contain everything you need. Sisk also includes some extra features that speed up the overral development.

For every action received by the server, a delegate of type [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md) will be called. This delegate contains an parameter holding an [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) with all the necessary information about the request received by the server. The resulting object from this delegate must be an [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) or an object that maps to it through [implicit response types](https://docs.sisk-framework.org/docs/fundamentals/responses.md#implicit-response-types).

## Matching routes

When a request is received by the HTTP server, Sisk searches for a route that satisfies the expression of the path received by the request. The expression is always tested between the route and the request path, without considering the query string.

This test does not have priority and is exclusive to a single route. When no route is matched with that request, the [Router.NotFoundErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.NotFoundErrorHandler.md) response is returned to the client. When the path pattern is matched, but the HTTP method is mismatched, the [Router.MethodNotAllowedErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler.md) response is sent back to the client.

Sisk checks for the possibility of route collisions to avoid these problems. When defining routes, Sisk will look for possible routes that might collide with the route being defined. This test includes checking the path and the method that the route is set to accept.

### Creating routes using path patterns

For new applications, prefer the `Map*` methods. They keep the HTTP method visible at the call site and match the current `Router` API. The older `SetRoute` methods still exist as compatibility wrappers, but new examples should use `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions`, or `MapHead`.

```cs
// Map* methods are the usual way to define method-specific routes.
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // empty 200 ok
});

// Map can also receive a Route instance when you need route options.
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // the StreamContent inner
        // stream is disposed after sending
        // the response.
        Content = new StreamContent(imageStream)
    };
}));

// multiple parameters
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

The [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) property of HttpRequest contains all the information about the path variables of the received request.

Every path received by the server is normalized before the path pattern test is executed, following these rules:

- All empty segments are removed from the path, eg: `////foo//bar` becomes `/foo/bar`.
- Path matching is **case-sensitive**, unless [Router.MatchRoutesIgnoreCase](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase.md) is set to `true`.

The [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) and [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) properties of [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) return a [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md) object, where each indexed property returns a non-null [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md), which can be used as an option/monad to convert its raw value into a managed object.

The example below reads the route parameter "id" and obtains a `Guid` from it. If the parameter is not a valid Guid, an exception is thrown, and a 500 error is returned to the client if the server is not handling [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md).

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> Paths have their trailing `/` ignored in both request and route path, that is, if you try to access a route defined as `/index/page` you'll be able to access using `/index/page/` too.
>
> You can also force URLs to terminate with `/` by enabling [HttpServerConfiguration.ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md).

### Creating routes using class instances

You can also define routes dynamically using reflection with the attribute [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). This way, the instance of a class in which its methods implement this attribute will have their routes defined in the target router.

For a method to be defined as a route, it must be marked with a [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md), such as the attribute itself or a [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md). The method can be static, instance, public, or private. Use `MapInstance` when you want to map instance and static route methods from an object. Use `MapType` when you want to map only static route methods from a type.

```cs {title="Controller/MyController.cs"}
public class MyController
{
    // will match GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // static methods works too
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

The line below will define both the `Index` and `Hello` methods of `MyController` as routes, as both are marked as routes, and an instance of the class has been provided, not its type. If its type had been provided instead of an instance, only the static methods would be defined.

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

To map only static route methods from a type, use:

```cs
mainRouter.MapType<MyController>();
```

Since Sisk version 0.16, it is possible to enable AutoScan, which will search for user-defined classes that implement `RouterModule` and will automatically associate it with the router. This is not supported with AOT compilation.

```cs
mainRouter.AutoScanModules<ApiController>();
```

The above instruction will search for all types which implements `ApiController` but **not the type itself**. The two optional parameters indicate how the method will search for these types. The first argument implies the Assembly where the types will be searched and the second indicates the way in which the types will be defined.

## Regex routes

Instead of using the default HTTP path matching methods, you can mark a route to be interpreted with Regex.

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

Or with [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md) class:

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

You can also capture groups from the regex pattern into the [HttpRequest.RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) contents:

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## Prefixing routes

You can prefix all routes in a class or module with the [RoutePrefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) attribute and set the prefix as a string.

See the example below using the BREAD architecture (Browse, Read, Edit, Add and Delete):

```cs {title="Controller/Api/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

In the above example, the HttpResponse parameter is omitted in favor of being used through the global context [HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md). Read more in the section that follows.

## Routes without request parameter

Routes can be defined without the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) parameter and still be possible to obtain the request and its components in the request context. Let's consider an abstraction `ControllerBase` that serves as a foundation for all controllers of an API, and that abstraction provides the `Request` property to obtain the [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) currently.

```cs {title="Controller/ControllerBase.cs"}
public abstract class ControllerBase
{
    // gets the request from the current thread
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // the line below, when called, gets the database from the current HTTP session,
    // or creates a new one if it doesn't exist
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

And for all it's descendants to be able to use the route syntax without the request parameter:

```cs {title="Controller/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // reads the JSON data from the current request
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

More details about the current context and dependency injection can be found in the [dependency injection](https://docs.sisk-framework.org/docs/features/instancing.md) tutorial.

## Any method routes

You can define a route to be matched only by its path and skip the HTTP method. This can be useful for you to do method validation inside the route callback.

```cs
// will match / on any HTTP method
mainRouter.MapAny("/", callbackFunction);
```

## Any path routes

Any path routes test for any path received by the HTTP server, subject to the route method being tested. If the route method is RouteMethod.Any and the route uses [Route.AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md) in its path expression, this route will listen to all requests from the HTTP server, and no other routes can be defined.

```cs
// the following route will match all POST requests
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignore case route matching

By default, the interpretation of routes with requests are case-sensitive. To make it ignore case, enable this option:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

This will also enable the option `RegexOptions.IgnoreCase` for routes where it's regex-matching.

## Not Found (404) callback handler

You can create a custom callback for when a request doesn't match any known routes.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Since v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // older versions
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Method not allowed (405) callback handler

You can also create a custom callback for when a request matches it's path, but doens't match the method.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Error Handling

Exceptions can be thrown within a request lifecycle, which spans from the pre-execution request handler, through the router action, to the post-execution request handlers and value handlers. These exceptions are managed by the mechanism:

- If [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is `true`, exceptions will be thrown normally and will not be caught by Sisk, and the HTTP server may be interrupted if the exception is not caught.
- If [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is `false`, exceptions will be caught and handled by Sisk. After that, if `Router.CallbackErrorHandler` is defined, it will be called with the caught exception and the request context, and it **will not** be forwarded to the standard error output. If `Router.CallbackErrorHandler` is not defined, the exception will be forwarded to the standard error output, and the client will receive an HTTP 500 error response. If the standard error output is not defined, the error will be silently ignored.

Note: within `Router.CallbackErrorHandler`, you can set the log mode for errors, access log, both, or none, and alter the default log writing behavior:

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // override log mode to log the error in both access and error logs
}
```

## Internal error handler

Route callbacks can throw errors during server execution. If not handled correctly, the overall functioning of the HTTP server can be terminated. The router has a callback for when a route callback fails and prevents service interruption.

This method is only reacheable when [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) is set to false.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```
