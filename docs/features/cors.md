# Enabling CORS (Cross-Origin Resource Sharing) in Sisk

Sisk has a tool that can be useful for handling [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) when exposing your service publicly. This feature is not part of the HTTP protocol but a specific feature of web browsers defined by the W3C. This security mechanism prevents a web page from making requests to a different domain than the one that provided the web page. A service provider can allow certain domains to access its resources, or just one.

## Same Origin
 
For a resource to be identified as "same origin", a request must identify the [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin) header in its request:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

And the remote server must respond with an [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) header with the same value as the requested origin:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

This verification is **explicit**: the host, port, and protocol must be the same as requested. Check the example:

- A server responds that its `Access-Control-Allow-Origin` is `https://example.com`:
    - `https://example.net` - the domain is different.
    - `http://example.com` - the scheme is different.
    - `http://example.com:5555` - the port is different.
    - `https://www.example.com` - the host is different.

In the specification, only the syntax is allowed for both headers, whether for requests and responses. The URL path is ignored. The port is also omitted if it is a default port (80 for HTTP and 443 for HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Enabling CORS

Natively, you have the [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) object within your [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

You can configure CORS when initializing the server:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

The code above will send the following headers for **all responses**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

These headers need to be sent for all responses to a web client, including errors and redirects.

You may notice that the [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) class has two similar properties: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) and [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Note that one is plural, while the other is singular.

- The **AllowOrigin** property is static: only the origin you specify will be sent for all responses.
- The **AllowOrigins** property is dynamic: the server checks if the request's origin is contained in this list. If it is found, it is sent for the response of that origin.

### Wildcards and automatic headers

Alternatively, you can use a wildcard (`*`) in the response's origin to specify that any origin is allowed to access the resource. However, this value is not allowed for requests that have credentials (authorization headers) and this operation [will result in an error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

You can work around this problem by explicitly listing which origins will be allowed through the [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) property or also use the [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) constant in the value of [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). This magic property will define the `Access-Control-Allow-Origin` header for the same value as the `Origin` header of the request.

You can also use [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) and [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) for behavior similar to `AllowOrigin`, which automatically responds based on the headers sent.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Responds based on the request's Origin header
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Responds based on the Access-Control-Request-Method header or the request method
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Responds based on the Access-Control-Request-Headers header or the sent headers
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## Other Ways to Apply CORS

If you are dealing with [service providers](/docs/extensions/service-providers), you can override values defined in the configuration file:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Will override the origin defined in the configuration
            // file.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Disabling CORS on Specific Routes

The `UseCors` property is available for both routes and all route attributes and can be disabled with the following example:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## Replacing Values in the Response

You can replace or remove values explicitly in a router action:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Removes the Access-Control-Allow-Credentials header
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Replaces the Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Preflight Requests

A preflight request is an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS) method request that the client sends before the actual request.

The Sisk server will always respond to the request with a `200 OK` and the applicable CORS headers, and then the client can proceed with the actual request. This condition is only not applied when a route exists for the request with the [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) explicitly configured for `Options`.

## Disabling CORS Globally

It is not possible to do this. To not use CORS, do not configure it.
