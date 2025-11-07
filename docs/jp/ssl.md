# SSL で作業する

開発時に SSL を使用する必要がある場合があります。これは、ほとんどの Web 開発シナリオのようにセキュリティが必要なコンテキストで発生します。Sisk は HttpListener の上に構築されており、ネイティブ HTTPS をサポートせず、HTTP のみをサポートします。ただし、Sisk で SSL を使用できるワークアラウンドがあります。以下で確認してください。

## Sisk.Cadente.CoreEngine を介して

- 対応 OS: Linux、macOS、Windows
- 労力: 簡単

Sisk プロジェクトで実験的な **Cadente** エンジンを使用することが可能です。コンピュータやプロジェクトに追加の設定を必要とせずに使用できます。Cadente サーバーを Sisk サーバーで使用できるようにするには、プロジェクトに `Sisk.Cadente.CoreEngine` パッケージをインストールする必要があります。

SSL を構成するには、ビルダーの `UseSsl` と `UseEngine` メソッドを使用できます。

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> 注: このパッケージはまだ実験段階です。

## Windows の IIS を介して

- 対応 OS: Windows
- 労力: 中程度

Windows を使用している場合、IIS を使用して HTTP サーバーで SSL を有効にできます。これを機能させるには、アプリケーションが「localhost」以外のホストでリッスンする場合は、事前に [このチュートリアル](/docs/jp/registering-namespace) に従うことをお勧めします。

これを機能させるには、Windows の機能を通じて IIS をインストールする必要があります。IIS は Windows および Windows Server ユーザーに無料で提供されています。アプリケーションで SSL を構成するには、SSL 証明書を用意してください（自己署名でも構いません）。次に、[IIS 7 以降で SSL を設定する方法](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) を確認できます。

## mitmproxy を介して

- 対応 OS: Linux、macOS、Windows
- 労力: 簡単

**mitmproxy** は、開発者やセキュリティテスターがクライアント（Web ブラウザなど）とサーバー間の HTTP および HTTPS トラフィックを検査、変更、記録できるインターセプトプロキシツールです。**mitmdump** ユーティリティを使用して、クライアントと Sisk アプリケーション間でリバース SSL プロキシを開始できます。

1. まず、マシンに [mitmproxy](https://mitmproxy.org/) をインストールします。
2. Sisk アプリケーションを起動します。この例では、非安全な HTTP ポートとして 8000 を使用します。
3. mitmproxy サーバーを安全なポート 8001 でリッスンさせます：

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

これで準備完了です！ `https://localhost:8001/` を介してアプリケーションにアクセスできます。`mitmdump` を開始するためにアプリケーションが実行されている必要はありません。

また、プロジェクトに [mitmproxy ヘルパー](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) を参照として追加することもできます。これには、mitmproxy がコンピュータにインストールされている必要があります。

## Sisk.SslProxy パッケージを介して

- 対応 OS: Linux、macOS、Windows
- 労力: 簡単

> [!IMPORTANT]
>
> Sisk.SslProxy パッケージは `Sisk.Cadente.CoreEngine` パッケージに置き換えられ、以後メンテナンスされません。

Sisk.SslProxy パッケージは、Sisk アプリケーションで SSL を有効にする簡単な方法です。ただし、これは **非常に実験的** なパッケージです。このパッケージを使用すると不安定になる可能性がありますが、パッケージを実用的かつ安定化させるために貢献する少数の人々の一員になることができます。開始するには、次のように Sisk.SslProxy パッケージをインストールします：

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Visual Studio パッケージマネージャーで「Include prerelease」を有効にして Sisk.SslProxy をインストールする必要があります。

再度、これは実験プロジェクトであるため、本番環境に投入することは考えないでください。

現在、Sisk.SslProxy は HTTP/1.1 のほとんどの機能（HTTP Continue、Chunked-Encoding、WebSockets、SSE）を処理できます。SslProxy については、[こちら](/docs/jp/extensions/ssl-proxy) をご覧ください。