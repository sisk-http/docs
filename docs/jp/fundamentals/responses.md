# 応答

応答は、HTTP リクエストに対する HTTP 応答を表すオブジェクトです。サーバーは、リソース、ページ、ドキュメント、ファイル、その他のオブジェクトのリクエストに対する応答として、クライアントにこれらの応答を送信します。

HTTP 応答は、ステータス、ヘッダー、コンテンツで構成されます。

このドキュメントでは、Sisk を使用して HTTP 応答を設計する方法について説明します。

## HTTP ステータスの設定

HTTP ステータスの一覧は、HTTP/1.0 以来同じであり、Sisk ではすべてのステータスがサポートされています。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

または、Fluent 構文を使用することもできます。

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

利用可能な HttpStatusCode の完全な一覧は、[こちら](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode)を参照してください。また、[HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 構造体を使用して、独自のステータス コードを指定することもできます。

## ボディとコンテンツ タイプ

Sisk では、ネイティブの .NET コンテンツ オブジェクトを使用して、応答のボディを送信できます。たとえば、JSON 応答を送信するには、[StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) クラスを使用できます。

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

サーバーは、ヘッダーに明示的に定義されていない場合、コンテンツから `Content-Length` を自動的に計算します。サーバーがコンテンツから `Content-Length` ヘッダーを暗黙的に取得できない場合、応答はチャンク エンコードで送信されます。

また、[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) を送信するか、[GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) メソッドを使用して、応答をストリーミングできます。

## 応答ヘッダー

応答で送信するヘッダーを追加、編集、または削除できます。以下の例では、クライアントにリダイレクト応答を送信する方法を示します。

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

または、Fluent 構文を使用することもできます。

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

[Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) メソッドを使用すると、既存のヘッダーを変更せずにヘッダーを追加できます。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) メソッドを使用すると、同じ名前のヘッダーを指定された値に置き換えることができます。HttpHeaderCollection のインデクサーは内部的に Set メソッドを呼び出してヘッダーを置き換えます。

また、[GetHeaderValue](/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue) メソッドを使用して、ヘッダー値を取得することもできます。このメソッドは、応答ヘッダーとコンテンツ ヘッダー (コンテンツが設定されている場合) の両方から値を取得するのに役立ちます。

```cs
// "Content-Type" ヘッダーの値を、応答ヘッダーとコンテンツ ヘッダー (コンテンツが設定されている場合) の両方から取得します。
string? contentType = response.GetHeaderValue("Content-Type");
```

## クッキーの送信

Sisk には、クライアントにクッキーを定義することを容易にするメソッドが用意されています。クッキーは、RFC-6265 標準に従って URL エンコードされます。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

または、Fluent 構文を使用することもできます。

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

このメソッドのより包括的なバージョンについては、[こちら](/api/Sisk.Core.Http.CookieHelper.SetCookie)を参照してください。

## チャンク応答

大きな応答を送信するために、転送エンコードをチャンクに設定できます。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

チャンク エンコードを使用すると、`Content-Length` ヘッダーが自動的に省略されます。

## 応答ストリーム

応答ストリームは、セグメント化された方法で応答を送信するための管理された方法です。これは、HttpResponse オブジェクトを使用するよりも低レベルの操作であり、ヘッダーとコンテンツを手動で送信し、接続を閉じる必要があります。

以下の例では、ファイルの読み取り専用ストリームを開き、ストリームを応答の出力ストリームにコピーし、ファイル全体をメモリに読み込まずにファイルを提供する方法を示します。

```cs
// 応答の出力ストリームを取得します。
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 応答のエンコードをチャンク エンコードに設定します。
// チャンク エンコードを使用する場合は、コンテンツの長さヘッダーを送信しないでください。
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// ファイル ストリームを応答の出力ストリームにコピーします。
fileStream.CopyTo(responseStream.ResponseStream);

// ストリームを閉じます。
return responseStream.Close();
```

## GZip、Deflate、Brotli 圧縮

Sisk では、HTTP コンテンツを圧縮して、圧縮されたコンテンツで応答を送信できます。まず、[HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) オブジェクトを以下の圧縮器のいずれかにラップして、圧縮された応答をクライアントに送信します。

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

また、ストリームと組み合わせてこれらの圧縮コンテンツを使用することもできます。

```cs
router.MapGet("/archive.zip", request => {
    
    // ここでは "using" を適用しないでください。HttpServer は、応答を送信した後、コンテンツを破棄します。
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Content-Encoding ヘッダーは、圧縮コンテンツを使用すると自動的に設定されます。

## 自動圧縮

[EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) プロパティを使用すると、HTTP 応答を自動的に圧縮できます。このプロパティは、ルーターの応答コンテンツを、リクエストで受け入れられる圧縮可能なコンテンツでラップします。ただし、応答が [CompressedContent](/api/Sisk.Core.Http.CompressedContent) から派生していない場合に限ります。

圧縮可能なコンテンツは、Accept-Encoding ヘッダーに従って選択され、以下の順序で選択されます。

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

リクエストがこれらの圧縮方法のいずれかを受け入れることを指定した場合、応答は自動的に圧縮されます。

## 暗黙的な応答タイプ

HttpResponse 以外の戻り値の型を使用することもできますが、ルーターが各型のオブジェクトをどのように処理するかを構成する必要があります。

基本的な概念は、常に参照型を返し、それを有効な HttpResponse オブジェクトに変換することです。HttpResponse を返すルートは、変換を経験しません。

構造体 (値型) は、[RouterCallback](/api/Sisk.Core.Routing.RouterCallback) と互換性がないため、ValueResult でラップしてハンドラーで使用する必要があります。

以下の例は、HttpResponse を返さない戻り値の型を使用するルーター モジュールからです。

```csharp
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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

ここで、ルーターが各型のオブジェクトをどのように処理するかを定義する必要があります。オブジェクトは常にハンドラーの最初の引数であり、出力型は有効な HttpResponse でなければなりません。また、ルートの出力オブジェクトは、決して null にしてはなりません。

ValueResult 型の場合、入力オブジェクトが ValueResult であることを示す必要はなく、代わりに T を使用します。ValueResult は、元のコンポーネントから反映されたオブジェクトです。

型の関連付けでは、登録された型とルーター コールバックから返されたオブジェクトの型を比較しません。代わりに、ルーターの結果の型が登録された型に割り当て可能かどうかを確認します。

オブジェクトのハンドラーを登録すると、以前に検証されていないすべての型に対してフォールバックとして機能します。値ハンドラーの登録順序も重要です。オブジェクト ハンドラーを登録すると、他のすべての型固有のハンドラーが無視されます。順序を確保するために、特定の値ハンドラーを最初に登録する必要があります。

```cs
Router r = new Router();
r.SetObject(new UsersController());

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

// オブジェクトの値ハンドラーは最後に登録する必要があります。
// これは、他のすべてのハンドラーのフォールバックとして機能します。
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## 列挙可能なオブジェクトと配列に関する注意

暗黙的な応答オブジェクトが [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) を実装する場合、`ToArray()` メソッドを使用してメモリに読み込まれる前に、定義された値ハンドラーを使用して変換されます。`IEnumerable` オブジェクトは、オブジェクトの配列に変換され、応答コンバーターは常に `Object[]` を受け取り、元の型を受け取ることはありません。

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

上記の例では、`IEnumerable<string>` コンバーターは **呼び出されることはありません**。入力オブジェクトは常に `Object[]` であるため、`IEnumerable<string>` に割り当てられません。ただし、`IEnumerable<object>` を受け取るコンバーターは入力を受け取ります。なぜなら、その値は互換性があるからです。

実際に列挙されるオブジェクトの型を処理する必要がある場合は、反射を使用してコレクション要素の型を取得する必要があります。リスト、配列、コレクションを含むすべての列挙可能なオブジェクトは、HTTP 応答コンバーターによってオブジェクトの配列に変換されます。

[IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) を実装する値は、[ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) プロパティが有効な場合、サーバーによって自動的に処理されます。同期的な列挙と同様に、非同期的な列挙はブロッキングの列挙に変換され、次に同期的なオブジェクトの配列に変換されます。