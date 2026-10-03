# Getting started

Source: https://docs.sisk-framework.org/ja/docs/getting-started.html

Welcome to the Sisk documentation!

Sisk is an open-source lightweight HTTP framework for .NET. You can use it to build a standalone web service, embed an HTTP module inside an existing application, or run a service behind a reverse proxy with only the configuration you need.

Sisk's values include code transparency, modularity, performance, and scalability. It can handle different application styles, including RESTful APIs, JSON-RPC services, WebSockets, Server-Sent Events, and static file serving.

It's main features includes：

| リソース | 説明 |
| ------- | --------- |
| [Routing](https://docs.sisk-framework.org/ja/docs/fundamentals/routing.md) | プレフィックス、カスタムメソッド、パス変数、値コンバータなどをサポートするパスルーターです。 |
| [Request Handlers](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md) | *ミドルウェア* とも呼ばれ、アクションの前後でリクエストと連携する独自のリクエストハンドラを構築するためのインターフェースを提供します。 |
| [Compression](https://docs.sisk-framework.org/ja/docs/fundamentals/responses.md#gzip-deflate-and-brotli-compression) | Sisk を使ってレスポンス内容を簡単に圧縮できます。 |
| [Web sockets](https://docs.sisk-framework.org/ja/docs/features/websockets.md) | クライアントとの読み書きが可能な完全な WebSocket を受け入れるルートを提供します。 |
| [Server-sent events](https://docs.sisk-framework.org/ja/docs/features/server-sent-events.md) | SSE プロトコルをサポートするクライアントへサーバーイベントを送信する機能を提供します。 |
| [Logging](https://docs.sisk-framework.org/ja/docs/features/logging.md) | シンプルなロギング。エラーやアクセスのログ、サイズでローテーションするログ、同一ログへの複数出力ストリームなどを定義できます。 |
| [Multi-host](https://docs.sisk-framework.org/ja/docs/advanced/multi-host-setup.md) | 複数ポート用の HTTP サーバーを持ち、各ポートが独自のルーターを、各ルーターが独自のアプリケーションを持ちます。 |
| [Server handlers](https://docs.sisk-framework.org/ja/docs/advanced/http-server-handlers.md) | HTTP サーバーの独自実装を拡張します。拡張機能や改善、新機能でカスタマイズできます。 |

## 最初のステップ

Sisk は任意の .NET 環境で実行できます。このガイドでは、.NET を使用して Sisk アプリケーションを作成する方法を説明します。まだインストールしていない場合は、[こちら](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)から SDK をダウンロードしてください。

このチュートリアルでは、プロジェクト構成の作成、リクエストの受信、URL パラメータの取得、レスポンスの送信方法を扱います。このガイドは C# を使用したシンプルなサーバー構築に焦点を当てています。好きなプログラミング言語でも使用できます。

> [!NOTE]
> クイックスタートプロジェクトに興味があるかもしれません。詳細は [このリポジトリ](https://github.com/sisk-http/quickstart) をご確認ください。

## プロジェクトの作成

プロジェクト名を「My Sisk Application」にしましょう。.NET の環境が整ったら、次のコマンドでプロジェクトを作成できます：

```bash
dotnet new console -n my-sisk-application
```

次に、プロジェクトディレクトリへ移動し、.NET ユーティリティツールで Sisk をインストールします：

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

プロジェクトに Sisk をインストールする他の方法は、[こちら](https://www.nuget.org/packages/Sisk.HttpServer/) にあります。

それでは、HTTP サーバーのインスタンスを作成しましょう。この例ではポート 5000 でリッスンするように設定します。

## HTTP サーバーの構築

Sisk は HttpServer オブジェクトへルーティングする形で、手動でステップバイステップにアプリケーションを構築できますが、ほとんどのプロジェクトではあまり便利ではありません。そのため、ビルダー メソッドを使用すれば、アプリを簡単に起動できます。

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
            .Build();
        
        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hello, world!")
            };
        });
        
        await app.StartAsync();
    }
}
```

Sisk の重要なコンポーネントを理解することが重要です。このドキュメントの後半で、Sisk の仕組みについてさらに学べます。

## 手動（高度）設定

ドキュメントの [このセクション](https://docs.sisk-framework.org/ja/docs/advanced/manual-setup.md) では、HttpServer、Router、ListeningPort など各コンポーネントの動作と関係性について学べます。
