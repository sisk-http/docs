# SSL の利用

開発時に SSL を利用する必要がある場合があります。これは、ほとんどの Web 開発シナリオのようにセキュリティが求められるコンテキストで作業する場合です。Sisk は HttpListener の上に構築されており、ネイティブの HTTPS はサポートせず HTTP のみを扱います。ただし、Sisk で SSL を利用できる回避策がいくつかあります。以下をご覧ください。

## Sisk.Cadente.CoreEngine を介して

- 利用可能なプラットフォーム: Linux, macOS, Windows
- 作業量: 簡単

追加のコンピュータ設定やプロジェクト設定を行うことなく、Sisk プロジェクトで実験的な **Cadente** エンジンを使用できます。Cadente サーバーを Sisk サーバーで利用できるようにするには、プロジェクトに `Sisk.Cadente.CoreEngine` パッケージをインストールする必要があります。

SSL を構成するには、ビルダーの `UseSsl` と `UseEngine` メソッドを使用します。

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注: このパッケージはまだ実験段階です。

## Windows の IIS を介して

- 利用可能なプラットフォーム: Windows
- 作業量: 中程度

Windows を使用している場合、IIS を利用して HTTP サーバーに SSL を有効にできます。これを行うには、事前に [このチュートリアル](/docs/jp/registering-namespace) に従い、アプリケーションが「localhost」以外のホストでリッスンするように設定しておくことが推奨されます。

この機能を利用するには、Windows の機能から IIS をインストールする必要があります。IIS は Windows および Windows Server ユーザーに無料で提供されています。アプリケーションで SSL を構成するには、自己署名であっても SSL 証明書を用意してください。その後、[IIS 7 以降での SSL 設定方法](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) を参照してください。

## mitmproxy を介して

- 利用可能なプラットフォーム: Linux, macOS, Windows
- 作業量: 簡単

**mitmproxy** は、クライアント（例: Web ブラウザ）とサーバー間の HTTP および HTTPS トラフィックを検査、変更、記録できるインターセプトプロキシツールです。**mitmdump** ユーティリティを使用して、クライアントと Sisk アプリケーション間にリバース SSL プロキシを開始できます。

1. まず、マシンに [mitmproxy](https://mitmproxy.org/) をインストールします。  
2. Sisk アプリケーションを起動します。この例では、非安全な HTTP ポートとして 8000 を使用します。  
3. 安全なポート 8001 でリッスンするように mitmproxy サーバーを起動します。

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

これで準備完了です！`https://localhost:8001/` からアプリケーションにアクセスできます。`mitmdump` を開始するためにアプリケーションが実行中である必要はありません。

あるいは、プロジェクトに [mitmproxy ヘルパー](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) への参照を追加することもできます。この場合でも、コンピュータに mitmproxy がインストールされている必要があります。

## Sisk.SslProxy パッケージを介して

- 利用可能なプラットフォーム: Linux, macOS, Windows
- 作業量: 簡単

> [!IMPORTANT]
> 
> Sisk.SslProxy パッケージは `Sisk.Cadente.CoreEngine` パッケージに置き換えられ、以後メンテナンスされません。

Sisk.SslProxy パッケージは、Sisk アプリケーションで SSL を有効にするシンプルな方法です。ただし、**極めて実験的** なパッケージであり、安定性に欠ける可能性があります。このパッケージを実用的かつ安定したものにするために貢献したい方は、ぜひ少数派の一員となってください。開始するには、次のコマンドで Sisk.SslProxy パッケージをインストールします。

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
> 
> Sisk.SslProxy をインストールするには、Visual Studio のパッケージ マネージャーで「Prerelease を含める」を有効にする必要があります。

再度強調しますが、これは実験的なプロジェクトであり、本番環境での使用は考えないでください。

現在、Sisk.SslProxy は HTTP/1.1 の多くの機能（HTTP Continue、Chunked-Encoding、WebSockets、SSE など）に対応しています。SslProxy の詳細は [こちら](/docs/jp/extensions/ssl-proxy) をご覧ください。