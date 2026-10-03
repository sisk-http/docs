---
title: "リクエストハンドリング"
linkTitle: "リクエストハンドラ"
weight: 20
aliases:
  - "/docs/jp/fundamentals/request-handlers.html"
sourceHash: "77d35afbd210c7a6"
---

リクエストハンドラは、"ミドルウェア" とも呼ばれ、ルーターでリクエストが実行される前後に実行される関数です。ルート単位またはルーター単位で定義できます。

リクエストハンドラには2種類あります：

- **BeforeResponse**: ルーターアクションを呼び出す前にリクエストハンドラが実行されることを示します。
- **AfterResponse**: ルーターアクションを呼び出した後にリクエストハンドラが実行されることを示します。このコンテキストで HTTP レスポンスを送信すると、ルーターのアクションレスポンスが上書きされます。

両方のリクエストハンドラは、実際のルーターコールバック関数のレスポンスを上書きできます。なお、リクエストハンドラは、認証やコンテンツなどのリクエストの検証、情報の保存、ログ記録、またはレスポンスの前後に実行できるその他の処理に役立ちます。

![](/assets/img/requesthandlers1.png)

このように、リクエストハンドラは実行のすべてを中断し、サイクルが完了する前にレスポンスを返すことで、途中の処理をすべて破棄できます。

例: ユーザー認証リクエストハンドラが認証に失敗したとします。この場合、リクエストのライフサイクルは継続できず、処理が停止します。もしこのハンドラが2番目の位置にある場合、3番目以降は評価されません。

![](/assets/img/requesthandlers2.png)

## リクエストハンドラの作成

リクエストハンドラを作成するには、[IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler) インターフェイスを継承したクラスを以下の形式で作成します：

```cs {title="Middleware/AuthenticateUserRequestHandler.cs"}
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // null を返すと、リクエストサイクルを継続できることを示します
            return null;
        }
        else
        {
            // HttpResponse オブジェクトを返すと、このレスポンスが隣接するレスポンスを上書きすることを示します
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

上記の例では、リクエストに `Authorization` ヘッダーが存在する場合は処理を継続し、次のリクエストハンドラまたはルーターコールバックが呼び出されることを示しています。プロパティ [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) によりレスポンス後に実行されるリクエストハンドラが非 null の値を返すと、ルーターのレスポンスを上書きします。

リクエストハンドラが `null` を返す場合、リクエストは継続され、次のオブジェクトが呼び出されるか、ルーターのレスポンスでサイクルが終了することを示します。

組み込みの [RequestHandler](/api/Sisk.Core.Routing.RequestHandler) クラスを継承すると、`Next()` を返すことで意図を明示できます:

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

I/O が必要なハンドラは、[AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler) を継承します:

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

小規模なインラインハンドラは `RequestHandler.Create` または `AsyncRequestHandler.Create` でも作成できます:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## 単一ルートにリクエストハンドラを関連付ける

ルートに対して 1 つ以上のリクエストハンドラを定義できます。

```cs {title="Router.cs"}
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

または [Route](/api/Sisk.Core.Routing.Route) オブジェクトを作成する場合：

```cs {title="Router.cs"}
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## ルーターにリクエストハンドラを関連付ける

ルーター上のすべてのルートで実行されるグローバルリクエストハンドラを定義できます。

```cs {title="Router.cs"}
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## 属性にリクエストハンドラを関連付ける

メソッド属性とルート属性と一緒に、リクエストハンドラを属性として定義できます。

```cs {title="Controller/MyController.cs"}
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

注意点として、オブジェクトインスタンスではなく、目的のリクエストハンドラ型を渡す必要があります。これにより、ルーターパースャーがリクエストハンドラをインスタンス化します。クラスコンストラクタの引数は [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments) プロパティで渡すことができます。

例：

```cs {title="Controller/MyController.cs"}
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

RequestHandler を実装した独自の属性も作成できます：

```cs {title="Middleware/Attributes/AuthenticateAttribute.cs"}
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

そして次のように使用します：

```cs {title="Controller/MyController.cs"}
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## グローバルリクエストハンドラをバイパスする

ルートにグローバルリクエストハンドラを定義した後、特定のルートでそのハンドラを無視できます。

```cs {title="Router.cs"}
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: the same instance of what is in the global request handlers
    new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> リクエストハンドラをバイパスする場合、以前にインスタンス化したものと同じ参照を使用しなければなりません。別のリクエストハンドラインスタンスを作成しても、参照が変わるためグローバルリクエストハンドラはバイパスされません。GlobalRequestHandlers と BypassGlobalRequestHandlers の両方で同じリクエストハンドラ参照を使用することを忘れないでください。
