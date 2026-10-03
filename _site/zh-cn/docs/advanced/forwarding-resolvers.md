# 转发解析器

Source: https://docs.sisk-framework.org/zh-cn/docs/advanced/forwarding-resolvers.html

Forwarding Resolver 是一个帮助解码通过请求、代理、CDN 或负载均衡器识别客户端信息的工具。当您的 Sisk 服务通过反向或正向代理运行时，客户端的 IP 地址、主机和协议可能与原始请求不同，因为这是从一个服务转发到另一个服务。此 Sisk 功能允许您在处理请求之前控制并解析这些信息。这些代理通常会提供有用的头部来识别其客户端。

目前，使用 [ForwardingResolver](https://docs.sisk-framework.org/api/Sisk.Core.Http.ForwardingResolver.md) 类，可以解析客户端的 IP 地址、主机以及使用的 HTTP 协议。自 Sisk 1.0 版本之后，出于安全原因且因服务而异，服务器不再提供标准实现来解码这些头部。

例如，`X-Forwarded-For` 头部包含了转发请求的 IP 地址信息。代理使用此头部将信息链传递给最终服务，并包含所有使用的代理的 IP，包括客户端的真实地址。问题在于：有时很难识别客户端的远程 IP，并且没有特定的规则来识别此头部。强烈建议阅读下面即将实现的头部文档：

- 阅读关于 `X-Forwarded-For` 头部的文档[此处](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns)。
- 阅读关于 `X-Forwarded-Host` 头部的文档[此处](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-Host)。
- 阅读关于 `X-Forwarded-Proto` 头部的文档[此处](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/X-Forwarded-Proto)。

## ForwardingResolver 类

此类拥有三个虚方法，允许为每个服务提供最合适的实现。每个方法负责通过代理解析请求中的信息：客户端的 IP 地址、请求的主机以及使用的安全协议。默认情况下，Sisk 将始终使用原始请求中的信息，而不解析任何头部。

下面的示例展示了如何使用此实现。该示例通过 `X-Forwarded-For` 头部解析客户端的 IP，并在请求中转发了多个 IP 时抛出错误。

> [!IMPORTANT]
> 请勿在生产代码中使用此示例。始终检查实现是否适合使用。在实现之前请阅读头部文档。

```cs
class Program
{
    static void Main(string[] args)
    {
        using var host = HttpServer.CreateBuilder()
            .UseForwardingResolver<Resolver>()
            .UseListeningPort(5555)
            .Build();

        host.Router.MapAny(Route.AnyPath, request =>
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
