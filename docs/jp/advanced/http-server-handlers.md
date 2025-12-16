# HTTPサーバーハンドラー

Siskバージョン0.16では、`HttpServerHandler`クラスが導入され、Siskの全体的な動作を拡張し、HTTPリクエストのハンドリング、ルーター、コンテキストバッグなど、追加のイベントハンドラーを提供します。

このクラスは、HTTPサーバーのライフタイムとリクエストのイベントを集中管理します。HTTPプロトコルにはセッションがないため、1つのリクエストから別のリクエストへの情報を保持することはできません。Siskは、セッション、コンテキスト、データベース接続など、開発者が作業を支援するための便利なプロバイダーを実装する方法を提供します。

各イベントが発生するタイミングと目的については、[このページ](/api/Sisk.Core.Http.Handlers.HttpServerHandler)を参照してください。また、[HTTPリクエストのライフサイクル](/v1/advanced/request-lifecycle)も参照して、リクエストがどのように処理されるかとイベントが発生するタイミングを理解してください。HTTPサーバーは、同時に複数のハンドラーを使用することができます。各イベント呼び出しは同期的であり、関連付けられたすべてのハンドラーが実行され完了するまで、現在のスレッドがブロックされます。

RequestHandlersとは異なり、特定のルートグループまたはルートに適用することはできません。代わりに、全体のHTTPサーバーに適用されます。Http Server Handler内で条件を適用することができます。また、各Siskアプリケーションに対して、各HttpServerHandlerのシングルトンが定義されるため、各`HttpServerHandler`インスタンスは1つだけです。

HttpServerHandlerを使用する実用的な例は、リクエストの終了時に自動的にデータベース接続を破棄することです。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // リクエストがコンテキストバッグにDbContextを定義しているかどうかを確認します
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // HTTPリクエストからDbContextを作成し、リクエストのコンテキストバッグに保存することを許可します
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

上記のコードでは、`GetDbContext`拡張メソッドにより、HTTPリクエストオブジェクトから直接コネクションコンテキストを作成し、リクエストのコンテキストバッグに保存することができます。破棄されていないコネクションは、データベースを実行するときに問題を引き起こす可能性があるため、`OnHttpRequestClose`で終了されます。

ハンドラーをHTTPサーバーに登録するには、ビルダーまたは[HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler)を使用します。

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

これにより、`UsersController`クラスはデータベースコンテキストを使用することができます。

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("ユーザーが追加されました。");
    }
}
```

上記のコードでは、`JsonOk`と`JsonMessage`などのメソッドを使用していますが、これらは`ApiController`に組み込まれており、`RouterController`から継承されています。

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

開発者は、このクラスを使用してセッション、コンテキスト、データベース接続を実装することができます。提供されたコードは、DatabaseConnectionHandlerを使用した実用的な例を示しており、各リクエストの終了時に自動的にデータベース接続を破棄します。

統合は簡単で、ハンドラーはサーバー設定中に登録されます。HttpServerHandlerクラスは、HTTPアプリケーションでリソースを管理し、Siskの動作を拡張するための強力なツールセットを提供します。