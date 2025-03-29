# SSLの使用

開発の際にSSLを使用する必要がある場合があります。たとえば、ほとんどのWeb開発シナリオではセキュリティが必要です。SiskはHttpListener上で動作しますが、HttpListenerはネイティブではHTTPSをサポートしていません。ただし、SiskでSSLを使用できるようにするための回避策があります。以下にそれらを示します。

## WindowsのIISを使用する

- 使用可能なプラットフォーム: Windows
- 努力: 中

Windowsを使用している場合、IISを使用してHTTPサーバーでSSLを有効にすることができます。この方法を使用するには、[このチュートリアル](/docs/registering-namespace)を事前に参照しておくことをお勧めします。そうすることで、アプリケーションを「localhost」以外のホストでリッスンさせることができます。

この方法を使用するには、Windowsの機能を介してIISをインストールする必要があります。IISは、WindowsおよびWindows Serverのユーザーが無料で使用できます。アプリケーションでSSLを構成するには、SSL証明書を用意しておく必要があります。自署証明書でもかまいません。次に、[IIS 7以上でSSLを設定する方法](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)を参照できます。

## mitmproxyを使用する

- 使用可能なプラットフォーム: Linux, macOS, Windows
- 努力: 簡単

**mitmproxy**は、開発者とセキュリティーテスターがクライアント（たとえばWebブラウザ）とサーバーの間のHTTPおよびHTTPSトラフィックを検査、変更、記録できるインターセプトプロキシツールです。**mitmdump**ユーティリティを使用して、クライアントとSiskアプリケーションの間でリバースSSLプロキシを開始できます。

1. まず、[mitmproxy](https://mitmproxy.org/)をマシンにインストールします。
2. Siskアプリケーションを起動します。この例では、8000ポートを非安全なHTTPポートとして使用します。
3. mitmproxyサーバーを起動して、8001ポートでセキュアなポートをリッスンします。

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

これで完了です!すでにアプリケーションを`https://localhost:8001/`経由で使用できます。`mitmdump`を開始するために、アプリケーションを実行する必要はありません。

代わりに、プロジェクトに[mitmproxyヘルパー](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy)への参照を追加できます。ただし、mitmproxyがコンピューターにインストールされている必要があります。

## Sisk.SslProxyパッケージを使用する

- 使用可能なプラットフォーム: Linux, macOS, Windows
- 努力: 簡単

Sisk.SslProxyパッケージは、SiskアプリケーションでSSLを有効にするための簡単な方法です。ただし、このパッケージは**非常に実験的**です。このパッケージを使用することは不安定になる可能性がありますが、安定したパッケージにするために貢献する少数の人々の一人になることができます。開始するには、Sisk.SslProxyパッケージを次のようにインストールできます。

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Visual Studioパッケージマネージャーで「プレビュー版パッケージの有効化」を有効にする必要があります。

再び言いますが、このプロジェクトは実験的であるため、生产環境で使用することを考えるべきではありません。

現在、Sisk.SslProxyは、HTTP Continue、チャンク化、WebSockets、SSEを含むほとんどのHTTP/1.1機能を処理できます。SslProxyについては[こちら](/docs/extensions/ssl-proxy)でさらに詳しく知ることができます。