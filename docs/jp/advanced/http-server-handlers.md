# Http サーバー ハンドラー

Sisk バージョン 0.16 では、`HttpServerHandler` クラスが導入され、Sisk の全体的な動作を拡張し、Http リクエスト、ルーター、コンテキスト バッグなどへの追加のイベント ハンドラーを提供します。

このクラスは、HTTP サーバーのライフタイムとリクエストのイベントを集中管理します。Http プロトコルにはセッションがないため、1 つのリクエストから別のリクエストへの情報を保持することはできません。Sisk では、セッション、コンテキスト、データベース接続などの有用なプロバイダーを実装する方法を提供します。

各イベントが発生するタイミングと目的については、[このページ](/api/Sisk.Core.Http.Handlers.HttpServerHandler) を参照してください。また、[HTTP リクエストのライフサイクル](/v1/advanced/request-lifecycle) を確認して、リクエストに対して何が起こるかと、イベントがどこで発生するかを理解することもできます。HTTP サーバーでは、同時に複数のハンドラーを使用できます。各イベント呼び出しは同期的であり、関連付けられたすべてのハンドラーが実行され完了するまで、現在のスレッドがブロックされます。

RequestHandlers と異なり、特定のルート グループまたはルートに適用することはできません。代わりに、全体の HTTP サーバーに適用されます。Http サーバー ハンドラー内で条件を適用することもできます。さらに、各 Sisk アプリケーションに対して、各 HttpServerHandler のシングルトンが定義されます。つまり、各 `HttpServerHandler` には 1 つのインスタンスのみが定義されます。

HttpServerHandler を使用する実用的な例は、リクエストの終了時に自動的にデータベース接続を破棄することです。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // リクエストがコンテキスト バッグに DbContext を定義しているかどうかを確認します
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // ユーザーが HttpRequest から DbContext を作成し、それをリクエスト バッグに保存できるようにします
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

上記のコードでは、`GetDbContext` 拡張メソッドにより、HttpRequest オブジェクトから直接接続コンテキストを作成し、それをリクエスト バッグに保存できます。破棄されていない接続はデータベースを実行する際に問題を引き起こす可能性があるため、`OnHttpRequestClose` で終了されます。

ハンドラーを Http サーバーに登録するには、ビルダーまたは [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler) を使用できます。

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

これにより、`UsersController` クラスはデータベース コンテキストを使用できます。

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

        return JsonMessage("User added.");
    }
}
```

上記のコードでは、`JsonOk` と `JsonMessage` などのメソッドを使用しています。これらは `ApiController` に組み込まれており、`RouterController` から継承されています。

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

開発者は、このクラスを使用してセッション、コンテキスト、データベース接続を実装できます。提供されたコードは、DatabaseConnectionHandler を使用した実用的な例を示しており、各リクエストの終了時に自動的にデータベース接続を破棄します。

統合は簡単であり、ハンドラーはサーバー設定中に登録されます。HttpServerHandler クラスは、HTTP アプリケーションでリソースを管理し、Sisk の動作を拡張するための強力なツールセットを提供します。