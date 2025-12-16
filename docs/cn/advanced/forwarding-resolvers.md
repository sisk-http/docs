# 转发解析器

转发解析器是帮助解码通过请求、代理、CDN 或负载均衡器识别客户端信息的辅助工具。当您的 Sisk 服务运行通过反向或正向代理时，客户端的 IP 地址、主机和协议可能与原始请求不同，因为这是从一个服务到另一个服务的转发。这个 Sisk 功能允许您在处理请求之前控制和解析此信息。这些代理通常提供有用的头部来识别其客户端。

目前，使用 [ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) 类，可以解析客户端 IP 地址、主机和使用的 HTTP 协议。在 Sisk 1.0 版本之后，服务器不再有标准实现来解码这些头部，因为安全原因因服务而异。

例如，`X-Forwarded-For` 头部包含有关转发请求的 IP 地址的信息。这个头部由代理使用，以携带一系列信息到最终服务，并包括所有使用的代理的 IP 地址，包括客户端的真实地址。问题是：有时很难识别客户端的远程 IP 地址，并且没有特定的规则来识别这个头部。强烈推荐阅读以下要实现的头部的文档：

- 阅读关于 `X-Forwarded-For` 头部的信息 [这里](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns)。
- 阅读关于 `X-Forwarded-Host` 头部的信息 [这里](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-Host)。
- 阅读关于 `X-Forwarded-Proto` 头部的信息 [这里](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-Proto)。

## ForwardingResolver 类

这个类有三个虚拟方法，允许为每个服务实现最合适的解决方案。每个方法负责通过代理解析请求的信息：客户端的 IP 地址、请求的主机和使用的安全协议。默认情况下，Sisk 将始终使用原始请求的信息，而不解析任何头部。

下面的示例显示了如何使用此实现。这个示例通过 `X-Forwarded-For` 头部解析客户端的 IP 地址，并在请求中转发多个 IP 地址时抛出错误。

> [!IMPORTANT]
> 不要在生产代码中使用此示例。始终检查实现是否适合使用。在实现之前阅读头部文档。

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