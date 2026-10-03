# Http server handlers

Source: https://docs.sisk-framework.org/ja/docs/advanced/http-server-handlers.html

Sisk バージョン 0.16 では、`HttpServerHandler` クラスを導入しました。このクラスは Sisk の全体的な動作を拡張し、Http リクエストの処理、ルーター、コンテキストバッグなど、追加のイベントハンドラを Sisk に提供することを目的としています。

このクラスは、HTTP サーバ全体および個々のリクエストのライフタイム中に発生するイベントを集中管理します。Http プロトコルにはセッションが存在しないため、あるリクエストから別のリクエストへ情報を保持することはできません。Sisk は現在、セッション、コンテキスト、データベース接続、その他の便利なプロバイダーを実装できる方法を提供しています。

各イベントがいつトリガーされるか、その目的は何かについては、[このページ](https://docs.sisk-framework.org/api/Sisk.Core.Http.Handlers.HttpServerHandler.md) を参照してください。また、リクエストがどのように処理され、どこでイベントが発火するかを理解するために、[HTTP リクエストのライフサイクル](https://docs.sisk-framework.org/ja/docs/advanced/request-lifecycle.md) もご覧ください。HTTP サーバは複数のハンドラを同時に使用できます。各イベント呼び出しは同期的に行われ、すべてのハンドラが実行・完了するまで、リクエストまたはコンテキストごとに現在のスレッドがブロックされます。

RequestHandlers とは異なり、特定のルートグループや個別のルートに適用することはできません。代わりに、HTTP サーバ全体に適用されます。Http Server Handler 内で条件を設定することも可能です。さらに、各 `HttpServerHandler` のシングルトンはすべての Sisk アプリケーションで定義されるため、`HttpServerHandler` ごとにインスタンスは 1 つだけです。

HttpServerHandler の実用的な使用例として、リクエストの終了時にデータベース接続を自動的に破棄する方法があります。

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // リクエストのコンテキストバッグに DbContext が設定されているか確認
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

上記のコードでは、`GetDbContext` 拡張メソッドにより、`HttpRequest` オブジェクトから直接接続コンテキストを作成できるようになります。未破棄の接続はデータベース操作時に問題を引き起こす可能性があるため、`OnHttpRequestClose` で終了させます。

ハンドラはビルダー内または直接 [HttpServer.RegisterHandler](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.RegisterHandler.md) を使用して HTTP サーバに登録できます。

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

これにより、`UsersController` クラスは次のようにデータベースコンテキストを利用できます。

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

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("User added.");
    }
}
```

上記のコードは、`ApiController` に組み込まれている `JsonOk` や `JsonMessage` といったメソッドを使用しています。`ApiController` は `RouterController` から継承されています。

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

開発者はこのクラスを利用してセッション、コンテキスト、データベース接続を実装できます。提示されたコードは `DatabaseConnectionHandler` を用いた実用例であり、各リクエストの終了時にデータベース接続を自動的に破棄します。

統合はシンプルで、サーバ設定時にハンドラを登録するだけです。`HttpServerHandler` クラスは、リソース管理と Sisk の動作拡張を行うための強力なツールセットを提供します。
