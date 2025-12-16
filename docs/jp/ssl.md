# SSL を使用する

開発の際に SSL を使用する必要がある場合、セキュリティが必要なほとんどの Web 開発シナリオで SSL を使用する必要があります。Sisk は HttpListener 上に動作しますが、HttpListener ではネイティブの HTTPS はサポートされず、HTTP のみがサポートされます。ただし、Sisk で SSL を使用できるようにするための回避策があります。以下にそれらを示します。

## Sisk.Cadente.CoreEngine を介して

- 利用可能: Linux, macOS, Windows
- 努力: 簡単

Sisk プロジェクトで、コンピューターまたはプロジェクトの追加の構成を必要とせずに、実験的な **Cadente** エンジンを使用できます。Cadente サーバーを Sisk サーバーで使用するには、プロジェクトに `Sisk.Cadente.CoreEngine` パッケージをインストールする必要があります。

SSL を構成するには、ビルダーの `UseSsl` と `UseEngine` メソッドを使用できます。

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注意: このパッケージはまだ実験段階です。

## Windows の IIS を介して

- 利用可能: Windows
- 努力: 中

Windows を使用している場合、HTTP サーバーで SSL を有効にするために IIS を使用できます。この方法を使用するには、ホストが "localhost" 以外の場合にアプリケーションをリッスンさせるために、事前に [このチュートリアル](/docs/jp/registering-namespace) を参照することをお勧めします。

この方法を使用するには、Windows 機能を介して IIS をインストールする必要があります。IIS は、Windows および Windows Server ユーザー向けに無料で提供されています。アプリケーションで SSL を構成するには、SSL 証明書を用意する必要があります。次に、[IIS 7 またはそれ以降で SSL を設定する方法](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) を参照できます。

## mitmproxy を介して

- 利用可能: Linux, macOS, Windows
- 努力: 簡単

**mitmproxy** は、開発者とセキュリティ テスターがクライアント (Web ブラウザなど) とサーバー之间の HTTP および HTTPS トラフィックを検査、変更、および記録できるインターセプション プロキシ ツールです。**mitmdump** ユーティリティを使用して、クライアントと Sisk アプリケーションの間にリバース SSL プロキシを開始できます。

1. まず、[mitmproxy](https://mitmproxy.org/) をマシンにインストールします。
2. Sisk アプリケーションを開始します。この例では、不安全な HTTP ポートとして 8000 を使用します。
3. mitmproxy サーバーを開始して、安全なポート 8001 でリッスンします。

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

これで完了です! すでに `https://localhost:8001/` でアプリケーションにアクセスできます。`mitmdump` を開始するには、アプリケーションが実行中である必要はありません。

代わりに、プロジェクトに [mitmproxy ヘルパー](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) の参照を追加できます。これには、コンピューターに mitmproxy がインストールされている必要があります。

## Sisk.SslProxy パッケージを介して

- 利用可能: Linux, macOS, Windows
- 努力: 簡単

> [!IMPORTANT]
>
> Sisk.SslProxy パッケージは、`Sisk.Cadente.CoreEngine` パッケージに代わって廃止され、メンテナンスは行われません。

Sisk.SslProxy パッケージは、Sisk アプリケーションで SSL を有効にするための簡単な方法です。ただし、このパッケージは **非常に実験的** です。このパッケージで作業することは不安定になる可能性がありますが、このパッケージを実用化し、安定させるために貢献する少数の人々の一人になることができます。開始するには、Sisk.SslProxy パッケージをインストールできます。

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Sisk.SslProxy をインストールするには、Visual Studio パッケージ マネージャーで "プレビュー版を含める" を有効にする必要があります。

再び言及しますが、このプロジェクトは実験的であるため、生产環境で使用することを考えるべきではありません。

現在、Sisk.SslProxy は、HTTP Continue、チャンク化されたエンコード、WebSockets、SSE など、HTTP/1.1 のほとんどの機能を処理できます。SslProxy については [こちら](/docs/jp/extensions/ssl-proxy) でさらに詳しく知ることができます。