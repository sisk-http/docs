# Responses

Source: https://docs.sisk-framework.org/ja/docs/fundamentals/responses.html

Responses は HTTP リクエストに対する HTTP レスポンスのオブジェクトを表します。サーバーはリソース、ページ、ドキュメント、ファイル、またはその他のオブジェクトへの要求の結果として、クライアントに送信します。

HTTP レスポンスはステータス、ヘッダー、コンテンツで構成されます。

このドキュメントでは、Sisk で HTTP レスポンスを設計する方法を解説します。

## Setting an HTTP status

HTTP ステータス一覧は HTTP/1.0 以来同じで、Sisk はすべてをサポートしています。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

または Fluent Syntax を使用して:

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

利用可能な `HttpStatusCode` の完全な一覧は[こちら](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode)で確認できます。独自のステータスコードは [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md) 構造体を使用して指定することもできます。

## Body and content-type

Sisk は .NET のネイティブコンテンツオブジェクトをサポートしており、レスポンスのボディを送信できます。たとえば JSON レスポンスを送る場合は [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) クラスを使用します。

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

サーバーはヘッダーで明示的に `Content-Length` を定義していない限り、コンテンツから自動的に `Content-Length` を算出しようとします。サーバーがレスポンスコンテンツから暗黙的に `Content-Length` ヘッダーを取得できない場合、レスポンスは Chunked-Encoding で送信されます。

また、[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) を送信したり、メソッド [GetResponseStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetResponseStream.md) を使用してストリームでレスポンスを返すこともできます。

## Response headers

レスポンスで送信するヘッダーは追加、編集、削除が可能です。以下の例はクライアントへリダイレクトレスポンスを送る方法を示しています。

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

または Fluent Syntax を使用して:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

`HttpHeaderCollection` の [Add](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Add.md) メソッドは、既に送信されているヘッダーを変更せずにヘッダーを追加します。[Set](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Set.md) メソッドは同名のヘッダーを指定した値で置き換えます。`HttpHeaderCollection` のインデクサは内部的に Set メソッドを呼び出してヘッダーを置き換えます。

ヘッダー値は [GetHeaderValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue.md) メソッドで取得できます。このメソッドはレスポンスヘッダーとコンテンツヘッダー（コンテンツが設定されている場合）の両方から値を取得するのに役立ちます。

```cs
// Returns the value of the "Content-Type" header, checking both response.Headers and response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Sending cookies

Sisk にはクライアント側のクッキー定義を簡素化するメソッドがあります。このメソッドで設定されたクッキーはすでに URL エンコードされており、RFC-6265 標準に準拠しています。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

または Fluent Syntax を使用して:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

同じメソッドの[より完全なバージョン](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CookieHelper.SetCookie.md)も用意されています。

## Chunked responses

大きなレスポンスを送信する場合は、転送エンコーディングを chunked に設定できます。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

chunked-encoding を使用すると、`Content-Length` ヘッダーは自動的に省略されます。

## Response stream

レスポンスストリームは、レスポンスを分割して送信できる管理された方法です。`HttpResponse` オブジェクトを使用するより低レベルの操作で、ヘッダーとコンテンツを手動で送信し、最後に接続を閉じる必要があります。

この例はファイルの読み取り専用ストリームを開き、ストリームをレスポンス出力ストリームにコピーし、メモリにファイル全体をロードしません。中規模から大規模なファイルの配信に有用です。

```cs
// gets the response output stream
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// sets the response encoding to use chunked-encoding
// also you shouldn't send content-length header when using
// chunked encoding
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copies the file stream to the response output stream
fileStream.CopyTo(responseStream.ResponseStream);

// closes the stream
return responseStream.Close();
```

## GZip, Deflate and Brotli compression

Sisk では HTTP コンテンツを圧縮してレスポンスを送信できます。まず、`HttpContent` オブジェクトを以下のいずれかの圧縮クラスでラップし、圧縮されたレスポンスをクライアントに送ります。

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // or Content = new BrotliContent(new HtmlContent(myHtml)),
        // or Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

ストリームでも同様の圧縮コンテンツを使用できます。

```cs
router.MapGet("/archive.zip", request => {
    
    // do not apply "using" here. the HttpServer will discard your content
    // after sending the response.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

`Content-Encoding` ヘッダーはこれらのコンテンツを使用すると自動的に設定されます。

## Automatic compression

`[EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md)` プロパティを使用すると、HTTP レスポンスを自動的に圧縮できます。このプロパティは、レスポンスが `[CompressedContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.md)` から継承されていない限り、ルーターからのレスポンスコンテンツをリクエストが受け入れ可能な圧縮コンテンツに自動的にラップします。

リクエストごとに選択される圧縮コンテンツは `Accept-Encoding` ヘッダーに従い、以下の順序で決定されます。

- [BrotliContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.md) (br)
- [GZipContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.md) (gzip)
- [DeflateContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.md) (deflate)

リクエストがこれらの圧縮方式のいずれかを受け入れることを示すと、レスポンスは自動的に圧縮されます。

## Implicit response types

`HttpResponse` 以外の戻り値型も使用できますが、ルーターに各オブジェクト型の取り扱い方法を設定する必要があります。

概念としては、常に参照型を返し、それを有効な `HttpResponse` オブジェクトに変換します。`HttpResponse` を返すルートは変換が行われません。

値型（構造体）は `[RouterCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterCallback.md)` と互換性がないため、ハンドラで使用するには `ValueResult` にラップする必要があります。

以下は `HttpResponse` を戻り値に使用しないルーターモジュールの例です。

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

これにより、ルーター側で各オブジェクト型の処理方法を定義する必要があります。ハンドラの最初の引数は常にオブジェクトで、出力型は有効な `HttpResponse` でなければなりません。また、ルートの出力オブジェクトは `null` にすべきではありません。

`ValueResult` 型の場合、入力オブジェクトが `ValueResult` であることや `T` だけを示す必要はありません。`ValueResult` は元のコンポーネントから反映されたオブジェクトです。

型の関連付けは、ルーターコールバックから返されたオブジェクトの型と登録された型を比較するのではなく、ルーター結果の型が登録型に代入可能かどうかをチェックします。

`Object` 型のハンドラを登録すると、以前に検証されていないすべての型のフォールバックとして機能します。値ハンドラの挿入順序も重要で、`Object` ハンドラを登録すると他の型固有ハンドラが無視されます。順序を保証するため、常に具体的な値ハンドラを先に登録してください。

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// registering an value handler of object must be the last
// value handler which will be used as an fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Deferred Actions

リクエストがルーターに到達すると、まず [request handlers](https://docs.sisk-framework.org/ja/docs/fundamentals/request-handlers.md) を通過し、ルーターアクションで処理され、続いてポスト実行リクエストハンドラが実行されます。ルーターアクションの結果は値ハンドラに渡され、値ハンドラの結果がクライアントへのレスポンスとして送信されます。

このライフサイクルは非同期コンテキスト内で行われます。非同期コンテキストは、ハンドラ間やルーターアクション間でデータを共有するためにユーザーが `[HttpContext Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md)` に追加できる変数を公開します。ルーターアクションの戻り値はこの非同期コンテキストに追加され、値ハンドラからアクセス可能です。

Deferred actions は、クライアントへのレスポンス配信後、同じ非同期コンテキスト内でサイクルの最後に必ず実行されるアクションです。これらは、ログ保存、データベース更新、メール送信など、レスポンス送信に必須でない長時間タスクの実行に利用できます。

例外は Deferred actions 内でも捕捉され、リクエストライフサイクルの他の場所でスローされた場合と同様に処理されます。違いはクライアントがすでにレスポンスを受け取っている点で、例外はデフォルトのエラーハンドリングで処理されます。

`[HttpContext.EnqueueDeferredAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md)` メソッドでアクションの実行を遅延させます。このメソッドは、実行すべき非同期関数と、オプションで実行時間の上限を表すタイムアウトを受け取ります。タイムアウト内に完了しない場合はキャンセルされます。

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // schedules a long-running action that will be executed after sending the response to the client, but still within the same asynchronous context of the request
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Note on enumerable objects and arrays

`IEnumerable` を実装した暗黙的なレスポンスオブジェクトは、定義された値ハンドラを通す前に `ToArray()` メソッドでメモリ上に読み込まれます。この際、`IEnumerable` オブジェクトはオブジェクト配列に変換され、レスポンスコンバータは常に `Object[]` を受け取ります。

以下のシナリオを考えてみましょう。

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

上記例では、`IEnumerable<string>` コンバータは **決して呼び出されません**。入力オブジェクトは常に `Object[]` となり、`IEnumerable<string>` に変換できないためです。一方、`IEnumerable<object>` を受け取るコンバータは入力を受け取ります。これはその型が互換性を持つためです。

列挙可能なオブジェクトの型そのものを扱う必要がある場合は、コレクション要素の型を取得するためにリフレクションを使用する必要があります。すべての列挙可能オブジェクト（リスト、配列、コレクション）は HTTP レスポンスコンバータによってオブジェクト配列に変換されます。

`IAsyncEnumerable` を実装した値は、`[ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md)` プロパティが有効になっている場合、サーバーが自動的に処理します。これは `IEnumerable` と同様の動作で、デフォルトで `HttpServerConfiguration` に有効化されています。非同期列挙はブロッキング列挙子に変換され、さらに同期的なオブジェクト配列に変換されます。独自の値ハンドラや非同期シーケンス用のストリーミングレスポンス戦略を提供する場合にのみ、無効化してください。
