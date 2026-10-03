# 依存性の注入

Source: https://docs.sisk-framework.org/ja/docs/features/instancing.html

リクエストの有効期間中に存在するメンバーとインスタンス（たとえば、データベース接続、認証済みユーザー、またはセッショントークン）を指定することは一般的です。可能な方法の1つは、[HttpContext.RequestBag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)を使用することです。これは、リクエストの有効期間中に存在する辞書を作成します。

この辞書は、[リクエストハンドラー](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md)によってアクセスされ、リクエスト全体で変数を定義するために使用できます。たとえば、ユーザーを認証するリクエストハンドラーは、`HttpContext.RequestBag`内にユーザーを設定し、リクエストロジック内では、`HttpContext.RequestBag.Get<User>()`を使用してこのユーザーを取得できます。

この辞書に定義されたオブジェクトは、リクエストのライフサイクルにスコープされます。リクエストの終了時に破棄されます。レスポンスの送信が必ずしもリクエストのライフサイクルの終了を定義するわけではありません。レスポンスの送信後に実行される[リクエストハンドラー](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md)が実行されるとき、`RequestBag`オブジェクトはまだ存在し、破棄されていません。

以下は例です：

```csharp {title="RequestHandlers/AuthenticateUser.cs"}
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

```csharp {title="Controllers/HelloController.cs"}
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hello {authenticatedUser.Name}!")
    };
}
```

これは、この操作の初期的な例です。`User`のインスタンスは、認証用のリクエストハンドラー内で作成されましたが、このリクエストハンドラーを使用するすべてのルートには、`HttpContext.RequestBag`のインスタンス内に`User`が存在することが保証されます。

`RequestBag`に事前に定義されていないインスタンスを取得するロジックを定義するには、[GetOrAdd](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd.md)や[GetOrAddAsync](https://docs.sisk-framework.org/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync.md)などのメソッドを使用できます。

バージョン1.3以降、静的プロパティ[HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md)が導入され、現在実行中のリクエストコンテキストの`HttpContext`にアクセスできるようになりました。これにより、`HttpContext`のメンバーをリクエストの外部に公開し、ルートオブジェクト内にインスタンスを定義できるようになりました。

以下の例では、リクエストコンテキストで一般的にアクセスされるメンバーを持つコントローラーを定義します。

```csharp {title="Controllers/Controller.cs"}
public abstract class Controller : RouterModule
{
    // リクエストごとに既存のデータベースインスタンスを取得または作成する
    protected DbContext Database => HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());

    // リポジトリの遅延ロードも一般的です
    protected IUserRepository Users => HttpContext.Current.RequestBag.GetOrAdd(() => new UserRepository(Database));
    protected IBlogRepository Blogs => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogRepository(Database));
    protected IBlogPostRepository BlogPosts => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogPostRepository(Database));

    // 次の行は、リクエストバッグ内にユーザーが定義されていない場合に例外をスローします
    protected User AuthenticatedUser => => HttpContext.Current.RequestBag.Get<User>();

    // HttpRequestインスタンスの公開もサポートされています
    protected HttpRequest Request => HttpContext.Current.Request
}
```

コントローラーから継承するタイプを定義します。

```csharp {title="Controllers/PostsController.cs"}
[RoutePrefix("/api/posts/{author}")]
sealed class PostsController : Controller
{
    protected Guid AuthorId => Request.RouteParameters["author"].GetInteger();

    [RouteGet]
    public IAsyncEnumerable<BlogPost> ListPosts()
    {
        return BlogPosts.GetPostsAsync(authorId: AuthorId);
    }

    [RouteGet("<id>")]
    public async Task<BlogPost?> GetPost()
    {
        int postId = Request.RouteParameters["id"].GetInteger();

        Post? post = await BlogPosts
            .FindPostAsync(post => post.Id == postId && post.AuthorId == AuthorId);

        return post;
    }
}
```

上記の例では、ルーターの戻り値を有効な[HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md)に変換するために、[値ハンドラー](https://docs.sisk-framework.org/ja/docs/fundamentals/responses.md#implicit-response-types)をルーターに構成する必要があります。

メソッドに`HttpRequest request`引数がないことに注意してください。これは、バージョン1.3以降、ルーターがルーティングレスポンスの2種類のデリゲートをサポートしているためです。1つは、`HttpRequest`引数を受け取るデフォルトのデリゲートである[RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md)で、もう1つは[ParameterlessRouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.ParameterlessRouteAction.md)です。`HttpRequest`オブジェクトは、静的な`HttpContext`の[Request](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Request.md)プロパティを介して、両方のデリゲートからアクセスできます。

上記の例では、`DbContext`という破棄可能なオブジェクトを定義し、HTTPセッション終了時に作成されたすべての`DbContext`インスタンスを破棄する必要があります。これを実現するには、2つの方法があります。1つは、ルーターのアクション後に実行される[リクエストハンドラー](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md)を作成することです。もう1つは、カスタム[サーバーハンドラー](https://docs.sisk-framework.org/ja/docs/advanced/http-server-handlers.md)を使用することです。

最初の方法では、`OnSetup`メソッド内に直接インラインでリクエストハンドラーを作成できます。

```csharp {title="Controllers/PostsController.cs"}
public abstract class Controller : RouterModule
{
    // ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // リクエストハンドラーのコンテキストで定義されたDbContextを取得し、破棄する
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Siskバージョン1.4以降、プロパティ[HttpServerConfiguration.DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md)が導入され、デフォルトで有効になりました。これは、HTTPセッションが閉じられたときにコンテキストバッグ内のすべての`IDisposable`値を破棄するかどうかを定義します。

上記の方法により、HTTPセッションが終了すると、`DbContext`が破棄されます。破棄が必要な他のメンバーについても同様に行うことができます。

2番目の方法では、HTTPセッションが終了すると`DbContext`を破棄するカスタム[サーバーハンドラー](https://docs.sisk-framework.org/ja/docs/advanced/http-server-handlers.md)を作成します。

```csharp {title="Server/Handlers/ObjectDisposerHandler.cs"}
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

そして、アプリビルダーで使用します。

```csharp {title="Program.cs"}
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

これは、コードのクリーンアップを処理し、リクエストの依存関係を使用されるモジュールの種類によって分離し、ルーターの各アクション内でのコードの重複を減らす方法です。これは、ASP.NETなどのフレームワークで依存性の注入が使用されるのと似た方法です。
