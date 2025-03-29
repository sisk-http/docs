# SSL を使用する

開発の際に SSL を使用する必要がある場合があります。たとえば、ほとんどの Web 開発シナリオではセキュリティが必要です。Sisk は HttpListener 上で動作しますが、HttpListener ではネイティブの HTTPS はサポートされず、HTTP のみがサポートされます。ただし、Sisk で SSL を使用できるようにするための回避策があります。以下にそれらを示します。

## Windows で IIS を使用する

- 使用可能: Windows
- 努力: 中

Windows を使用している場合、IIS を使用して HTTP サーバーで SSL を有効にすることができます。この方法を使用するには、"localhost" 以外のホストでアプリケーションをリッスンさせたい場合は、事前に [このチュートリアル](/docs/jp/registering-namespace) を参照することをお勧めします。

この方法を使用するには、Windows 機能を介して IIS をインストールする必要があります。IIS は、Windows と Windows Server ユーザー向けに無料で提供されています。アプリケーションで SSL を構成するには、セルフサイン証明書であっても SSL 証明書を用意する必要があります。次に、[IIS 7 またはそれ以降で SSL を設定する方法](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) を参照できます。

## mitmproxy を使用する

- 使用可能: Linux, macOS, Windows
- 努力: 簡単

**mitmproxy** は、開発者とセキュリティ テスターがクライアント (たとえば Web ブラウザ) とサーバー之间の HTTP および HTTPS トラフィックを検査、変更、および記録できるようにするためのインターセプション プロキシ ツールです。**mitmdump** ユーティリティを使用して、クライアントと Sisk アプリケーションの間にリバース SSL プロキシを開始できます。

1. まず、[mitmproxy](https://mitmproxy.org/) をマシンにインストールします。
2. Sisk アプリケーションを開始します。この例では、8000 ポートを非安全な HTTP ポートとして使用します。
3. mitmproxy サーバーを開始して、8001 ポートでセキュア ポートをリッスンします。

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

これで完了です! すでに `https://localhost:8001/` でアプリケーションを使用できます。`mitmdump` を開始するには、アプリケーションが実行中である必要はありません。

代わりに、プロジェクトに [mitmproxy ヘルパー](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) の参照を追加できます。ただし、mitmproxy がコンピューターにインストールされている必要があります。

## Sisk.SslProxy パッケージを使用する

- 使用可能: Linux, macOS, Windows
- 努力: 簡単

Sisk.SslProxy パッケージは、Sisk アプリケーションで SSL を有効にするための簡単な方法です。ただし、このパッケージは **非常に実験的** です。このパッケージで作業することは不安定になる可能性がありますが、このパッケージを実用的なものにするために貢献する少数の人々の一人になることができます。開始するには、次のように Sisk.SslProxy パッケージをインストールできます。

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Visual Studio パッケージ マネージャーで "プレビュー パッケージの有効化" を有効にする必要があります。

再び言いますが、このプロジェクトは実験的ですので、生产環境で使用することを考えるべきではありません。

現在、Sisk.SslProxy は、HTTP Continue、チャンク化、WebSockets、SSE を含むほとんどの HTTP/1.1 機能を処理できます。SslProxy についてさらに詳しくは [こちら](/docs/jp/extensions/ssl-proxy) を参照してください。