# フォワーディング リゾルバー

フォワーディング リゾルバーは、クライアントを識別する情報をデコードするヘルパーです。リクエスト、プロキシ、CDN、またはロード バランサーを介して。Sisk サービスがリバース プロキシまたはフォワード プロキシを介して実行される場合、クライアントの IP アドレス、ホスト、およびプロトコルは、元のリクエストとは異なる場合があります。これは、サービス間のフォワーディングであるためです。この Sisk 機能により、リクエストを処理する前にこの情報を解決して制御できます。これらのプロキシは、クライアントを識別するために役立つヘッダーを提供します。

現在、[ForwardingResolver](/api/Sisk.Core.Http.ForwardingResolver) クラスを使用すると、クライアントの IP アドレス、ホスト、および使用される HTTP プロトコルを解決できます。Sisk のバージョン 1.0 以降、サーバーにはこれらのヘッダーをデコードするための標準実装がなくなりました。これは、サービスごとに異なるセキュリティ上の理由があるためです。

たとえば、`X-Forwarded-For` ヘッダーには、リクエストをフォワードした IP アドレスに関する情報が含まれます。このヘッダーは、プロキシによって使用され、最終的なサービスに情報のチェーンを運ぶために使用され、クライアントの実際のアドレスを含むすべてのプロキシの IP アドレスが含まれます。問題は、クライアントのリモート IP を識別するのが難しい場合があり、ヘッダーを識別するための特定のルールがないことです。以下のヘッダーを実装する前に、ドキュメントを読むことを強くお勧めします。

- [`X-Forwarded-For` ヘッダー](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-For#security_and_privacy_concerns) について読む。
- [`X-Forwarded-Host` ヘッダー](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-Host) について読む。
- [`X-Forwarded-Proto` ヘッダー](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/X-Forwarded-Proto) について読む。

## ForwardingResolver クラス

このクラスには、各サービスに最も適した実装を可能にする 3 つの仮想メソッドがあります。各メソッドは、プロキシを介したリクエストから情報を解決する責任があります。クライアントの IP アドレス、リクエストのホスト、および使用されるセキュリティ プロトコルです。デフォルトでは、Sisk は常に元のリクエストの情報を使用し、ヘッダーを解決しません。

以下の例は、この実装を使用する方法を示しています。この例では、`X-Forwarded-For` ヘッダーを介してクライアントの IP を解決し、リクエストで複数の IP がフォワードされた場合にエラーをスローします。

> [!IMPORTANT]
> この例を生産コードで使用しないでください。実装が使用するために適切であることを常に確認してください。ヘッダーを実装する前にドキュメントを読んでください。

```csharp
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