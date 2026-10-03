# Responses

Source: https://docs.sisk-framework.org/docs/fundamentals/responses.html

Responses represent objects that are HTTP responses to HTTP requests. They are sent by the server to the client as an indication of the request for a resource, page, document, file or other object.

An HTTP response is formed up of status, headers and content.

In this document, we will teach you how to architect HTTP responses with Sisk.

## Setting an HTTP status

The HTTP status list is the same since HTTP/1.0, and Sisk supports all of them.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

Or with Fluent Syntax:

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

You can see the full list of available HttpStatusCode [here](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). You can also provide your own status code by using the [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) structure.

## Body and content-type

Sisk supports native .NET content objects to send body in responses. You can use the [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) class to send a JSON response for example:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

The server will always attempt to calculate the `Content-Length` from what you have defined in the content if you haven't explicitly defined it in a header. If the server cannot implicitly obtain the Content-Length header from the response content, the response will be sent with Chunked-Encoding.

You can also stream the response by sending a [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) or using the method [GetResponseStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetResponseStream.md).

## Response headers

You can add, edit or remove headers you're sending in the response. The example below shows how to send an redirect response to the client.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

Or with Fluent Syntax:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

When you use the [Add](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Add.md) method of HttpHeaderCollection, you are adding a header to the request without altering the ones already sent. The [Set](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Set.md) method replaces the headers with the same name with the instructed value. The indexer of HttpHeaderCollection internally calls the Set method to replace the headers.

You can also retrieve header values using the [GetHeaderValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue.md) method. This method helps in obtaining values from both the response headers and the content headers (if any content is set).

```cs
// Returns the value of the "Content-Type" header, checking both response.Headers and response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Sending cookies

Sisk has methods that facilitate the definition of cookies in the client. Cookies set by this method are already URL encoded and fit the RFC-6265 standard.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

Or with Fluent Syntax:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

There are other [more complete versions](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CookieHelper.SetCookie.md) of the same method.

## Chunked responses

You can set the transfer encoding to chunked to send large responses.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

When using chunked-encoding, the Content-Length header is automatically omitted.

## Response stream

Response streams are an managed way that allow you to send responses in a segmented way. It's a lower level operation than using HttpResponse objects, as they require you to send the headers and content manually, and then close the connection.

This example opens an read-only stream for the file, copies the stream to the response output stream and doens't loads the entire file in the memory. This can be useful to serving medium or big files.

```cs
// gets the response output stream
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// sets the response encoding to use chunked-encoding
// also you shouldn't send content-length header when using
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copies the file stream to the response output stream
fileStream.CopyTo(responseStream.ResponseStream);

// closes the stream
return responseStream.Close();
```

## GZip, Deflate and Brotli compression

You can send responses with compressed content in Sisk with compressing HTTP contents. Firstly, encapsulate your [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) object within one of the compressors below to send the compressed response to the client.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // or Content = new BrotliContent(new HtmlContent(myHtml)),
        // or Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

You can also use these compressed contents with streams.

```cs
router.MapGet("/archive.zip", request => {
    
    // do not apply "using" here. the HttpServer will discard your content
    // after sending the response.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

The Content-Encoding headers are automatically set when using these contents.

## Automatic compression

It is possible to automatically compress HTTP responses with the [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md) property. This property automatically encapsulates the response content from the router in a compressible content that is accepted by the request, provided the response is not inherited from a [CompressedContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.md).

Only one compressible content is chosen for a request, chosen according to the Accept-Encoding header, which follows the order:

- [BrotliContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.md) (br)
- [GZipContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.md) (gzip)
- [DeflateContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.md) (deflate)

If the request specifies that it accepts any of these compression methods, the response will be automatically compressed.

## Implicit response types

You can use other return types besides HttpResponse, but it is necessary to configure the router how it will handle each type of object.

The concept is to always return a reference type and turn it into a valid HttpResponse object. Routes that return HttpResponse do not undergo any conversion.

Value types (structures) cannot be used as a return type because they are not compatible with the [RouterCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterCallback.md), so they must be wrapped in a ValueResult to be able to be used in handlers.

Consider the following example from a router module not using HttpResponse in the return type:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

With that, now it is necessary to define in the router how it will deal with each type of object. Objects are always the first argument of the handler and the output type must be a valid HttpResponse. Also, the output objects of a route should never be null.

For ValueResult types it is not necessary to indicate that the input object is a ValueResult and only T, since ValueResult is an object reflected from its original component.

The association of types does not compare what was registered with the type of the object returned from the router callback. Instead, it checks whether the type of the router result is assignable to the registered type.

Registering a handler of type Object will fallback to all previously unvalidated types. The inserting order of the value handlers also matters, so registering an Object handler will ignore all other type-specific handlers. Always register specific value handlers first to ensure order.

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// registering an value handler of object must be the last
// value handler which will be used as an fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Deferred Actions

When a request reaches the router, it first passes through the [request handlers](https://docs.sisk-framework.org/docs/fundamentals/request-handlers.md), is processed in the router action, and then by the post-execution request handlers. The result of the router action is what is passed to the value handlers, and the result of the value handler is what is sent to the client as a response.

This lifecycle occurs within an asynchronous context. This asynchronous context exposes variables that the user can add to the [HttpContext Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) to share data between handlers and the router action. The value returned by the router action is added to this asynchronous context and can be accessed by the value handlers.

Deferred actions are actions that will always execute at the end of the cycle, after delivering the response to the client, but still within the same asynchronous context. These actions can be used to execute long-running tasks that do not need to be completed to send a response to the client, such as saving logs, updating the database, sending emails, etc.

Exceptions are still caught in deferred actions and will be handled in the same way as an exception thrown anywhere in the request lifecycle. The difference is that the client will already have a response, so the exception is handled by the default error handling.

Defer the execution of an action using the [HttpContext.EnqueueDeferredAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md) method. The method receives an asynchronous function that represents the action to be executed and an optional timeout to limit the execution time of the action. If the action is not completed within the time limit, it will be canceled.

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // schedules a long-running action that will be executed after sending the response to the client, but still within the same asynchronous context of the request
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Note on enumerable objects and arrays

Implicit response objects that implement [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) are read into memory through the `ToArray()` method before being converted through a defined value handler. For this to occur, the `IEnumerable` object is converted to an array of objects, and the response converter will always receive an `Object[]` instead of the original type.

Consider the following scenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

In the above example, the `IEnumerable<string>` converter **will never be called**, because the input object will always be an `Object[]` and it is not convertible to an `IEnumerable<string>`. However, the converter below that receives an `IEnumerable<object>` will receive its input, since its value is compatible.

If you need to actually handle the type of the object that will be enumerated, you will need to use reflection to get the type of the collection element. All enumerable objects (lists, arrays, and collections) are converted to an array of objects by the HTTP response converter.

Values that implements [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) are handled automatically by the server if the [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) property is enabled, similar to what happens with `IEnumerable`. This option is enabled by default in `HttpServerConfiguration`; an asynchronous enumeration is converted to a blocking enumerator, and then converted to a synchronous array of objects. Disable it only when you provide your own value handler or streaming response strategy for asynchronous sequences.
