# 手動（上級）セットアップ

Source: https://docs.sisk-framework.org/ja/docs/advanced/manual-setup.html

サーバーの部品を自分で組み立てる必要がある場合、たとえば 1 つのプロセスが複数のホスト、ポート、ルーター、またはカスタムサーバー構成を公開しなければならない場合に手動設定を使用します。ほとんどのアプリケーションでは、ビルダー API の方が短く、優先すべきです。手動設定は、`Router`、1 つ以上の `ListeningHost` オブジェクト、`HttpServerConfiguration`、最終的な `HttpServer` の 4 つのコア部品を直接制御したいときに便利です。

まず、リクエスト/レスポンスの概念を理解する必要があります。これは非常にシンプルです。すべてのリクエストに対してレスポンスが必要です。Sisk もこの原則に従います。ステータスコードとヘッダーを指定した、HTML の「Hello, World!」メッセージで応答するメソッドを作成しましょう。

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

次のステップは、このメソッドを HTTP ルートに関連付けることです。

## ルーター

ルーターはリクエストルートの抽象化であり、サービスのリクエストとレスポンスの橋渡しを行います。ルーターはサービスルート、関数、エラーを管理します。

ルーターは複数のルートを持つことができ、各ルートは関数の実行、ページの提供、サーバーからのリソース提供など、パスに対してさまざまな操作を実行できます。

最初のルーターを作成し、`IndexPage` メソッドをインデックスパスに関連付けましょう。

```csharp
Router mainRouter = new Router;

mainRouter.MapGet("/", IndexPage);
```

これでルーターはリクエストを受け取りレスポンスを返すことができます。ただし、`mainRouter` はホストやサーバーに紐付いていないため、単体では機能しません。次のステップは `ListeningHost` を作成することです。

## リスニングホストとポート

[ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) はルーターと同じルーター用の複数のリスニングポートをホストできます。[ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) は HTTP サーバーがリッスンするプレフィックスです。

ここでは、ルーターに対して 2 つのエンドポイントを指す `ListeningHost` を作成します。

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

これで HTTP サーバーは指定されたエンドポイントでリッスンし、リクエストをルーターに転送します。

## サーバー構成

サーバー構成は HTTP サーバー自体の動作の大部分を担当します。この構成では `ListeningHost` をサーバーに関連付けることができます。

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // このサーバー構成に ListeningHost を追加します
```

一般的なサーバー構成オプション:

| プロパティ | デフォルト | 使用シーン | 備考 |
| --- | --- | --- | --- |
| [RemoteRequestsAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.md) | `RequestListenAction.Accept` | サービスは、信頼できるリバースプロキシ経由でない限り、ローカル以外のリクエストを拒否すべきです。 | `Drop` に設定するのは、デプロイトポロジーが明確な場合のみです。 |
| [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md) | `false` | クライアントまたはプロキシが `X-Request-Id` 応答ヘッダーに Sisk のリクエスト ID を必要とする場合。 | `HttpRequest.RequestId` を含むログと組み合わせて使用してください。 |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout.md) | `120` seconds | アイデル状態の Keep-Alive 接続は、遅かれ早かれ閉じるべきです。 | これは HTTP エンジンによって適用されます。 |
| [NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md) | `false` | ヘッダーのエンコーディングが一致しない場合。 | 処理コストがかかります。必要なければ無効のままにしてください。 |
| [SendSiskHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader.md) | `true` | `X-Powered-By` Sisk ヘッダーを隠すか公開したい場合。 | 本番環境でより厳格なヘッダー方針が必要な場合は無効にしてください。 |
| [OptionsLogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode.md) | `LogOutput.Both` | 自動 `OPTIONS` 処理で生成されるログを削減またはリダイレクトしたい場合。 | ルートと同じログモードの値を使用します。 |
| [AsyncRequestProcessing](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing.md) | `true` | 診断のために決定的な単一リクエスト処理が必要な場合。 | 無効にするとスループットが制限されます。 |
| [DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md) | `true` | `IDisposable` を実装するリクエストバッグの値を自動的に破棄すべき場合。 | 所有権が他で管理されていない限り、有効のままにしてください。 |
| [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) | `true` | 値ハンドラが非同期列挙可能をブロッキング列挙可能として受け取るべき場合。 | 独自の非同期ストリーム処理を実装する場合は無効にしてください。 |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive.md) | `true` | レスポンス後も接続を再利用可能にすべき場合。 | 永続接続をうまく扱えないクライアントや中間サーバーの場合は無効にしてください。 |
| [ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md) | `false` | GET ルートを末尾スラッシュ付き URL にリダイレクトすべき場合。 | 正規表現以外のルートにのみ適用されます。 |
| [MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md) | `0` | リクエストボディにサイズ上限が必要な場合。 | `0` はフレームワークまたはメモリ上限に達するまで無制限を意味します。 |
| [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md) | `false` | クライアントがサポートしている場合、レスポンスを自動的に圧縮すべき場合。 | 既存の `CompressedContent` レスポンスは再度圧縮されません。 |

次に、HTTP サーバーを作成します。

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // サーバーを起動します
Console.ReadKey(); // アプリケーションが終了しないようにします
```

これで実行ファイルをコンパイルし、次のコマンドで HTTP サーバーを起動できます。

```bash
dotnet watch
```

実行時にブラウザを開きサーバーパスへアクセスすると、以下のように表示されます。

<img src="/assets/img/localhost.png" >
