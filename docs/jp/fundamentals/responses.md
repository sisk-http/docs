# レスポンス

レスポンスは、HTTP リクエストに対する HTTP レスポンスを表すオブジェクトです。これらは、サーバーからクライアントに、リソース、ページ、ドキュメント、ファイルまたはその他のオブジェクトのリクエストの完了を示すために送信されます。

HTTP レスポンスは、ステータス、ヘッダー、およびコンテンツで構成されます。

このドキュメントでは、Sisk を使用して HTTP レスポンスを構築する方法を説明します。

## HTTP ステータスの設定

HTTP ステータス一覧は、HTTP/1.0 以降同じであり、Sisk はすべてをサポートしています。

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

または、Fluent Syntax を使用して:

```cs
new HttpResponse()
 .WithStatus(200) // または
 .WithStatus(HttpStatusCode.Ok) // または
 .WithStatus(HttpStatusInformation.Ok);
```

使用可能な HttpStatusCode の一覧は、[こちら](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode) で確認できます。また、[HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 構造体を使用して独自のステータス コードを指定することもできます。

## ボディとコンテンツタイプ

Sisk は、レスポンスのボディを送信するために .NET ネイティブ コンテント オブジェクトをサポートしています。たとえば、[StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) クラスを使用して JSON レスポンスを送信できます。

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

サーバーは、ヘッダーで明示的に定義されていない場合、コンテンツから `Content-Length` を計算しようとします。サーバーがレスポンス コンテンツから Content-Length ヘッダーを暗黙のうちに取得できない場合、レスポンスは Chunked-Encoding で送信されます。

[StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) を送信するか、[GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream) メソッドを使用してレスポンスをストリーミングすることもできます。

## レスポンスヘッダ

レスポンスで送信するヘッダを追加、編集、または削除できます。以下の例は、クライアントへのリダイレクト レスポンスを送信する方法を示しています。

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

または、Fluent Syntax を使用して:

```cs
new HttpResponse(301)
 .WithHeader("Location", "/login");
```

[HttpHeaderCollection](/api/Sisk.Core.Entity.HttpHeaderCollection) の [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) メソッドを使用すると、すでに送信されたヘッダを変更せずにヘッダをリクエストに追加します。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) メソッドは、同じ名前のヘッダを指定された値に置き換えます。HttpHeaderCollection のインデクサーは、内部的に Set メソッドを呼び出してヘッダを置き換えます。

## クッキーの送信

Sisk には、クライアントでのクッキーの定義を容易にするメソッドがあります。このメソッドで設定されたクッキーは、すでに URL エンコードされ、RFC-6265 標準に適合しています。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

または、Fluent Syntax を使用して:

```cs
new HttpResponse(301)
 .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

このメソッドのより完全なバージョンは、[こちら](/api/Sisk.Core.Http.CookieHelper.SetCookie) にあります。

## チャンクレスポンス

大きなレスポンスを送信するために、転送エンコードをチャンクに設定できます。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

チャンクエンコードを使用する場合、Content-Length ヘッダーは自動的に省略されます。

## レスポンスストリーム

レスポンス ストリームは、管理された方法で、セグメント化された方法でレスポンスを送信できるようにします。これは、HttpResponse オブジェクトを使用するよりも低レベルの操作であり、ヘッダーとコンテンツを手動で送信し、接続を閉じる必要があります。

この例では、ファイルの読み取り専用ストリームを開き、ストリームをレスポンス出力ストリームにコピーし、ファイルをメモリにロードしません。これは、大きなファイルまたは中程度のファイルをサーブする場合に便利です。

```cs
// レスポンス出力ストリームを取得します
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// チャンクエンコードを使用するようにレスポンスエンコードを設定します
// チャンクエンコードを使用する場合、Content-Length ヘッダーを送信しないでください
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// ファイルストリームをレスポンス出力ストリームにコピーします
fileStream.CopyTo(responseStream.ResponseStream);

// ストリームを閉じます
return responseStream.Close();
```

## GZip、Deflate、および Brotli 圧縮

Sisk で圧縮されたコンテンツを使用してレスポンスを送信できます。まず、以下の圧縮ツールで [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) オブジェクトをカプセル化して、クライアントに圧縮されたレスポンスを送信します。

```cs
router.MapGet("/hello.html", request => {
 string myHtml = "...";
    
 return new HttpResponse () {
 Content = new GZipContent(new HtmlContent(myHtml)),
 // または Content = new BrotliContent(new HtmlContent(myHtml)),
 // または Content = new DeflateContent(new HtmlContent(myHtml)),
 };
});
```

これらの圧縮コンテンツをストリーミングで使用することもできます。

```cs
router.MapGet("/archive.zip", request => {
    
 // ここで "using" を適用しないでください。HttpServer はレスポンスを送信した後でコンテンツを破棄します。
 var archive = File.OpenRead("/path/to/big-file.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(archive)
 }
});
```

これらのコンテンツを使用する場合、Content-Encoding ヘッダーは自動的に設定されます。

## 自動圧縮

[EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) プロパティを使用して、HTTP レスポンスを自動的に圧縮することができます。このプロパティは、ルーターからのレスポンス コンテンツを圧縮可能なコンテンツで自動的にカプセル化し、リクエストで受け入れられている場合にのみ圧縮を行います。レスポンスが [CompressedContent](/api/Sisk.Core.Http.CompressedContent) から継承されていない場合に限り、圧縮が行われます。

1 つのリクエストに対して、1 つの圧縮コンテンツのみが選択され、Accept-Encoding ヘッダーに従って、以下の順序で選択されます。

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

リクエストがこれらの圧縮方法のいずれを受け入れることを指定した場合、レスポンスは自動的に圧縮されます。

## 暗黙のレスポンスタイプ

HttpResponse 以外の戻り値タイプを使用できますが、ルーターが各タイプのオブジェクトを処理する方法を構成する必要があります。

概念は、常に参照型を返し、それを有効な HttpResponse オブジェクトに変換することです。HttpResponse を返すルートは、変換を経ません。

値タイプ (構造体) は、[RouterCallback](/api/Sisk.Core.Routing.RouterCallback) と互換性がないため、戻り値のタイプとして使用できません。そのため、ValueResult でラッピングしてハンドラーで使用できるようにする必要があります。

以下の例は、戻り値のタイプとして HttpResponse を使用しないルーター モジュールの例です。

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
 User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
 Users.Add(fromBody);
        
 return true;
 }
}
```

これにより、ルーターが各タイプのオブジェクトを処理する方法を定義する必要があります。オブジェクトは常にハンドラーの最初の議論であり、出力タイプは有効な HttpResponse でなければなりません。また、ルートの出力オブジェクトは、決して null になることはできません。

ValueResult タイプの場合、入力オブジェクトが ValueResult であることを示す必要はなく、T のみで十分です。ValueResult は、その元のコンポーネントから反映されたオブジェクトであるためです。

タイプの関連付けは、登録されたものとルーター コールバックから返されたオブジェクトのタイプを比較しません。代わりに、ルーター結果のタイプが登録されたタイプに割り当て可能かどうかを確認します。

Object ハンドラーの登録は、以前に検証されていないすべてのタイプのフォールバックになります。値ハンドラーの挿入順序も重要であり、Object ハンドラーの登録は、他のタイプ固有のハンドラーを無視します。常に特定の値ハンドラーを最初に登録して、順序を確保してください。

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

// オブジェクトの値ハンドラーの登録は最後に実行する必要があります
// このハンドラーはフォールバックとして使用されます
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## 列挙オブジェクトと配列に関する注意

[IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) を実装する暗黙のレスポンス オブジェクトは、`ToArray()` メソッドによってメモリに読み込まれ、定義された値ハンドラーによって変換されます。これが発生するには、`IEnumerable` オブジェクトがオブジェクトの配列に変換され、レスポンス コンバーターは、元のタイプではなく常に `Object[]` を受け取ります。

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

上記の例では、`IEnumerable<string>` コンバーターは呼び出されません。入力オブジェクトは常に `Object[]` であり、`IEnumerable<string>` に変換できません。ただし、以下に示すように、コンバーターが `IEnumerable<object>` を受け取る場合は、入力を受け取ります。

[IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) を実装する値は、[ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) プロパティが有効になっている場合、サーバーによって自動的に処理されます。非同期列挙は、ブロック列挙に変換され、オブジェクトの同期配列に変換されます。