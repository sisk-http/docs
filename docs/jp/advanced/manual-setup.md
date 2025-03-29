# マニュアル（高度）セットアップ

このセクションでは、事前に定義された標準なしで、完全に抽象的な方法でHTTPサーバーを作成します。ここでは、HTTPサーバーがどのように機能するかを手動で構築できます。各ListeningHostにはルーターがあり、HTTPサーバーには複数のListeningHostsを持ち、それぞれが異なるホストと異なるポートを指すことができます。

まず、リクエスト/レスポンスの概念を理解する必要があります。非常にシンプルです。各リクエストに対して、レスポンスが必要です。Siskもこの原則に従います。"Hello, World!"メッセージをHTMLで返すメソッドを作成しましょう。ステータスコードとヘッダーも指定します。

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

次のステップは、このメソッドをHTTPルートに関連付けることです。

## ルーター

ルーターは、リクエストルートの抽象化であり、サービスに対するリクエストとレスポンスの橋渡しとなります。ルーターはサービスルート、関数、エラーを管理します。

ルーターには複数のルートを持ち、それぞれのルートは異なる操作を実行できます。たとえば、関数の実行、ページの提供、サーバーからのリソースの提供などです。

最初のルーターを作成し、`IndexPage`メソッドをインデックスパスに関連付けましょう。

```csharp
Router mainRouter = new Router();

// SetRouteはすべてのインデックスルートをメソッドに関連付けます。
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

今のところ、ルーターはリクエストを受け取り、レスポンスを送信できます。しかし、`mainRouter`はホストやサーバーに結び付けられていないため、単独では機能しません。次のステップは、ListeningHostを作成することです。

## リスニングホストとポート

リスニングホストはルーターをホストし、同じルーターの複数のリスニングポートを持ちます。リスニングポートは、HTTPサーバーがリッスンするプレフィックスです。

ここで、ルーターを2つのエンドポイントに接続するリスニングホストを作成できます。

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

今のところ、HTTPサーバーは指定されたエンドポイントでリッスンし、リクエストをルーターに転送します。

## サーバー構成

サーバー構成は、HTTPサーバー自身の動作のほとんどを担当します。この構成では、リスニングホストをサーバーに関連付けることができます。

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // リスニングホストをサーバー構成に追加
```

次に、HTTPサーバーを作成できます。

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // サーバーを開始
Console.ReadKey(); // アプリケーションが終了しないようにする
```

今のところ、実行可能ファイルをコンパイルし、コマンドでHTTPサーバーを実行できます。

```bash
dotnet watch
```

実行時に、ブラウザを開き、サーバーパスに移動すると、以下の画像が表示されます。

<img src="/assets/img/localhost.png" >