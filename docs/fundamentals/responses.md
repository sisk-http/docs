# Responses

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

You can see the full list of available HttpStatusCode [here](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). You can also provide your own status code by using the [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) structure.

## Body and content-type

Sisk supports native .NET content objects to send body in responses. You can use the [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) class to send a JSON response for example:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

The server will always attempt to calculate the `Content-Length` from what you have defined in the content if you haven't explicitly defined it in a header. If the server cannot implicitly obtain the Content-Length header from the response content, the response will be sent with Chunked-Encoding.

You can also stream the response by sending a [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) or using the method [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

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

When you use the [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) method of HttpHeaderCollection, you are adding a header to the request without altering the ones already sent. The [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) method replaces the headers with the same name with the instructed value. The indexer of HttpHeaderCollection internally calls the Set method to replace the headers.

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

There are other [more complete versions](/api/Sisk.Core.Http.CookieHelper.SetCookie) of the same method.

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

## Implicit response types

Since version 0.15, you can use other return types besides HttpResponse, but it is necessary to configure the router how it will handle each type of object.

The concept is to always return a reference type and turn it into a valid HttpResponse object. Routes that return HttpResponse do not undergo any conversion.

Value types (structures) cannot be used as a return type because they are not compatible with the [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), so they must be wrapped in a ValueResult to be able to be used in handlers.

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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
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
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // do something with enumerableValue here
});

// registering an value handler of object must be the last
// value handler which will be used as an fallback
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```