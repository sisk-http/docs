# リクエストハンドリング

リクエストハンドラー、別名「ミドルウェア」は、ルーターでリクエストが実行される前または後に実行される関数です。ルートごとまたはルーターごとに定義できます。

リクエストハンドラーには2つの種類があります。

- **BeforeResponse**: リクエストハンドラーがルーター アクションを呼び出す前に実行されることを定義します。
- **AfterResponse**: リクエストハンドラーがルーター アクションを呼び出した後に実行されることを定義します。このコンテキストでHTTPレスポンスを送信すると、ルーターのアクションレスポンスが上書きされます。

両方のリクエストハンドラーは、実際のルーター コールバック関数のレスポンスを上書きできます。さらに、リクエストハンドラーは、認証、コンテンツ、またはその他の情報の検証に役立ちます。ストレージ、ログ、またはレスポンスの前にまたは後に実行できる他のステップもあります。

![](/assets/img/requesthandlers1.png)

このように、リクエストハンドラーは実行を中断し、サイクルを終了する前にレスポンスを返すことができます。その他のプロセスは破棄されます。

例: ユーザー認証リクエストハンドラーがユーザーを認証しないとします。リクエストライフサイクルは続行されず、ハングします。リクエストハンドラーが2番目の位置にある場合、3番目以降のハンドラーは評価されません。

![](/assets/img/requesthandlers2.png)

## リクエストハンドラーの作成

リクエストハンドラーを作成するには、[IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) インターフェイスを継承するクラスを作成できます。

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // nullを返すと、リクエストサイクルが続行されます
            return null;
        }
        else
        {
            // HttpResponseオブジェクトを返すと、隣接するレスポンスが上書きされます
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

上記の例では、`Authorization` ヘッダーがリクエストに存在する場合、続行し、次のリクエストハンドラーまたはルーター コールバックが呼び出されることを示しています。リクエストハンドラーがレスポンスの後に実行され、null以外の値を返すと、ルーターのレスポンスが上書きされます。

リクエストハンドラーが `null` を返すと、リクエストが続行され、次のオブジェクトが呼び出されるか、サイクルがルーターのレスポンスで終了します。

## ルートへのリクエストハンドラーの関連付け

ルートに1つまたは複数のリクエストハンドラーを定義できます。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

または、[Route](/api/Sisk.Core.Routing.Route) オブジェクトを作成します。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## ルーターへのリクエストハンドラーの関連付け

ルーター全体で実行されるグローバル リクエストハンドラーを定義できます。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## 属性へのリクエストハンドラーの関連付け

ルート属性とともにメソッド属性にリクエストハンドラーを定義できます。

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

リクエストハンドラーのタイプを渡す必要があります。インスタンスではありません。そうすると、リクエストハンドラーはルーター パーサーによってインスタンス化されます。コンストラクタ引数を [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) プロパティで渡すことができます。

例:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

リクエストハンドラーを実装する独自の属性を作成することもできます。

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

そして、次のように使用します。

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## グローバル リクエストハンドラーのバイパス

ルートでグローバル リクエストハンドラーを定義した後、特定のルートでそれを無視できます。

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: グローバル リクエストハンドラーと同じインスタンス
        new AuthenticateUserRequestHandler() // wrong: グローバル リクエストハンドラーはスキップされません
    }
});
```

> [!NOTE]
> リクエストハンドラーをバイパスする場合、スキップするために使用したのと同じ参照を使用する必要があります。別のリクエストハンドラー インスタンスを作成すると、グローバル リクエストハンドラーはスキップされません。グローバル リクエストハンドラーと BypassGlobalRequestHandlers で使用するのと同じリクエストハンドラー参照を使用することを覚えておいてください。