# 依存性注入

リクエストの生存期間中に存在するメンバーとインスタンス（例：データベース接続、認証ユーザー、セッショントークン）を指定することは一般的です。可能な方法の1つは、[HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext)を使用することで、リクエストの生存期間中に存在するディクショナリを作成します。

このディクショナリは、[リクエストハンドラー](/docs/fundamentals/request-handlers)によってアクセスされ、リクエスト全体で変数を定義することができます。例えば、ユーザーを認証するリクエストハンドラーは、`HttpContext.RequestBag`内にユーザーを設定し、リクエストロジック内で`HttpContext.RequestBag.Get<User>()`を使用してユーザーを取得することができます。

以下は例です：

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
        return null; // 次のリクエストハンドラーまたはリクエストロジックに進む
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

これは、この操作の初期的な例です。`User`のインスタンスは、認証用のリクエストハンドラー内で作成されました。`AuthenticateUser`リクエストハンドラーを使用するすべてのルートは、`HttpContext.RequestBag`内に`User`が存在することを保証します。

`RequestBag`内に事前に定義されていないインスタンスを取得するロジックを定義するには、[GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd)または[GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync)などのメソッドを使用することができます。

バージョン1.3以降、静的プロパティ[HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current)が導入され、現在実行中の`HttpContext`へのアクセスが可能になりました。これにより、リクエストコンテキスト外部で`HttpContext`のメンバーにアクセスし、ルートオブジェクト内でインスタンスを定義することができます。

以下の例では、リクエストコンテキストで一般的にアクセスされるメンバーを持つコントローラーを定義します。

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
            // DbContextを作成または取得する
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // 次の行は、プロパティがリクエストバッグ内に定義されていない場合にエラーをスローします
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // HttpRequestインスタンスの公開もサポートされています
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

上記の例では、ルーターに[値ハンドラー](/docs/fundamentals/responses.html#implicit-response-types)を構成する必要があります。ルーターによって返されるオブジェクトが有効な[HttpResponse](/api/Sisk.Core.Http.HttpResponse)に変換されるようにします。

メソッドに`HttpRequest request`引数がないことに注意してください。これは、バージョン1.3以降、ルーターがルーティング応答の2つの種類のデリゲートをサポートしているためです。1つは、`HttpRequest`引数を受け取るデフォルトのデリゲートである[RouteAction](/api/Sisk.Core.Routing.RouteAction)です。もう1つは、[ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction)です。`HttpRequest`オブジェクトは、静的な`HttpContext`の[Request](/api/Sisk.Core.Http.HttpContext.Request)プロパティを介して両方のデリゲートからアクセスできます。

上記の例では、`DbContext`という破棄可能なオブジェクトを定義しました。HTTPセッションが終了したときに、`DbContext`のすべてのインスタンスが破棄されることを保証する必要があります。これを実現するには、2つの方法があります。1つは、ルーターのアクションの後に実行される[リクエストハンドラー](/docs/fundamentals/request-handlers)を作成することです。もう1つは、カスタム[サーバーハンドラー](/docs/advanced/http-server-handlers)を使用することです。

最初の方法では、`RouterModule`から継承された[OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup)メソッド内で、リクエストハンドラーをインラインで作成することができます。

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
                // リクエストハンドラーのコンテキスト内で定義されたDbContextを取得して破棄する
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Siskバージョン1.4以降、プロパティ[HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues)が導入され、デフォルトで有効になりました。これは、HTTPセッションが閉じられたときに、HTTPサーバーがコンテキストバッグ内のすべての`IDisposable`値を破棄するかどうかを定義します。

上記の方法では、HTTPセッションが終了したときに`DbContext`が破棄されることを保証します。破棄が必要な他のメンバーについても同じことができます。

2つ目の方法では、HTTPセッションが終了したときに`DbContext`を破棄するカスタム[サーバーハンドラー](/docs/advanced/http-server-handlers)を作成することができます。

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

そして、アプリビルダーで使用します。

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

これは、コードのクリーンアップを処理し、リクエストの依存関係を使用するモジュールの種類によって分離する方法です。これは、ASP.NETなどのフレームワークで依存性注入が使用されるのと似た方法です。