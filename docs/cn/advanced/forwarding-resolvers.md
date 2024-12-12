##  转发解析器

转发解析器是一种辅助工具，用于解码识别客户端信息，例如通过请求、代理、CDN 或负载均衡器。当您的 Sisk 服务通过反向或转发代理运行时，客户端的 IP 地址、主机名和协议可能与原始请求不同，因为它是从一个服务转发到另一个服务。此 Sisk 功能允许您在处理请求之前控制和解析这些信息。这些代理通常提供有用的标头来识别其客户端。

目前，使用 [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) 类，可以解析客户端 IP 地址、主机名和使用的 HTTP 协议。从 Sisk 版本 1.0 开始，服务器不再具有标准实现来解码这些标头，因为安全原因因服务而异。

例如，`X-Forwarded-For` 标头包含有关转发请求的 IP 地址的信息。代理使用此标头传递一条信息链到最终服务，其中包括所有代理使用的 IP，包括客户端的真实地址。问题是：有时很难识别客户端的远程 IP，并且没有特定的规则来识别此标头。强烈建议您阅读即将要实现的标头的文档：

- 阅读有关 `X-Forwarded-For` 标头的文档 [此处](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns)。
- 阅读有关 `X-Forwarded-Host` 标头的文档 [此处](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host)。
- 阅读有关 `X-Forwarded-Proto` 标头的文档 [此处](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto)。

## ForwardingResolver 类

此类具有三个虚拟方法，允许为每个服务实现最合适的方案。每个方法负责从代理请求中解析信息：客户端的 IP 地址、请求的主机名和使用的安全协议。默认情况下，Sisk 将始终使用原始请求中的信息，而不会解析任何标头。

以下示例演示了如何使用此实现。此示例通过 `X-Forwarded-For` 标头解析客户端的 IP 地址，并在请求中转发多个 IP 时抛出错误。

> [!IMPORTANT]
> 请勿在生产代码中使用此示例。始终检查实现是否适合使用。在实现之前，请阅读标头文档。

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