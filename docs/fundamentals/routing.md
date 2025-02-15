# Routing

The [Router](/api/Sisk.Core.Routing.Router) is the first step in building the server. It is responsible for housing [Route](/api/Sisk.Core.Routing.Route) objects, which are endpoints that map URLs and their methods to actions executed by the server. Each action is responsible for receiving a request and delivering a response to the client.

The routes are pairs of path expressions ("path pattern") and the HTTP method that they can listen to. When a request is made to the server, it will attempt to find a route that matches the received request, then it will call the action of that route and deliver the resulting response to the client.

There are multiple ways to define routes in Sisk: they can be static, dynamic or auto-scanned, defined by attributes, or directly in the Router object.

```cs
Router mainRouter = new Router();

// maps the GET / route into the following action
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

To understand what a route is capable of doing, we need to understand what a request is capable of doing. An [HttpRequest](/api/Sisk.Core.Http.HttpRequest) will contain everything you need. Sisk also includes some extra features that speed up the overral development.

For every action received by the server, a delegate of type [RouteAction](/api/Sisk.Core.Routing.RouteAction) will be called. This delegate contains an parameter holding an [HttpRequest](/api/Sisk.Core.Http.HttpRequest) with all the necessary information about the request received by the server. The resulting object from this delegate must be an [HttpResponse](/api/Sisk.Core.Http.HttpResponse) or an object that maps to it through [implicit response types](/docs/fundamentals/responses#implicit-response-types).

## Matching routes

When a request is received by the HTTP server, Sisk searches for a route that satisfies the expression of the path received by the request. The expression is always tested between the route and the request path, without considering the query string.

This test does not have priority and is exclusive to a single route. When no route is matched with that request, the [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) response is returned to the client. When the path pattern is matched, but the HTTP method is mismatched, the [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) response is sent back to the client.

Sisk checks for the possibility of route collisions to avoid these problems. When defining routes, Sisk will look for possible routes that might collide with the route being defined. This test includes checking the path and the method that the route is set to accept.

### Creating routes using path patterns

You can define routes using various `SetRoute` methods.

```cs
// SetRoute way
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// Map* way
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // empty 200 ok
});

// Route.* helper methods
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // the StreamContent inner
        // stream is disposed after sending
        // the response.
        Content = new StreamContent(imageStream)
    };
});

// multiple parameters
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

The [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) property of HttpResponse contains all the information about the path variables of the received request.

Every path received by the server is normalized before the path pattern test is executed, following these rules:

- All empty segments are removed from the path, eg: `////foo//bar` becomes `/foo/bar`.
- Path matching is **case-sensitive**, unless [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) is set to `true`.

The [Query](/api/Sisk.Core.Http.HttpRequest.Query) and [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) properties of [HttpRequest](/api/Sisk.Core.Http.HttpRequest) return a [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection) object, where each indexed property returns a non-null [StringValue](/api/Sisk.Core.Entity.StringValue), which can be used as an option/monad to convert its raw value into a managed object.

The example below reads the route parameter "id" and obtains a `Guid` from it. If the parameter is not a valid Guid, an exception is thrown, and a 500 error is returned to the client if the server is not handling [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> Paths have their trailing `/` ignored in both request and route path, that is, if you try to access a route defined as `/index/page` you'll be able to access using `/index/page/` too.
>
> You can also force URLs to terminate with `/` enabling the [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash) flag.

### Creating routes using class instances

You can also define routes dynamically using reflection with the attribute [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). This way, the instance of a class in which its methods implement this attribute will have their routes defined in the target router.

For a method to be defined as a route, it must be marked with a [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), such as the attribute itself or a [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). The method can be static, instance, public, or private. When the method `SetObject(type)` or `SetObject<TType>()` is used, instance methods are ignored.

```cs
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
mainRouter.SetObject(myController);
```

Since Sisk version 0.16, it is possible to enable AutoScan, which will search for user-defined classes that implement `RouterModule` and will automatically associate it with the router. This is not supported with AOT compilation.

```cs
mainRouter.AutoScanModules<ApiController>();
```

The above instruction will search for all types which implements `ApiController` but not the type itself. The two optional parameters indicate how the method will search for these types. The first argument implies the Assembly where the types will be searched and the second indicates the way in which the types will be defined.

## Regex routes

Instead of using the default HTTP path matching methods, you can mark a route to be interpreted with Regex.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

Or with [RegexRoute](/api/Sisk.Core.Routing.RegexRoute) class:

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
});
mainRouter.SetRoute(indexRoute);
```

You can also capture groups from the regex pattern into the [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) contents:

```cs
[RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
static HttpResponse RegexRoute(HttpRequest request)
{
    string filename = request.RouteParameters["filename"].GetString();
    return new HttpResponse().WithContent($"Acessing file {filename}");
}
```

## Any method routes

You can define a route to be matched only by its path and skip the HTTP method. This can be useful for you to do method validation inside the route callback.

```cs
// will match / on any HTTP method
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Any path routes

Any path routes test for any path received by the HTTP server, subject to the route method being tested. If the route method is RouteMethod.Any and the route uses [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) in its path expression, this route will listen to all requests from the HTTP server, and no other routes can be defined.

```cs
// the following route will match all POST requests
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
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

## Internal error handler

Route callbacks can throw errors during server execution. If not handled correctly, the overall functioning of the HTTP server can be terminated. The router has a callback for when a route callback fails and prevents service interruption.

This method is only reacheable when [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) is set to false.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```