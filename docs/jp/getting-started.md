# はじめに

Sisk ドキュメントへようこそ！

最後に、Sisk フレームワークとは何か？それは、.NET で構築されたオープンソースの軽量ライブラリで、最小限、柔軟性、抽象性を目指して設計されています。開発者は、わずかな設定、あるいは設定不要で、インターネットサービスを迅速に作成できます。Sisk により、既存のアプリケーションに管理された HTTP モジュールを追加することが可能で、完全に使い捨て可能です。

Sisk の価値観には、コードの透明性、モジュラー性、パフォーマンス、スケーラビリティがあり、Restful、JSON-RPC、Web-sockets など、さまざまな種類のアプリケーションを処理できます。

その主なリソースには：

| リソース | 説明 |
| ------- | --------- |
| [ルーティング](/docs/jp/fundamentals/routing) | プレフィックス、カスタム メソッド、パス変数、レスポンス変換などをサポートするパス ルーター。 |
| [リクエスト ハンドラー](/docs/jp/fundamentals/request-handlers) | ミドルウェアとしても知られており、リクエストの前後に動作する独自のリクエスト ハンドラーを構築するためのインターフェイスを提供します。 |
| [圧縮](/docs/jp/fundamentals/responses#gzip-deflate-and-brotli-compression) | Sisk を使用してレスポンスを簡単に圧縮します。 |
| [Web ソケット](/docs/jp/features/websockets) | 完全な Web ソケットを受け付けるルートを提供し、クライアントへの読み取りと書き込みが可能です。 |
| [サーバー送信イベント](/docs/jp/features/server-sent-events) | SSE プロトコルをサポートするクライアントにサーバー イベントを送信します。 |
| [ログ](/docs/jp/features/logging) | ログの簡素化。エラー、ログ、サイズによるローテーション ログ、同じログの複数の出力ストリームなどを定義します。 |
| [マルチ ホスト](/docs/jp/advanced/multi-host-setup) | HTTP サーバーを複数のポートで実行し、各ポートに独自のルーターを持ち、各ルーターに独自のアプリケーションを設定します。 |
| [サーバー ハンドラー](/docs/jp/advanced/http-server-handlers) | HTTP サーバーの独自の実装を拡張します。拡張機能、改善、ニューフィーチャーを追加します。

## 最初のステップ

Sisk は、任意の .NET 環境で実行できます。このガイドでは、.NET を使用して Sisk アプリケーションを作成する方法を教えます。まだインストールしていない場合は、[こちら](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) から SDK をダウンロードしてください。

このチュートリアルでは、プロジェクト構造の作成、リクエストの受信、URL パラメータの取得、レスポンスの送信について説明します。このガイドでは、C# を使用してシンプルなサーバーを構築することに焦点を当てています。好みのプログラミング言語を使用することもできます。

> [!NOTE]
> クイックスタート プロジェクトに興味がある場合は、[このリポジトリ](https://github.com/sisk-http/quickstart) を参照してください。

## プロジェクトの作成

プロジェクト名を "My Sisk Application" とします。.NET を設定したら、次のコマンドでプロジェクトを作成できます。

```bash
dotnet new console -n my-sisk-application
```

次に、プロジェクト ディレクトリに移動し、.NET ユーティリティ ツールを使用して Sisk をインストールします。

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Sisk をプロジェクトにインストールするその他の方法については、[こちら](https://www.nuget.org/packages/Sisk.HttpServer/) を参照してください。

さて、HTTP サーバーのインスタンスを作成しましょう。この例では、ポート 5000 でリッスンするように構成します。

## HTTP サーバーの構築

Sisk では、HttpServer オブジェクトにルーティングすることで、アプリケーションを手動で段階的に構築できます。ただし、ほとんどのプロジェクトではこれは便利ではありません。したがって、ビルダー メソッドを使用して、アプリケーションを簡単に起動できます。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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

Sisk の各重要なコンポーネントを理解することは重要です。このドキュメントの後半では、Sisk のしくみについてさらに詳しく説明します。

## 手動 (高度な) 設定

Sisk の各メカニズムの動作と、HttpServer、Router、ListeningPort、他のコンポーネント間の関係については、[このセクション](/docs/jp/advanced/manual-setup) を参照してください。