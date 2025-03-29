# 依存性注入

リクエストの生存期間中に存在するメンバーとインスタンスを専用にすることは一般的です。たとえば、データベース接続、認証されたユーザー、またはセッション トークンなどです。可能性の 1 つは、[HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext) を使用することです。これは、リクエストの生存期間中に存在する辞書を作成します。

この辞書は、[リクエスト ハンドラー](/docs/jp/fundamentals/request-handlers) によってアクセスされ、リクエスト全体で変数を定義できます。たとえば、ユーザーを認証するリクエスト ハンドラーは、`HttpContext.RequestBag` 内にユーザーを設定し、リクエスト ロジック内では、`HttpContext.RequestBag.Get<User>()` でユーザーを取得できます。

以下は例です。

<div class="script-header">
    <span>
        RequestHandlers/AuthenticateUser.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // advance to the next request handler or request logic
    }
}
```

<div class="script-header">
    <span>
        Controllers/HelloController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public static HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
```

これは、この操作の初期的な例です。`User` のインスタンスは、認証用のリクエスト ハンドラー内で作成されました。`AuthenticateUser` リクエスト ハンドラーを使用するすべてのルートには、`HttpContext.RequestBag` 内に `User` が存在することが保証されます。

`RequestBag` 内に事前に定義されていないインスタンスを取得するロジックを定義するには、[GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) または [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync) のようなメソッドを使用できます。

バージョン 1.3 以降、静的プロパティ [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) が導入され、現在実行中のリクエスト コンテキストの `HttpContext` にアクセスできるようになりました。これにより、リクエスト外部で `HttpContext` のメンバーにアクセスし、ルート オブジェクト内でインスタンスを定義できるようになりました。

以下の例では、リクエスト コンテキストで一般的にアクセスされるメンバーを持つコントローラーを定義します。

<div class="script-header">
    <span>
        Controllers/Controller.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // DbContext を作成または既存のものを取得
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // 次の行は、プロパティがリクエスト バッグ内に定義されていない場合に例外をスローします
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // HttpRequest インスタンスの公開もサポートされます
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

コントローラーから継承するタイプを定義します。

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts")]
public class PostsController : Controller
{
    [RouteGet]
    public IEnumerable<Blog> ListPosts()
    {
        return Database.Posts
            .Where(post => post.AuthorId == AuthenticatedUser.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthenticatedUser.Id);

        return post ?? new HttpResponse(404);
    }
}
```

上記の例では、ルーターに [値ハンドラー](/docs/jp/fundamentals/responses.html#implicit-response-types) を構成する必要があります。ルーターによって返されるオブジェクトが有効な [HttpResponse](/api/Sisk.Core.Http.HttpResponse) に変換されるようにします。

メソッドに `HttpRequest request` 引数がないことに注意してください。これは、バージョン 1.3 以降、ルーターがルーティング応答の 2 つの種類のデリゲートをサポートしているためです。1 つは、デフォルトのデリゲートである [RouteAction](/api/Sisk.Core.Routing.RouteAction) で、`HttpRequest` 引数を受け取ります。もう 1 つは、[ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction) です。`HttpRequest` オブジェクトは、静的な `HttpContext` の [Request](/api/Sisk.Core.Http.HttpContext.Request) プロパティを介して、両方のデリゲートからアクセスできます。

上記の例では、破棄可能なオブジェクトである `DbContext` を定義しました。HTTP セッションが終了するときに、`DbContext` のすべてのインスタンスが破棄されることを確認する必要があります。これを実現するには、2 つの方法があります。1 つは、ルーターのアクションの後に実行される [リクエスト ハンドラー](/docs/jp/fundamentals/request-handlers) を作成することです。もう 1 つは、カスタム [サーバー ハンドラー](/docs/jp/advanced/http-server-handlers) を使用することです。

最初の方法では、`RouterModule` から継承される [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) メソッド内に直接リクエスト ハンドラーをインラインで作成できます。

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    // ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // リクエスト ハンドラー コンテキスト内に定義された DbContext を取得し、破棄します
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Sisk バージョン 1.4 以降、プロパティ [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) が導入され、デフォルトで有効になりました。これは、HTTP セッションが閉じられたときに、コンテキスト バッグ内のすべての `IDisposable` 値を破棄するかどうかを定義します。

上記の方法では、HTTP 応答が終了したときに `DbContext` が破棄されることを保証します。他のメンバーも破棄する必要がある場合は、同様の方法を使用できます。

2 番目の方法では、HTTP セッションが終了したときに `DbContext` を破棄するカスタム [サーバー ハンドラー](/docs/jp/advanced/http-server-handlers) を作成できます。

<div class="script-header">
    <span>
        Server/Handlers/ObjectDisposerHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

そして、アプリケーション ビルダーで使用します。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

これは、コードのクリーンアップを処理し、リクエストの依存関係を使用されるモジュールの種類によって分離する方法です。これは、ASP.NET のようなフレームワークで依存性注入が使用されるのと似た方法です。