---
title: "フォワーディングリゾルバ"
linkTitle: "転送リゾルバー"
weight: 30
aliases:
  - "/docs/jp/advanced/forwarding-resolvers.html"
sourceHash: "10f8777c8228e888"
---

フォワーディングリゾルバは、リクエスト、プロキシ、CDN、ロードバランサーを通じてクライアントを識別する情報をデコードするのに役立つヘルパーです。Sisk サービスがリバースプロキシまたはフォワードプロキシを介して実行される場合、クライアントの IP アドレス、ホスト、プロトコルは元のリクエストとは異なることがあります。これは、あるサービスから別のサービスへ転送されるためです。この Sisk の機能により、リクエストを処理する前にこの情報を制御・解決できます。これらのプロキシは通常、クライアントを識別するための有用なヘッダーを提供します。

現在、[ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) クラスを使用すると、クライアントの IP アドレス、ホスト、使用された HTTP プロトコルを解決することが可能です。Sisk のバージョン 1.0 以降、サーバーはサービスごとに異なるセキュリティ上の理由から、これらのヘッダーをデコードする標準実装を提供しなくなりました。

たとえば、`X-Forwarded-For` ヘッダーにはリクエストを転送した IP アドレスの情報が含まれます。このヘッダーはプロキシが情報のチェーンを最終サービスへ渡すために使用され、使用されたすべてのプロキシの IP とクライアントの実際のアドレスが含まれます。問題は、クライアントのリモート IP を特定するのが難しいことがあり、このヘッダーを識別するための具体的なルールが存在しない点です。以下のヘッダーに関するドキュメントを必ずお読みください。

- `X-Forwarded-For` ヘッダーについては[こちら](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns)をご参照ください。
- `X-Forwarded-Host` ヘッダーについては[こちら](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-Host)をご参照ください。
- `X-Forwarded-Proto` ヘッダーについては[こちら](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-Proto)をご参照ください。

## ForwardingResolver クラス

このクラスには、各サービスに最適な実装を可能にする 3 つの仮想メソッドが用意されています。各メソッドは、プロキシを介したリクエストから情報を解決する役割を担い、クライアントの IP アドレス、リクエストのホスト、使用されたセキュリティプロトコルを取得します。デフォルトでは、Sisk はヘッダーを解決せず、元のリクエストに含まれる情報を常に使用します。

以下の例は、この実装の使用方法を示しています。この例では `X-Forwarded-For` ヘッダーを使ってクライアントの IP を解決し、リクエストに複数の IP が転送されている場合はエラーをスローします。

> [!IMPORTANT]
> 本例を本番コードで使用しないでください。実装が使用に適切かどうか必ず確認し、実装前にヘッダーのドキュメントを読んでください。

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
