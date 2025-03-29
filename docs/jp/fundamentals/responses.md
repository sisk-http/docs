# 応答

応答は、HTTP リクエストに対する HTTP 応答を表すオブジェクトです。サーバーは、リソース、ページ、ドキュメント、ファイル、その他のオブジェクトの要求に対する応答として、クライアントにこれらの応答を送信します。

HTTP 応答は、ステータス、ヘッダー、コンテンツで構成されます。

このドキュメントでは、Sisk を使用して HTTP 応答を設計する方法について説明します。

## HTTP ステータスの設定

HTTP ステータスの一覧は、HTTP/1.0 以来変更されていません。Sisk では、これらすべてをサポートしています。

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

利用可能な HttpStatusCode の完全な一覧は、[ここ](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode)で確認できます。また、[HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation) 構造体を使用して、独自のステータス コードを指定することもできます。

## ボディとコンテンツ タイプ

Sisk では、.NET のネイティブ コンテンツ オブジェクトを使用して、応答のボディを送信できます。たとえば、JSON 応答を送信するには、[StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) クラスを使用できます。

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

サーバーは、ヘッダーに明示的に定義されていない場合、コンテンツから `Content-Length` を自動的に計算します。サーバーがコンテンツから `Content-Length` ヘッダーを暗黙的に取得できない場合、応答はチャンク化されたエンコードで送信されます。

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

[Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) メソッドを使用すると、既存のヘッダーを変更せずにヘッダーを追加できます。[Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) メソッドを使用すると、同じ名前のヘッダーを置き換えることができます。HttpHeaderCollection のインデクサーは内部的に Set メソッドを呼び出してヘッダーを置き換えます。

## クッキーの送信

Sisk には、クライアントにクッキーを定義する方法を簡素化するメソッドが用意されています。クッキーは、RFC-6265 標準に準拠した URL エンコード形式で送信されます。

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

または、Fluent 構文を使用することもできます。

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

このメソッドのより包括的なバージョンについては、[ここ](/api/Sisk.Core.Http.CookieHelper.SetCookie)を参照してください。

## チャンク化された応答

大きな応答を送信するために、転送エンコードをチャンク化された形式に設定できます。

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

チャンク化されたエンコードを使用すると、`Content-Length` ヘッダーが自動的に省略されます。

## 応答ストリーム

応答ストリームは、応答をセグメント化された形式で送信できる管理された方法です。HttpResponse オブジェクトを使用するよりも低レベルの操作であり、ヘッダーとコンテンツを手動で送信し、接続を閉じる必要があります。

以下の例では、ファイルの読み取り専用ストリームを開き、ストリームを応答の出力ストリームにコピーし、ファイル全体をメモリに読み込まずに送信します。これは、中規模または大規模なファイルを提供する場合に役立ちます。

```cs
// 応答の出力ストリームを取得
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// 応答のエンコードをチャンク化されたエンコードに設定
// チャンク化されたエンコードを使用する場合は、コンテンツの長さヘッダーを送信しないでください
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// ファイル ストリームを応答の出力ストリームにコピー
fileStream.CopyTo(responseStream.ResponseStream);

// ストリームを閉じる
return responseStream.Close();
```

## GZip、Deflate、Brotli圧縮

Sisk では、HTTP コンテンツを圧縮して、圧縮されたコンテンツで応答を送信できます。まず、[HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) オブジェクトを、以下の圧縮器のいずれかにラップして、圧縮された応答をクライアントに送信します。

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

これらの圧縮されたコンテンツをストリーミングでも使用できます。

```cs
router.MapGet("/archive.zip", request => {
    
    // ここでは「using」ステートメントを使用しないでください。HttpServer は、応答を送信した後、コンテンツを破棄します。
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

これらのコンテンツを使用すると、Content-Encoding ヘッダーが自動的に設定されます。

## 暗黙的な応答タイプ

バージョン 0.15 以降、HttpResponse 以外の戻り値タイプを使用できますが、ルーターが各タイプのオブジェクトをどのように処理するかを構成する必要があります。

概念は、常に参照型を返し、それを有効な HttpResponse オブジェクトに変換することです。HttpResponse を返すルートは、変換を経験しません。

構造体 (値型) は、[RouterCallback](/api/Sisk.Core.Routing.RouterCallback) と互換性がないため、戻り値タイプとして使用できません。そこで、ValueResult にラップしてハンドラーで使用できるようにする必要があります。

以下の例は、RouterModule で HttpResponse 以外の戻り値タイプを使用するものです。

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

ここで、ルーターが各タイプのオブジェクトをどのように処理するかを定義する必要があります。オブジェクトは常にハンドラーの最初の引数であり、出力タイプは有効な HttpResponse でなければなりません。また、ルートの出力オブジェクトは、決して null にしてはいけません。

ValueResult タイプの場合、入力オブジェクトは ValueResult ではありません。代わりに、元のコンポーネントから反映されたオブジェクトを使用します。

タイプの関連付けでは、登録されたタイプとルーターの結果のタイプを比較しません。代わりに、ルーターの結果のタイプが登録されたタイプに割り当て可能かどうかを確認します。

オブジェクトのハンドラーを登録すると、以前に検証されていないすべてのタイプに対してフォールバックされます。値ハンドラーの挿入順序も重要です。オブジェクト ハンドラーを登録すると、以前に登録されたすべてのタイプ固有のハンドラーが無視されます。順序を確保するために、常に特定の値ハンドラーを最初に登録します。

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // enumerableValue を使用して何かを行う
});

// 値ハンドラーの登録は、最後にオブジェクト ハンドラーを登録する必要があります。
// これは、以前に検証されていないすべてのタイプに対するフォールバックとして使用されます。
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```