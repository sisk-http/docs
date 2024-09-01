# SSL Proxy

> [!WARNING]
> This feature is experimental and should not be used in production. Please refer to [this document](/docs/deploying.html#proxying-your-application) if you want to make Sisk work with SSL.

The Sisk SSL Proxy is a module that provides an HTTPS connection for a [ListeningHost](/api/Sisk.Core.Http.ListeningHost) in Sisk and routes HTTPS messages to an insecure HTTP context. The module was built to provide SSL connection for a service that uses [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) to run, which does not support SSL.

The proxy runs within the same application and listens for HTTP/1.1 messages, forwarding them in the same protocol to Sisk. Currently, this feature is highly experimental and may be unstable enough to not be used in production.

At present, the SslProxy supports almost all HTTP/1.1 features, such as keep-alive, chunked encoding, websockets, etc. For an open connection to the SSL proxy, a TCP connection is created to the target server, and the proxy is forwarded to the established connection.

The SslProxy can be used with HttpServer.CreateBuilder as follows:

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // add SSL to the project
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

You must provide a valid SSL certificate for the proxy. To ensure that the certificate is accepted by browsers, remember to import it into the operating system so that it functions correctly.