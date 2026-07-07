# リクエスト

リクエストは HTTP リクエストメッセージを表す構造体です。 [HttpRequest](/api/Sisk.Core.Http.HttpRequest) オブジェクトには、アプリケーション全体で HTTP メッセージを処理するための便利な機能が含まれています。

HTTP リクエストは、メソッド、パス、バージョン、ヘッダー、ボディで構成されます。

このドキュメントでは、これらの要素を取得する方法を解説します。

## リクエストメソッドの取得

受信したリクエストのメソッドを取得するには、`Method` プロパティを使用します。

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

このプロパティは、[HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) オブジェクトで表されるリクエストのメソッドを返します。

> [!NOTE]
> ルートメソッドとは異なり、このプロパティは [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) を返しません。代わりに実際のリクエストメソッドを返します。

## リクエスト URL の各コンポーネント取得

リクエストの特定のプロパティを使用して、URL のさまざまなコンポーネントを取得できます。例として、次の URL を考えます。

```
http://localhost:5000/user/login?email=foo@bar.com
```

| コンポーネント名 | 説明 | コンポーネント値 |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | リクエストパスを取得します。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | パスとクエリ文字列を取得します。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | 完全な URL 文字列を取得します。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | リクエストのホストを取得します。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | ホストとポートを取得します。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | クエリ文字列を取得します。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 名前付き値コレクションとしてクエリを取得します。 | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | SSL が使用されているか (true) どうか (false) を判定します。 | `false` |

また、上記すべてを 1 つのオブジェクトとして取得できる [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) プロパティを使用することもできます。

## リクエストメタデータとキャンセル

Sisk は各リクエストに運用メタデータを付与します。これらのプロパティは、ログ、トレース、ローカリゼーション、診断、長時間実行される操作に役立ちます。

| プロパティまたはメソッド | 用途 |
| --- | --- |
| [RequestId](/api/Sisk.Core.Http.HttpRequest.RequestId) | リクエストの一意識別子。`IncludeRequestIdHeader` を有効にすると `X-Request-Id` ヘッダーとして返されます。 |
| [RequestedAt](/api/Sisk.Core.Http.HttpRequest.RequestedAt) | Sisk がリクエストオブジェクトを作成した瞬間。 |
| [RemoteAddress](/api/Sisk.Core.Http.HttpRequest.RemoteAddress) | 接続から解決されたクライアントアドレス、または [ForwardingResolver](/docs/jp/advanced/forwarding-resolvers) から取得されたもの。 |
| [Culture](/api/Sisk.Core.Http.HttpRequest.Culture) | `Accept-Language` から解決された最適なカルチャ。フォールバックは現在のカルチャです。 |
| [DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) | クライアントが切断されたときにシグナルが送られるキャンセルトークン（設定された HTTP エンジンがサポートしている場合）。 |
| [Bag](/api/Sisk.Core.Http.HttpRequest.Bag) | リクエストハンドラ間やルートアクションで共有される型安全なキー/バリュー ストア。 |
| [GetRawHttpRequest](/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest) | 診断用のリクエストテキスト表現。 |

## リクエストボディの取得

フォーム、ファイル、API 取引など、ボディを含むリクエストがあります。ボディは次のプロパティで取得できます。

```cs
// リクエストのエンコーディングを使用して文字列として取得
string body = request.Body;

// バイト配列として取得
byte[] bodyBytes = request.RawBody;

// ストリームとして取得
Stream requestStream = request.GetRequestStream();

// 非同期にボディを取得
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

リクエストにボディが存在するか、ロード済みかは、[HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents)（コンテンツの有無）と [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable)（サーバーがリモートからコンテンツを完全に受信したか）で判定できます。

`GetRequestStream` を複数回呼び出すことはできません。このメソッドで読み込むと、`RawBody` と `Body` の値も利用できなくなります。リクエストストリームはリクエストコンテキストの終了時に自動的に破棄されるため、明示的に Dispose する必要はありません。また、`HttpRequest.RequestEncoding` プロパティで手動デコードに最適なエンコーディングを取得できます。

サーバーはリクエストコンテンツの読み取りに上限を設けており、これは [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) と [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body) の両方に適用されます。これらのプロパティは、[HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength) と同サイズのローカルバッファへ全入力ストリームをコピーします。

クライアントが送信したコンテンツが [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) を超えると、ステータス 413 Content Too Large が返されます。設定された上限が無い、または非常に大きい場合、クライアント送信サイズが [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue)（約 2 GB）を超えると、上記プロパティのいずれかにアクセスした時点で [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) がスローされます。ストリーミングでの処理は引き続き可能です。

> [!NOTE]
> Sisk が許可していても、HTTP セマンティクスに従ってアプリケーションを構築し、メソッドが許可しないコンテンツの取得や提供は行わない方が常に安全です。詳細は [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html) を参照してください。

## JSON リクエストの読み取り

JSON API では、`Body` を手動で読み取ってデシリアライズする代わりに、組み込みの JSON ヘルパーを使用してください。これらは [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) を利用し、デフォルトで [HttpRequest.DefaultJsonSerializerOptions](/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions) が適用されます。

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

非同期ルートやキャンセルでデシリアライズを中止したい場合は、非同期オーバーロードを使用します。

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

エンドポイントごとにカスタムの [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions) を指定することもできます。

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

Native AOT やトリミングに敏感なアプリケーションでは、`JsonSerializerContext` が生成する `JsonTypeInfo<T>` オーバーロードを使用します。

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

JSON ヘルパーにも「一度だけ読み取る」ルールが適用されます。`GetJsonContent`、`GetJsonContentAsync`、`Body`、`RawBody` のいずれかでストリームを読み取った後は、`GetRequestStream()` で同じボディを再度取得することはできません。

## リクエストコンテキストの取得

HTTP コンテキストは、HTTP サーバー、ルート、ルータ、リクエストハンドラ情報を格納する Sisk 固有のオブジェクトです。これにより、散在しがちなオブジェクトを整理しやすくなります。

現在実行中の [HttpContext](/api/Sisk.Core.Http.HttpContext) は、静的メソッド `HttpContext.GetCurrentContext()` で取得できます。このメソッドは、現在のスレッドで処理中のリクエストのコンテキストを返します。

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### ログモード

[HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) プロパティで、現在のリクエストに対するロギング動作を制御できます。特定のリクエストだけロギングを有効化・無効化し、サーバーのデフォルト設定を上書きできます。

```cs
// このリクエストのロギングを無効化
context.LogMode = LogOutputMode.None;
```

### Request Bag

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) オブジェクトは、リクエストハンドラ間で情報を受け渡すためのストレージで、最終的なコールバックで消費できます。ルートコールバックの後に実行されるハンドラでも利用可能です。

> [!TIP]
> このプロパティは [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) からもアクセスできます。

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
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

上記ハンドラは `AuthenticatedUser` をリクエストバッグに設定し、最終コールバックで取得できます。

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
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

`Bag.Set()` と `Bag.Get()` ヘルパーで型シングルトン単位の取得・設定も可能です。

`TypedValueDictionary` クラスは `GetValue` と `SetValue` メソッドも提供しています。

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## フォームデータの取得

以下の例のように、[StringKeyStoreCollection](/api/Sisk.Core.Entity.StringKeyStoreCollection) でフォームデータの値を取得できます。

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

リクエストボディが大きい場合やキャンセル対応が必要な場合は、非同期バージョンを使用します。

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## マルチパートフォームデータの取得

Sisk の HTTP リクエストでは、ファイルやフォームフィールド、任意のバイナリコンテンツなど、アップロードされたマルチパートコンテンツを取得できます。

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // 以下のメソッドはリクエスト入力全体を
    // MultipartObject の配列に読み込みます
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Multipart フォームデータで提供されたファイル名。
        // ファイルでない場合は null が返ります。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // フィールド名
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // コンテンツ長
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // ファイルヘッダーに基づく画像形式の判定。
        // 既知のコンテンツタイプで認識できない場合は
        // MultipartObjectCommonFormat.Unknown が返ります。
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

ルートが非同期の場合は、[GetMultipartFormContentAsync](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync) を使用してください。

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Sisk の [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) とそのメソッド、プロパティ、機能の詳細はドキュメントをご参照ください。

## クライアント切断の検出

Sisk v1.15 以降、[HttpRequest.DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) によるキャンセルトークンが提供されます。設定された HTTP エンジンが切断検出をサポートしている場合、クライアント接続がレスポンス完了前に閉じられるとこのトークンがキャンセルされます。長時間実行される処理を、クライアントが待機していないときに停止させるのに便利です。

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // リクエストから切断トークンを取得
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

このトークンはすべての HTTP エンジンでサポートされているわけではなく、エンジンごとに実装が必要です。

デフォルトの Sisk エンジン（`System.Net.HttpListener` ベース）はクライアント切断検出をサポートしていません。その場合 `DisconnectToken` は `CancellationToken.None` となり、実質的にキャンセル不可能なトークンとして扱われます。

[Cadente エンジン](/docs/jp/cadente) は `DisconnectToken` をサポートしています。切断感知型のキャンセルが必要な場合は Cadente もしくは同様の機能を実装したエンジンを使用してください。サポートエンジンでもキャンセルは協調的であり、トークンを非同期 API に渡し、独自の長時間処理内でトークンをチェックする必要があります。

## サーバー送信イベント（SSE）サポート

Sisk は [Server-sent events](https://developer.mozilla.org/en-US/docs/jp/Web/API/Server-sent_events) をサポートしており、ストリームとしてチャンクを送信し、サーバーとクライアント間の接続を維持できます。

`HttpRequest.GetEventSource` メソッドを呼び出すと、`HttpRequest` がリスナ状態になります。この状態では、サーバー側イベントによって送信されるパケットが `HttpResponse` と重複しないよう、HTTP リクエストは `HttpResponse` を期待しません。

すべてのパケット送信後、コールバックは [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) メソッドを返す必要があります。これにより最終レスポンスがサーバーに送信され、ストリーミングが終了したことが示されます。

`Content‑Length` ヘッダーで接続終了を予測できないため、全パケットの総長さを事前に決めることはできません。

ほとんどのブラウザはデフォルトで GET 以外のヘッダーやメソッドの送信をサポートしないため、イベントソースリクエストで特定ヘッダーが必要な場合は注意が必要です。

また、クライアント側で `EventSource.close` が呼び出されない限り、ほとんどのブラウザはストリームを再開し続け、サーバー側で無限に処理が走り続ける可能性があります。そのため、すべてのパケット送信完了後に「完了」パケットを送るのが一般的です。

以下は、ブラウザ側がサーバー送信イベントを受信する例です。

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

サーバー側で順次メッセージを送信する例です。

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
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

このコードを実行すると、以下のような結果が得られます。

<img src="/assets/img/server side events demo.gif" />

## プロキシされた IP とホストの解決

Sisk はプロキシ環境でも使用でき、クライアントからプロキシへの取引において IP アドレスがプロキシエンドポイントに置き換えられることがあります。

[forwarding resolvers](/docs/jp/advanced/forwarding-resolvers) を使用して、独自のリゾルバを定義できます。

## ヘッダーのエンコーディング

一部の実装ではヘッダーのエンコーディングが問題になることがあります。Windows では UTF‑8 ヘッダーがサポートされていないため、ASCII が使用されます。Sisk には誤ってエンコードされたヘッダーをデコードするための組み込みエンコーディングコンバータがあります。

この機能はコストが高く、デフォルトでは無効化されていますが、[HttpServerConfiguration.NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings) で有効化できます。