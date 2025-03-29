# ルーティング

[Router](/api/Sisk.Core.Routing.Router)は、サーバーを構築するための最初のステップです。ルーティングは、URLとそのメソッドをサーバーが実行するアクションにマッピングするエンドポイントである[Route](/api/Sisk.Core.Routing.Route)オブジェクトを保持する責任があります。各アクションは、リクエストを受信し、クライアントにレスポンスを配信する責任があります。

ルートは、パス式 ("パスパターン") とそれらがリッスンできるHTTPメソッドのペアです。サーバーにリクエストが行われると、ルートは受信したリクエストにマッチするルートを見つけ、そのルートのアクションを呼び出し、結果のレスポンスをクライアントに配信します。

Siskでは、ルートを定義する方法は複数あります。静的、動的、または自動スキャンによって定義できます。属性によって定義されることもあり、直接Routerオブジェクトに定義することもできます。

```cs
Router mainRouter = new Router();

// GET / ルートを次のアクションにマップ
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

ルートが何を行うかを理解するには、リクエストが何を行うかを理解する必要があります。[HttpRequest](/api/Sisk.Core.Http.HttpRequest)には、必要なすべての情報が含まれています。Siskには、開発を高速化するための追加の機能も含まれています。

サーバーが受信するすべてのアクションに対して、[RouteAction](/api/Sisk.Core.Routing.RouteAction)タイプのデリゲートが呼び出されます。このデリゲートには、サーバーが受信したリクエストに関するすべての必要な情報を含む[HttpRequest](/api/Sisk.Core.Http.HttpRequest)を保持するパラメーターが含まれています。このデリゲートの戻り値は、[HttpResponse](/api/Sisk.Core.Http.HttpResponse)または[暗黙的なレスポンスタイプ](/docs/jp/fundamentals/responses#implicit-response-types)を介してそれにマップされるオブジェクトでなければなりません。

## ルートのマッチング

HTTPサーバーがリクエストを受信すると、Siskはリクエストのパスを受信した式を満たすルートを検索します。式は、常にルートとリクエストパスの間でテストされ、クエリ文字列は考慮されません。

このテストには優先順位はありません。単一のルートに排他的です。ルートがリクエストとマッチしない場合、[Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler)レスポンスがクライアントに返されます。パスパターンがマッチするが、HTTPメソッドが一致しない場合、[Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler)レスポンスがクライアントに返されます。

Siskは、ルートの衝突を避けるために、ルートの定義時に可能なルートの衝突をチェックします。このテストには、ルートのパスと受け入れるメソッドのチェックが含まれます。

### パスパターンを使用したルートの作成

ルートを定義するには、さまざまな`SetRoute`メソッドを使用できます。

```cs
// SetRoute方式
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

// Map*方式
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // 空の200 OK
});

// Route.*ヘルパーメソッド
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // StreamContentの中のストリームは、レスポンスを送信した後、破棄されます。
        Content = new StreamContent(imageStream)
    };
});

// 複数のパラメーター
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

[RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)プロパティの[HttpResponse](/api/Sisk.Core.Http.HttpResponse)には、受信したリクエストのパス変数に関するすべての情報が含まれています。

サーバーが受信するすべてのパスは、パスパターンのテストが実行される前に、次のルールに従って正規化されます。

- パスからすべての空のセグメントが削除されます。たとえば、`////foo//bar`は`/foo/bar`になります。
- パスのマッチングは**大文字/小文字を区別**します。ただし、[Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase)が`true`に設定されている場合を除きます。

[Query](/api/Sisk.Core.Http.HttpRequest.Query)と[RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)プロパティの[HttpRequest](/api/Sisk.Core.Http.HttpRequest)は、[StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection)オブジェクトを返します。ここで、各インデックス付きプロパティは、nullでない[StringValue](/api/Sisk.Core.Entity.StringValue)を返します。これは、オプション/モナドとして使用して、生の値を管理されたオブジェクトに変換できます。

以下の例では、ルートパラメーター "id" を読み取り、それからGuidを取得します。パラメーターが有効なGuidでない場合、例外がスローされ、サーバーが[Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler)を処理していない場合、クライアントに500エラーが返されます。

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTE]
> パスには、リクエストパスとルートパスの両方で、末尾の`/`が無視されます。つまり、`/index/page`として定義されたルートにアクセスする場合、`/index/page/`でもアクセスできます。
>
> [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash)フラグを有効にすると、URLを`/`で終わらせることができます。

### クラスインスタンスを使用したルートの作成

ルートを動的に定義するには、[RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute)属性を使用して、クラスのインスタンスを使用できます。この方法では、ターゲットルーターにルートが定義されます。

メソッドがルートとして定義されるには、[RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute)または[RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute)などの属性でマークする必要があります。メソッドは静的、インスタンス、公開、または非公開にすることができます。`SetObject(type)`または`SetObject<TType>()`メソッドを使用する場合、インスタンスメソッドは無視されます。

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
    // GET / にマッチ
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // 静的メソッドも動作します
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

以下の行は、`MyController`の`Index`と`Hello`メソッドの両方をルートとして定義します。両方のメソッドはルートとしてマークされており、クラスのインスタンスが提供されています。クラスの型がインスタンスの代わりに提供された場合、静的メソッドのみが定義されます。

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

Siskバージョン0.16以降、AutoScanを有効にすることができます。これにより、`RouterModule`を実装するユーザー定義のクラスを検索し、自動的にルーターに関連付けます。AOTコンパイルではサポートされません。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上記の命令は、`ApiController`を実装するすべてのタイプを検索しますが、タイプ自体は検索しません。2つのオプションパラメーターは、タイプを検索する方法を示します。最初の引数は、タイプを検索するアセンブリを示し、2番目の引数は、タイプを定義する方法を示します。

## 正規表現ルート

デフォルトのHTTPパスマッチングメソッドを使用する代わりに、ルートを正規表現で解釈するようにマークできます。

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "My route", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

または、[RegexRoute](/api/Sisk.Core.Routing.RegexRoute)クラスを使用することもできます。

```cs
mainRouter.SetRoute(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

正規表現パターンからグループをキャプチャして、[HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters)の内容に含めることもできます。

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
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## ルートのプレフィックス

クラスまたはモジュールのすべてのルートにプレフィックスを付けるには、[RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute)属性を使用できます。

BREADアーキテクチャ (Browse、Read、Edit、Add、Delete) を使用する例を以下に示します。

<div class="script-header">
    <span>
        Controller/Api/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users/<id>
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

上記の例では、`HttpResponse`パラメーターは省略され、代わりにグローバルコンテキスト[HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current)を介して使用されます。詳細については、次のセクションを参照してください。

## リクエストパラメーターなしのルート

ルートは、[HttpRequest](/api/Sisk.Core.Http.HttpRequest)パラメーターなしで定義できます。ただし、リクエストとそのコンポーネントは、リクエストコンテキストで取得できます。

すべてのコントローラーを基盤とする抽象化`ControllerBase`を考えてみましょう。この抽象化は、現在のスレッドからリクエストを取得する`Request`プロパティを提供します。

<div class="script-header">
    <span>
        Controller/ControllerBase.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public abstract class ControllerBase
{
    // 現在のスレッドからリクエストを取得します。
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // 次の行は、現在のHTTPセッションからデータベースを取得します。存在しない場合は、新しいものを作成します。
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

すべての派生クラスでルート構文をリクエストパラメーターなしで使用できるようにします。

<div class="script-header">
    <span>
        Controller/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // 現在のリクエストからJSONデータを読み取ります。
        UserCreationDto? user = JsonSerializer.DeserializeAsync<UserCreationDto>(Request.Body);
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

現在のコンテキストと依存性の注入についての詳細は、[依存性の注入](/docs/jp/features/instancing)チュートリアルを参照してください。

## どのメソッドでもマッチするルート

ルートを定義して、パスのみでマッチさせ、HTTPメソッドをスキップすることができます。これは、ルートコールバック内でメソッドの検証を行う場合に便利です。

```cs
// どのHTTPメソッドでも / にマッチ
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## どのパスでもマッチするルート

どのパスでもマッチするルートは、ルートメソッドがテストされるすべてのパスを受信するHTTPサーバーにマッチします。ルートメソッドが`RouteMethod.Any`で、ルートのパス式が[Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath)を使用する場合、このルートはすべてのリクエストをリッスンし、他のルートは定義できません。

```cs
// すべてのPOSTリクエストにマッチ
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 大文字/小文字を無視したルートマッチング

デフォルトでは、ルートの解釈は大文字/小文字を区別します。無視するには、次のオプションを有効にします。

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

これにより、正規表現マッチングを使用するルートでは、`RegexOptions.IgnoreCase`オプションも有効になります。

## Not Found (404) コールバックハンドラー

ルートが見つからない場合のカスタムコールバックを作成できます。

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // バージョン0.14以降
        Content = new HtmlContent("<h1>Not found</h1>")
        // 以前のバージョン
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Method Not Allowed (405) コールバックハンドラー

パスがマッチするがメソッドがマッチしない場合のカスタムコールバックを作成できます。

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## 内部エラーハンドラー

ルートコールバックは、サーバーの実行中にエラーをスローする可能性があります。適切に処理しないと、HTTPサーバーの全体的な機能が中断される可能性があります。ルーターには、ルートコールバックが失敗したときに呼び出されるコールバックがあり、サービスの中断を防ぎます。

このメソッドは、[ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions)が`false`に設定されている場合にのみ到達されます。

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```