---
title: "ルーティング"
weight: 10
aliases:
  - "/docs/jp/fundamentals/routing.html"
sourceHash: "ef25df75ecdeda3b"
---

The [Router](/api/Sisk.Core.Routing.Router) はサーバー構築の最初のステップです。これは [Route](/api/Sisk.Core.Routing.Route) オブジェクトを保持する役割を担い、URL とそのメソッドをサーバーが実行するアクションにマッピングするエンドポイントです。各アクションはリクエストを受け取り、クライアントへレスポンスを返すことを担当します。

ルートはパス式（「パスパターン」）とリッスンできる HTTP メソッドの組み合わせです。サーバーにリクエストが送られると、受信したリクエストにマッチするルートを探し、そのルートのアクションを呼び出して結果のレスポンスをクライアントに届けます。

Sisk ではルートを定義する方法が複数あります。静的、動的、または自動スキャンされたもの、属性で定義されたもの、あるいは Router オブジェクトに直接定義されたものがあります。

```cs
Router mainRouter = new Router();

// GET / ルートを以下のアクションにマッピングします
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

ルートが何をできるかを理解するには、リクエストが何をできるかを理解する必要があります。 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) には必要な情報がすべて含まれます。Sisk には開発全体を高速化する追加機能も含まれています。

サーバーが受け取る各アクションについて、[RouteAction](/api/Sisk.Core.Routing.RouteAction) 型のデリゲートが呼び出されます。このデリゲートは、サーバーが受け取ったリクエストに関するすべての必要情報を保持した [HttpRequest](/api/Sisk.Core.Http.HttpRequest) をパラメータとして受け取ります。このデリゲートから返されるオブジェクトは [HttpResponse](/api/Sisk.Core.Http.HttpResponse) であるか、[暗黙的レスポンスタイプ](/docs/fundamentals/responses#implicit-response-types) を通じてそれにマップされるオブジェクトでなければなりません。

## ルートのマッチング

HTTP サーバーがリクエストを受信すると、Sisk はリクエストのパス式に合致するルートを検索します。式は常にルートとリクエストパスの間でテストされ、クエリ文字列は考慮されません。

このテストは優先順位を持たず、単一のルートに対して排他的に行われます。リクエストにマッチするルートがない場合、[Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) のレスポンスがクライアントに返されます。パスパターンはマッチしたが HTTP メソッドが不一致の場合は、[Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) のレスポンスがクライアントに送られます。

Sisk はルート衝突の可能性をチェックしてこれらの問題を回避します。ルートを定義する際、Sisk は定義しようとしているルートと衝突する可能性のあるルートを探します。このテストにはパスと受け入れるように設定されたメソッドのチェックが含まれます。

### パスパターンを使用したルートの作成

新しいアプリケーションでは `Map*` メソッドを優先してください。これらは呼び出し側で HTTP メソッドが可視化され、現在の `Router` API に一致します。古い `SetRoute` メソッドは互換性ラッパーとして残っていますが、新しい例では `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions`, または `MapHead` を使用してください。

```cs
// Map* メソッドは、メソッド固有のルートを定義する一般的な方法です。
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // 空の 200 OK
});

// ルートオプションが必要な場合、Map は Route インスタンスも受け取れます。
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // StreamContent の内部
        // 送信後にストリームが破棄されます
        // レスポンスです。
        Content = new StreamContent(imageStream)
    };
}));

// 複数のパラメータ
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

HttpRequest の [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) プロパティには、受信したリクエストのパス変数に関するすべての情報が含まれます。

サーバーが受け取るすべてのパスは、パスパターンテストが実行される前に次の規則に従って正規化されます。

- 空のセグメントはすべてパスから削除されます。例: `////foo//bar` は `/foo/bar` になります。
- パスマッチングは **大文字小文字を区別** します。ただし、[Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) が `true` に設定されている場合は除きます。

[Query](/api/Sisk.Core.Http.HttpRequest.Query) と [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) プロパティは [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection) オブジェクトを返し、各インデックス付きプロパティは非 null の [StringValue](/api/Sisk.Core.Entity.StringValue) を返します。これらは生の値を管理対象オブジェクトに変換するオプション/モナドとして使用できます。

以下の例はルートパラメータ「id」を読み取り、`Guid` に変換します。パラメータが有効な Guid でない場合は例外がスローされ、サーバーが [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) を処理していない場合は 500 エラーがクライアントに返されます。

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> パスの末尾の `/` はリクエスト側もルート側も無視されます。つまり、`/index/page` と定義されたルートは `/index/page/` でもアクセス可能です。
>
> また、[HttpServerConfiguration.ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash) を有効にすることで、URL が必ず `/` で終わるように強制できます。

### クラスインスタンスを使用したルートの作成

属性 [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute) を使ってリフレクションで動的にルートを定義することもできます。この方法では、属性を実装したクラスのインスタンスが対象ルーターにルートを定義します。

メソッドをルートとして定義するには、[RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute)（または [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute) など）でマークする必要があります。メソッドは static、インスタンス、public、private のいずれでも構いません。オブジェクトからインスタンスメソッドと static メソッドの両方をマッピングしたい場合は `MapInstance` を使用し、型から static メソッドのみをマッピングしたい場合は `MapType` を使用します。

```cs {title="Controller/MyController.cs"}
public class MyController
{
    // GET / にマッチします
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // 静的メソッドも機能します
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

以下の行は `MyController` の `Index` と `Hello` の両メソッドをルートとして定義します。どちらもルートとしてマークされ、クラスのインスタンスが提供されたためです。インスタンスではなく型が提供された場合は static メソッドのみが定義されます。

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

型から static ルートメソッドだけをマッピングしたい場合は次を使用します。

```cs
mainRouter.MapType<MyController>();
```

Sisk バージョン 0.16 以降、AutoScan を有効にすると `RouterModule` を実装したユーザー定義クラスを検索し、ルーターに自動的に関連付けます。AOT コンパイルではサポートされていません。

```cs
mainRouter.AutoScanModules<ApiController>();
```

上記の指示は `ApiController` を実装するすべての型を検索しますが、**型自体は除きます**。2 つのオプションパラメータは、これらの型を検索する方法を示します。最初の引数は型が検索されるアセンブリを示し、2 番目は型がどのように定義されるかを示します。

## 正規表現ルート

デフォルトの HTTP パスマッチングメソッドを使用せず、正規表現で解釈するルートをマークできます。

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

または [RegexRoute](/api/Sisk.Core.Routing.RegexRoute) クラスを使用して:

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

正規表現パターンからキャプチャグループを取得し、[HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) に格納することもできます。

```cs {title="Controller/MyController.cs"}
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

## ルートのプレフィックス設定

クラスまたはモジュール内のすべてのルートに対して [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) 属性でプレフィックスを設定し、文字列として指定できます。

以下は BREAD アーキテクチャ（Browse, Read, Edit, Add, Delete）を使用した例です。

```cs {title="Controller/Api/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
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

上記の例では、HttpResponse パラメータは省略され、グローバルコンテキスト [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current) を通じて使用されます。続くセクションで詳しく説明します。

## リクエストパラメータなしのルート

ルートは [HttpRequest](/api/Sisk.Core.Http.HttpRequest) パラメータなしで定義でき、リクエストコンテキストからリクエストやそのコンポーネントを取得することが可能です。ここでは、すべての API コントローラの基盤となる抽象クラス `ControllerBase` を例に取り、現在の [HttpRequest] を取得する `Request` プロパティを提供します。

```cs {title="Controller/ControllerBase.cs"}
public abstract class ControllerBase
{
    // 現在のスレッドからリクエストを取得します
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // 以下の行は、呼び出されたときに現在の HTTP セッションからデータベースを取得し、存在しない場合は新規作成します
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

そして、すべての派生クラスがリクエストパラメータなしでルート構文を使用できるようにします。

```cs {title="Controller/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // 現在のリクエストから JSON データを読み取ります
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

現在のコンテキストと依存性注入の詳細は、[dependency injection](/docs/features/instancing) チュートリアルをご覧ください。

## 任意のメソッドルート

パスだけでマッチさせ、HTTP メソッドをスキップするルートを定義できます。これにより、ルートコールバック内でメソッドのバリデーションを行うことが可能です。

```cs
// 任意の HTTP メソッドで / にマッチします
mainRouter.MapAny("/", callbackFunction);
```

## 任意のパスルート

任意のパスルートは、テスト対象のルートメソッドに従って HTTP サーバーが受け取る任意のパスに対してテストを行います。ルートメソッドが `RouteMethod.Any` で、パス式に [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) が使用されている場合、このルートは HTTP サーバーからのすべてのリクエストを受け付け、他のルートは定義できません。

```cs
// 以下のルートはすべての POST リクエストにマッチします
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## 大文字小文字を無視したルートマッチング

デフォルトでは、ルートとリクエストの解釈は大文字小文字を区別します。ケースを無視したい場合は、次のオプションを有効にしてください。

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

これにより、正規表現マッチングを行うルートに対しても `RegexOptions.IgnoreCase` が有効になります。

## Not Found (404) コールバックハンドラ

リクエストが既知のルートにマッチしない場合にカスタムコールバックを作成できます。

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // v0.14 以降
        Content = new HtmlContent("<h1>Not found</h1>")
        // 旧バージョン
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Method not allowed (405) コールバックハンドラ

リクエストがパスにはマッチするがメソッドが一致しない場合のカスタムコールバックも作成できます。

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## エラーハンドリング

リクエストライフサイクル内（事前実行リクエストハンドラ、ルーターアクション、事後実行リクエストハンドラおよびバリューハンドラ）で例外がスローされることがあります。これらの例外は以下の仕組みで管理されます。

- [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) が `true` の場合、例外は通常通りスローされ、Sisk によって捕捉されません。例外が捕捉されないと HTTP サーバーが中断する可能性があります。
- [HttpServerConfiguration.ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) が `false` の場合、例外は Sisk によって捕捉・処理されます。その後、`Router.CallbackErrorHandler` が定義されていれば捕捉した例外とリクエストコンテキストで呼び出され、**標準エラー出力には転送されません**。`Router.CallbackErrorHandler` が未定義の場合、例外は標準エラー出力に転送され、クライアントは HTTP 500 エラー応答を受け取ります。標準エラー出力が未定義の場合、エラーは黙って無視されます。

**注意:** `Router.CallbackErrorHandler` 内では、エラー用、アクセスログ用、両方、またはなしのログモードを設定でき、デフォルトのログ書き込み動作を変更できます。

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // ログモードを上書きし、アクセスログとエラーログの両方にエラーを記録します
}
```

## 内部エラーハンドラ

ルートコールバックはサーバー実行中にエラーをスローすることがあります。正しく処理されないと、HTTP サーバー全体の機能が停止する可能性があります。ルーターには、ルートコールバックが失敗したときにサービス中断を防ぐコールバックがあります。

このメソッドは [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) が `false` に設定されている場合にのみ利用可能です。

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```
