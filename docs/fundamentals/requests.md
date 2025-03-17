# Requests

Requests are structures that represent an HTTP request message. The [HttpRequest](/api/Sisk.Core.Http.HttpRequest) object contains useful functions for handling HTTP messages throughout your application.

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
> Unlike route methods, this property does not serves the [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) item. Instead, it returns the real request method.

## Getting request url components

You can get various component from a URL through certain properties of a request. For this example, let's consider the URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Component name | Description | Component value |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Gets the request path. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Gets the request path and the query string. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Gets the entire URL request string. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Gets the request host. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Gets the request host and port. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Gets the request query. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Gets the request query in a named value collection. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determines if the request is using SSL (true) or not (false). | `false` |

You can also opt by using the [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) property, which includes everything above in one object.

## Getting the request body

Some requests include body such as forms, files, or API transactions. You can get the body of a request from the property:

```cs
// gets the request body as an string, using the request encoding as the encoder
string body = request.Body;

// or gets it in an byte array
byte[] bodyBytes = request.RawBody;

// or else, you can stream it.
Stream requestStream = request.GetRequestStream();
```

It is also possible to determine if there is a body in the request and if it is loaded with the properties [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), which determines if the request has contents and [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) which indicates that the HTTP server fully received the content from the remote point.

It is not possible to read the request content through `GetRequestStream` more than once. If you read with this method, the values in `RawBody` and `Body` will also not be available. It's not necessary to dispose the request stream in the context of the request, as it is disposed at the end of the HTTP session in which it is created. Also, you can use [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) property to get the best encoding to decode the request manually.

The server has limits for reading the request content, which applies to both [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) and [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). These properties copies the entire input stream to an local buffer of the same size of [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

A response with status 413 Content Too Large is returned to the client if the content sent is larger than [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) defined in the user configuration. Additionally, if there is no configured limit or if it is too large, the server will throw an [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) when the content sent by the client exceeds [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) and if the content is attempted to be accessed through one of the properties mentioned above. You can still deal with the content through streaming.

> [!NOTE]
> Although Sisk allows it, it is always a good idea to follow HTTP Semantics to create your application and not obtain or serve content in methods that do not allow it. Read about [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Getting the request context

The HTTP Context is an exclusive Sisk object that stores HTTP server, route, router and request handler information. You can use it to be able to organize yourself in an environment where these objects are difficult to organize.

The [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) object contains stored information that is passed from an request handler to another point, and can be consumed at the final destination. This object can also be used by request handlers that run after the route callback.

> [!TIP]
> This property is also acessible by [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) property.

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
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

You can also use the `Bag.Set()` and `Bag.Get()` helper methods to get or set objects by their type singletons.

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Getting form data

You can get the values of a form data in an [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) with the example below:

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
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

## Getting multipart form data

Sisk's HTTP request lets you get uploaded multipart contents, such as a files, form fields, or any binary content.

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
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

You can read more about Sisk [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) and it's methods, properties and functionalities.

## Server-sent events support

Sisk supports [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), which allows sending chunks as an stream and keeping the connection between the server and the client alive.

Calling the [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) method will put the HttpRequest in it's listener state. From this, the context of this HTTP request will not expect an HttpResponse as it will overlap the packets sent by server side events.

After sending all packets, the callback must return the [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) method, which will send the final response to the server and indicate that the streaming has ended.

It's not possible to predict what the total length of all packets that will be sent, so it is not possible to determine the end of the connection with `Content-Length` header.

By most browsers defaults, server-side events does not support sending HTTP headers or methods other than the GET method. Therefore, be careful when using request handlers with event-source requests that require specific headers in the request, as it probably they ins't going to have them.

Also, most browsers restart streams if the [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close) method ins't called on the client side after receiving all the packets, causing infinite additional processing on the server side. To avoid this kind of problem, it's common to send an final packet indicating that the event source has finished sending all packets.

The example below shows how the browser can communicate with the server that supports Server-side events.

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
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
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

When running this code, we expect a result similar to this:

<img src="/assets/img/server side events demo.gif" />

## Resolving proxied IPs and hosts

Sisk can be used with proxies, and therefore IP addresses can be replaced by the proxy endpoint in the transaction from a client to the proxy.

You can define your own resolvers in Sisk with [forwarding resolvers](/docs/advanced/forwarding-resolvers).

## Headers encoding

Header encoding can be a problem for some implementations. On Windows, UTF-8 headers are not supported, so ASCII is used. Sisk has a built-in encoding converter, which can be useful for decoding incorrectly encoded headers.

This operation is costly and disabled by default, but can be enabled under the [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) flag.