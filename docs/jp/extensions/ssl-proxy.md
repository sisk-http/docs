# SSL Proxy

> [!WARNING]
> この機能は実験的であり、運用環境では使用しないでください。Sisk を SSL で動作させる方法については、[このドキュメント](/docs/jp/deploying.html#proxying-your-application) を参照してください。

Sisk SSL Proxy は、Sisk の [ListeningHost](/api/Sisk.Core.Http.ListeningHost) に HTTPS 接続を提供し、HTTPS メッセージを非安全な HTTP コンテキストにルーティングするモジュールです。このモジュールは、SSL をサポートしない [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) を使用して実行されるサービスに SSL 接続を提供するために構築されました。

プロキシは同じアプリケーション内で実行され、HTTP/1.1 メッセージをリッスンし、同じプロトコルで Sisk に転送します。現在、この機能は非常に実験的であり、運用環境で使用するには不安定すぎる可能性があります。

現在、SslProxy は、キープアライブ、チャンク化されたエンコード、WebSockets など、ほとんどの HTTP/1.1 機能をサポートしています。SSL プロキシへのオープン接続の場合、ターゲット サーバーに TCP 接続が作成され、プロキシは確立された接続に転送されます。

SslProxy は、次のように HttpServer.CreateBuilder と共に使用できます。

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // プロジェクトに SSL を追加
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

プロキシに有効な SSL 証明書を提供する必要があります。ブラウザによって証明書が受け入れられるようにするには、オペレーティング システムに証明書をインポートして、正しく機能するようにします。