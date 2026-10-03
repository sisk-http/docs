# Requests

Source: https://docs.sisk-framework.org/docs/fundamentals/requests.html

Requests are structures that represent an HTTP request message. The [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) object contains useful functions for handling HTTP messages throughout your application.

An HTTP request is formed by the method, path, version, headers and body.

In this document, we will teach you how to obtain each of these elements.

## Getting the request method

To obtain the method of the received request, you can use the Method property:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

This property returns the request's method represented by an [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) object.

> [!NOTE]
> Unlike route methods, this property does not serves the [RouteMethod.Any](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteMethod.md) item. Instead, it returns the real request method.

## Getting request url components

You can get various component from a URL through certain properties of a request. For this example, let's consider the URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Component name | Description | Component value |
| --- | --- | --- |
| [Path](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Path.md) | Gets the request path. | `/user/login` |
| [FullPath](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullPath.md) | Gets the request path and the query string. | `/user/login?email=foo@bar.com` |
| [FullUrl](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.FullUrl.md) | Gets the entire URL request string. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Host.md) | Gets the request host. | `localhost` |
| [Authority](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Authority.md) | Gets the request host and port. | `localhost:5000` |
| [QueryString](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.QueryString.md) | Gets the request query. | `?email=foo@bar.com` |
| [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) | Gets the request query in a named value collection. | `{StringValueCollection object}` |
| [IsSecure](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsSecure.md) | Determines if the request is using SSL (true) or not (false). | `false` |

You can also opt by using the [HttpRequest.Uri](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Uri.md) property, which includes everything above in one object.

## Request metadata and cancellation

Sisk also attaches operational metadata to each request. These properties are useful for logs, tracing, localization, diagnostics, and long-running operations:

| Property or method | Use |
| --- | --- |
| [RequestId](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestId.md) | A unique identifier for the request. Enable [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md) to return it as `X-Request-Id`. |
| [RequestedAt](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestedAt.md) | The moment when Sisk created the request object. |
| [RemoteAddress](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RemoteAddress.md) | The client address resolved from the connection, or from your [ForwardingResolver](https://docs.sisk-framework.org/docs/advanced/forwarding-resolvers.md). |
| [Culture](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Culture.md) | The best culture resolved from `Accept-Language`, falling back to the current culture. |
| [DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md) | A cancellation token signaled when the client disconnects, when supported by the configured HTTP engine. |
| [Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md) | A typed key/value store shared across request handlers and the route action. |
| [GetRawHttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest.md) | A text representation of the request for diagnostics. |

## Getting the request body

Some requests include body such as forms, files, or API transactions. You can get the body of a request from the property:

```cs
// gets the request body as an string, using the request encoding as the encoder
string body = request.Body;

// or gets it in an byte array
byte[] bodyBytes = request.RawBody;

// or else, you can stream it.
Stream requestStream = request.GetRequestStream();

// or read the body asynchronously
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

It is also possible to determine if there is a body in the request and if it is loaded with the properties [HasContents](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.HasContents.md), which determines if the request has contents and [IsContentAvailable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.IsContentAvailable.md) which indicates that the HTTP server fully received the content from the remote point.

It is not possible to read the request content through `GetRequestStream` more than once. If you read with this method, the values in `RawBody` and `Body` will also not be available. It's not necessary to dispose the request stream in the context of the request, as it is disposed at the end of the HTTP session in which it is created. Also, you can use [HttpRequest.RequestEncoding](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RequestEncoding.md) property to get the best encoding to decode the request manually.

The server has limits for reading the request content, which applies to both [HttpRequest.Body](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md) and [HttpRequest.RawBody](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Body.md). These properties copies the entire input stream to an local buffer of the same size of [HttpRequest.ContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.ContentLength.md).

A response with status 413 Content Too Large is returned to the client if the content sent is larger than [HttpServerConfiguration.MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md) defined in the user configuration. Additionally, if there is no configured limit or if it is too large, the server will throw an [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) when the content sent by the client exceeds [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) and if the content is attempted to be accessed through one of the properties mentioned above. You can still deal with the content through streaming.

> [!NOTE]
> Although Sisk allows it, it is always a good idea to follow HTTP Semantics to create your application and not obtain or serve content in methods that do not allow it. Read about [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Reading JSON requests

For JSON APIs, prefer the built-in JSON helpers instead of reading `Body` and deserializing manually. They use [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) and default to [HttpRequest.DefaultJsonSerializerOptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions.md).

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Use the async overload when you are already in an async route or want request cancellation to stop deserialization:

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

You can pass custom [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions) for a specific endpoint:

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

For Native AOT or trimming-sensitive applications, use the `JsonTypeInfo<T>` overload generated by a `JsonSerializerContext`:

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

The same read-once rule applies to JSON helpers: after Sisk reads the request stream through `GetJsonContent`, `GetJsonContentAsync`, `Body`, or `RawBody`, you cannot later consume the same body through `GetRequestStream()`.

## Getting the request context

The HTTP Context is an exclusive Sisk object that stores HTTP server, route, router and request handler information. You can use it to be able to organize yourself in an environment where these objects are difficult to organize.

You can get the currently executing [HttpContext](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) using the static method `HttpContext.GetCurrentContext()`. This method returns the context of the request currently being processed in the current thread.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Log Mode

The [HttpContext.LogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.LogMode.md) property allows you to control the logging behavior for the current request. You can enable or disable logging for specific requests, overriding the default server configuration.

```cs
// Disable logging for this request
context.LogMode = LogOutputMode.None;
```

### Request Bag

The [RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.RequestBag.md) object contains stored information that is passed from an request handler to another point, and can be consumed at the final destination. This object can also be used by request handlers that run after the route callback.

> [!TIP]
> This property is also acessible by [HttpRequest.Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Bag.md) property.

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

The above request handler will define `AuthenticatedUser` in the request bag, and can be consumed later in the final callback:

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

You can also use the `Bag.Set()` and `Bag.Get()` helper methods to get or set objects by their type singletons.

The `TypedValueDictionary` class also provides `GetValue` and `SetValue` methods for more control.

```cs {title="Middleware/Authenticate.cs"}
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

```csharp {title="Controller/MyController.cs"}
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Getting form data

You can get form data values in a [StringKeyStoreCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringKeyStoreCollection.md) with the example below:

```cs {title="Controller/Auth.cs"}
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

The async version is useful when the request body may be large or when you want cancellation support:

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## Getting multipart form data

Sisk's HTTP request lets you get uploaded multipart contents, such as a files, form fields, or any binary content.

```cs {title="Controller/Auth.cs"}
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // the following method reads the entire request input into an
    // array of MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // The name of the file provided by Multipart form data.
        // Null is returned if the object is not a file.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // The multipart form data object field name.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // The multipart form data content length.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Determine the image format based in the file header for each
        // known content type. If the content ins't an recognized common file
        // format, this method below will return MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Use [GetMultipartFormContentAsync](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync.md) when the route is asynchronous:

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

You can read more about Sisk [Multipart form objects](https://docs.sisk-framework.org/api/Sisk.Core.Entity.MultipartObject.md) and it's methods, properties and functionalities.

## Detecting client disconnection

Since version v1.15 of Sisk, the framework provides a cancellation token through [HttpRequest.DisconnectToken](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.DisconnectToken.md). When the configured HTTP engine supports disconnect detection, this token is canceled when the client connection is closed before the response is completed. This is useful for stopping long-running operations when the client is no longer waiting for the result.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // gets the disconnection token from the request
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

This token is not compatible with all HTTP engines, and each requires an implementation.

The default Sisk engine, based on `System.Net.HttpListener`, does not support client-disconnection detection. When your application uses the default engine, `DisconnectToken` is `CancellationToken.None`; in practice, it is a non-canceling token and should be treated as unavailable.

The [Cadente engine](https://docs.sisk-framework.org/docs/cadente.md) supports `DisconnectToken`. If your route depends on disconnection-aware cancellation, use Cadente or another engine that explicitly implements this behavior. Even with a supported engine, cancellation is cooperative: pass the token to async APIs and check it in your own long-running work.

## Server-sent events support

Sisk supports [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), which allows sending chunks as an stream and keeping the connection between the server and the client alive.

Calling the [HttpRequest.GetEventSource](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.md) method will put the HttpRequest in it's listener state. From this, the context of this HTTP request will not expect an HttpResponse as it will overlap the packets sent by server side events.

After sending all packets, the callback must return the [Close](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequestEventSource.Close.md) method, which will send the final response to the server and indicate that the streaming has ended.

It's not possible to predict what the total length of all packets that will be sent, so it is not possible to determine the end of the connection with `Content-Length` header.

By most browsers defaults, server-side events does not support sending HTTP headers or methods other than the GET method. Therefore, be careful when using request handlers with event-source requests that require specific headers in the request, as it probably they ins't going to have them.

Also, most browsers restart streams if the [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close) method ins't called on the client side after receiving all the packets, causing infinite additional processing on the server side. To avoid this kind of problem, it's common to send an final packet indicating that the event source has finished sending all packets.

The example below shows how the browser can communicate with the server that supports Server-side events.

```html {title="sse-example.html"}
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

And progressively send the messages to the client:

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

When running this code, we expect a result similar to this:

<img src="/assets/img/server side events demo.gif" />

## Resolving proxied IPs and hosts

Sisk can be used with proxies, and therefore IP addresses can be replaced by the proxy endpoint in the transaction from a client to the proxy.

You can define your own resolvers in Sisk with [forwarding resolvers](https://docs.sisk-framework.org/docs/advanced/forwarding-resolvers.md).

## Headers encoding

Header encoding can be a problem for some implementations. On Windows, UTF-8 headers are not supported, so ASCII is used. Sisk has a built-in encoding converter, which can be useful for decoding incorrectly encoded headers.

This operation is costly and disabled by default, but can be enabled with [HttpServerConfiguration.NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md).
