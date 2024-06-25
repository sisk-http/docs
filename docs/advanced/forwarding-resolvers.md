# Forwarding Resolvers

A Forwarding Resolver is a helper that helps decode information that identifies the client through a request, proxy, CDN or load-balancers. When your Sisk service runs through a reverse or forward proxy, the client's IP address, host and protocol may be different from the original request as it is a forwarding from one service to another. This Sisk functionality allows you to control and resolve this information before working with the request. These proxies usually provide useful headers to identify their client.

Currently, with the [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) class, it is possible to resolve the client IP address, host, and HTTP protocol used. After version 1.0 of Sisk, the server no longer has a standard implementation to decode these headers for security reasons that vary from service to service.

For example, the `X-Forwarded-For` header includes information about the IP addresses that forwarded the request. This header is used by proxies to carry a chain of information to the final service and includes the IP of all proxies used, including the client's real address. The problem is: sometimes it is challenging to identify the client's remote IP and there is no specific rule to identify this header. It is highly recommended to read the documentation for the headers you are about to implement below:

- Read about the `X-Forwarded-For` header [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns).
- Read about the `X-Forwarded-Host` header [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host).
- Read about the `X-Forwarded-Proto` header [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto).

## The ForwardingResolver class

This class has three virtual methods that allow the most appropriate implementation for each service. Each method is responsible for resolving information from the request through a proxy: the client's IP address, the host of the request and the security protocol used. By default, Sisk will always use the information from the original request, without resolving any headers.

The example below shows how this implementation can be used. This example resolves the client's IP through the `X-Forwarded-For` header and throws an error when more than one IP was forwarded in the request.

> [!IMPORTANT]
> Do not use this example in production code. Always check if the implementation is appropriate for use. Read the header documentation before implementing it.

```cs
class Program
{
    static void Main(string[] args)
    {
        using var host = HttpServer.CreateBuilder()
            .UseForwardingResolver<Resolver>()
            .UseListeningPort(5555)
            .Build();

        host.Router.SetRoute(RouteMethod.Any, Route.AnyPath, request =>
            new HttpResponse("Hello, world!!!"));

        host.Start();
    }

    class Resolver : ForwardingResolver
    {
        public override IPAddress OnResolveClientAddress(HttpRequest request, IPEndPoint connectingEndpoint)
        {
            string? forwardedFor = request.Headers.XForwardedFor;
            if (forwardedFor is null)
            {
                throw new Exception("The X-Forwarded-For header is missing.");
            }
            string[] ipAddresses = forwardedFor.Split(',');
            if (ipAddresses.Length != 1)
            {
                throw new Exception("Too many addresses in the X-Forwarded-For header.");
            }

            return IPAddress.Parse(ipAddresses[0]);
        }
    }
}
```