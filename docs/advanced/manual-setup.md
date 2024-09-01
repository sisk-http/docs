# Manual (advanced) setup

In this section, we will create our HTTP server without any predefined standards, in a completely abstract way. Here, you can manually build how your HTTP server will function. Each ListeningHost has a router, and an HTTP server can have multiple ListeningHosts, each pointing to a different host on a different port.

First, we need to understand the request/response concept. It is quite simple: for every request, there must be a response. Sisk follows this principle as well. Let's create a method that responds with a "Hello, World!" message in HTML, specifying the status code and headers.

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

The next step is to associate this method with an HTTP route.

## Routers

Routers are abstractions of request routes and serve as the bridge between requests and responses for the service. Routers manage service routes, functions, and errors.

A router can have several routes, and each route can perform different operations on that path, such as executing a function, serving a page, or providing a resource from the server.

Let's create our first router and associate our `IndexPage` method with the index path.

```csharp
Router mainRouter = new Router();

// SetRoute will associate all index routes with our method.
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

Now our router can receive requests and send responses. However, `mainRouter` is not tied to a host or a server, so it will not work on its own. The next step is to create our ListeningHost.

## Listening Hosts and Ports

A [ListeningHost](/api/Sisk.Core.Http.ListeningHost) can host a router and multiple listening ports for the same router. A [ListeningPort](/api/Sisk.Core.Http.ListeningPort) is a prefix where the HTTP server will listen.

Here, we can create a `ListeningHost` that points to two endpoints for our router:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Now our HTTP server will listen to the specified endpoints and redirect its requests to our router.

## Server Configuration

Server configuration is responsible for most of the behavior of the HTTP server itself. In this configuration, we can associate `ListeningHosts` with our server.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Add our ListeningHost to this server configuration
```

Next, we can create our HTTP server:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Starts the server
Console.ReadKey(); // Prevents the application from exiting
```

Now we can compile our executable and run our HTTP server with the command:

```bash
dotnet watch
```

At runtime, open your browser and navigate to the server path, and you should see:

<img src="/assets/img/localhost.png" >