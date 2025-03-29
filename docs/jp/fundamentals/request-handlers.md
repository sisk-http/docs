# リクエストハンドリング

リクエストハンドラー、別名「ミドルウェア」と呼ばれるものは、ルーターでリクエストが実行される前または後に実行される関数です。ルートごとまたはルーターごとに定義できます。

リクエストハンドラーには2つの種類があります。

- **BeforeResponse**: リクエストハンドラーがルーターアクションを呼び出す前に実行されることを定義します。
- **AfterResponse**: リクエストハンドラーがルーターアクションを呼び出した後に実行されることを定義します。このコンテキストでHTTPレスポンスを送信すると、ルーターアクションのレスポンスが上書きされます。

両方のリクエストハンドラーは、実際のルーターコールバック関数のレスポンスを上書きできます。さらに、リクエストハンドラーは、認証、コンテンツ、またはその他の情報の検証に役立ちます。情報を保存したり、ログを記録したり、またはレスポンスの前または後に実行できる他のステップに役立ちます。

![](/assets/img/requesthandlers1.png)

このように、リクエストハンドラーは実行を中断し、サイクルを終了する前にレスポンスを返すことができます。

例: ユーザー認証リクエストハンドラーがユーザーを認証しないとします。リクエストライフサイクルが続行されないようにし、ハングします。リクエストハンドラーが2番目の位置にある場合、3番目以降のハンドラーは評価されません。

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

上記の例では、`Authorization` ヘッダーがリクエストに存在する場合、続行し、次のリクエストハンドラーまたはルーターコールバックが呼び出されるようにします。リクエストハンドラーがレスポンスの後に実行され、null以外の値を返すと、ルーターのレスポンスが上書きされます。

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

または、[Route](/api/Sisk.Core.Routing.Route) オブジェクトを作成できます。

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

ルーター全体で実行されるグローバルリクエストハンドラーを定義できます。

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

注: リクエストハンドラータイプを渡す必要があります。インスタンスを渡すことはできません。そうすると、リクエストハンドラーはルーターパーサーによってインスタンス化されます。コンストラクタ引数を[ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) プロパティで渡すことができます。

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

独自の属性を作成して、RequestHandlerを実装することもできます。

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

## グローバルリクエストハンドラーのバイパス

ルートにグローバルリクエストハンドラーを定義した後、特定のルートでそれを無視できます。

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
        myRequestHandler,                    // ok: グローバルリクエストハンドラーと同じインスタンス
        new AuthenticateUserRequestHandler() // wrong: グローバルリクエストハンドラーはスキップされません
    }
});
```

> [!NOTE]
> リクエストハンドラーをバイパスする場合、同じ参照を使用してスキップする必要があります。別のリクエストハンドラーインスタンスを作成すると、グローバルリクエストハンドラーはスキップされません。グローバルリクエストハンドラーとバイパスグローバルリクエストハンドラーの両方で同じリクエストハンドラー参照を使用することを確認してください。