# リクエスト

リクエストは、HTTP リクエスト メッセージを表す構造体です。[HttpRequest](/api/Sisk.Core.Http.HttpRequest) オブジェクトには、HTTP メッセージをアプリケーション全体で処理するための便利な関数が含まれています。

HTTP リクエストは、メソッド、パス、バージョン、ヘッダー、ボディで構成されます。

このドキュメントでは、これらの要素を取得する方法について説明します。

## リクエスト メソッドの取得

受信したリクエストのメソッドを取得するには、Method プロパティを使用できます。

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

このプロパティは、[HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod) オブジェクトとして表されるリクエストのメソッドを返します。

> [!NOTE]
> ルート メソッドとは異なり、このプロパティは [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod) アイテムを提供しません。代わりに、実際のリクエスト メソッドを返します。

## リクエスト URL コンポーネントの取得

リクエストの特定のプロパティを使用して、URL からさまざまなコンポーネントを取得できます。次の例では、次の URL を考えてみましょう。

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| コンポーネント名 | 説明 | コンポーネント値 |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | リクエスト パスを取得します。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | リクエスト パスとクエリ文字列を取得します。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | リクエストの完全な URL 文字列を取得します。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | リクエストのホストを取得します。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | リクエストのホストとポートを取得します。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | リクエストのクエリを取得します。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | リクエストのクエリを名前付き値コレクションとして取得します。 | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | リクエストが SSL (true) を使用しているかどうかを判断します。 | `false` |

また、[HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri) プロパティを使用して、上記のすべての情報を 1 つのオブジェクトで取得することもできます。

## リクエスト ボディの取得

一部のリクエストには、フォーム、ファイル、または API トランザクションなどのボディが含まれています。リクエストのボディを取得するには、次のプロパティを使用できます。

```cs
// リクエストのボディを文字列として取得します (リクエストのエンコードを使用)。
string body = request.Body;

// または、バイト配列として取得します。
byte[] bodyBytes = request.RawBody;

// または、ストリームとして取得します。
Stream requestStream = request.GetRequestStream();
```

また、リクエストにボディが含まれているかどうか、およびボディが読み込まれているかどうかを判断するために、[HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents) プロパティと [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) プロパティを使用できます。

`GetRequestStream` メソッドでリクエスト コンテンツを読み取ることは 1 回のみ可能です。如果この方法で読み取ると、`RawBody` と `Body` の値は使用できなくなります。リクエストのコンテキストでは、リクエスト ストリームを破棄する必要はありません。HTTP セッションの終了時に自動的に破棄されます。また、[HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) プロパティを使用して、リクエストを手動でデコードするための最適なエンコードを取得することもできます。

サーバーには、[HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) と [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body) の両方に適用される、リクエスト コンテンツの読み取り制限があります。これらのプロパティは、入力ストリームのコンテンツを同じサイズのローカル バッファーにコピーします。[HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength)。

クライアントが送信したコンテンツが [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) を超える場合、サーバーはクライアントにステータス 413 コンテンツが大きすぎるというレスポンスを返します。さらに、制限が設定されていない場合、または制限が大きすぎる場合、サーバーは [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) をスローします。ただし、コンテンツは依然としてストリーミングを介してアクセスできます。

> [!NOTE]
> Sisk では許可されていますが、HTTP セマンティクスに従ってアプリケーションを作成し、コンテンツを取得または提供するためにメソッドを使用しないことをお勧めします。[RFC 9110 "HTTP セマンティクス"](https://httpwg.org/spec/rfc9110.html) を参照してください。

## リクエスト コンテキストの取得

HTTP コンテキストは、Sisk の独自オブジェクトであり、HTTP サーバー、ルート、ルーター、およびリクエスト ハンドラーの情報を格納します。これを使用して、これらのオブジェクトが難しい環境で自分自身を整理することができます。

[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) オブジェクトには、リクエスト ハンドラーから別のポイントに渡される情報が格納されています。このオブジェクトは、ルート コールバックの後に実行されるリクエスト ハンドラーによっても使用できます。

> [!TIP]
> このプロパティは、[HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag) プロパティでもアクセスできます。

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

上記のリクエスト ハンドラーは、リクエスト バッグに `AuthenticatedUser` を定義し、最終的なコールバックで使用できます。

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

また、`Bag.Set()` および `Bag.Get()` ヘルパー メソッドを使用して、オブジェクトをそのタイプのシングルトンで取得または設定できます。

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

## フォーム データの取得

フォーム データの値を [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) で取得できます。

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

## マルチパート フォーム データの取得

Sisk の HTTP リクエストでは、ファイル、フォーム フィールド、またはバイナリ コンテンツなどのマルチパート コンテンツを取得できます。

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
    // 次のメソッドは、リクエストの入力全体を MultipartObject の配列に読み取ります。
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // マルチパート フォーム データで提供されたファイルの名前。
        // ファイルでない場合は null が返されます。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // マルチパート フォーム データ オブジェクトのフィールド名。
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // マルチパート フォーム データのコンテンツの長さ。
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // 各認識された共通ファイル形式に基づいて、ファイル形式を決定します。
        // ファイルが認識された共通ファイル形式でない場合は、MultipartObjectCommonFormat.Unknown が返されます。
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Sisk の [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) とそのメソッド、プロパティ、機能については、こちらを参照してください。

## サーバー送信イベントのサポート

Sisk では、[サーバー送信イベント](https://developer.mozilla.org/en-US/docs/jp/Web/API/Server-sent_events)をサポートしており、チャンクをストリームとして送信し、サーバーとクライアントの間の接続を維持できます。

[HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) メソッドを呼び出すと、HttpRequest がリッスン状態になります。この状態では、HTTP リクエストのコンテキストは、サーバー側イベントによって送信されるパケットと重複するため、HttpResponse は予想されません。

すべてのパケットを送信した後、コールバックは [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close) メソッドを返す必要があります。これにより、サーバーに最終的なレスポンスが送信され、ストリーミングが終了したことが示されます。

送信されるパケットの合計長は予測できないため、`Content-Length` ヘッダーで接続の終了を判断することはできません。

ほとんどのブラウザーの既定では、サーバー側イベントは GET メソッド以外の HTTP ヘッダーまたはメソッドをサポートしていないため、特定のヘッダーを要求するリクエスト ハンドラーを使用するイベント ソース リクエストに注意する必要があります。そうでない場合は、ヘッダーが存在しない可能性があります。

また、ほとんどのブラウザーは、クライアント側で [EventSource.close](https://developer.mozilla.org/en-US/docs/jp/Web/API/EventSource/close) メソッドが呼び出されない場合、ストリームを再開し、サーバー側で無限に追加の処理が行われる可能性があります。 この種の問題を避けるには、イベント ソースがすべてのパケットを送信したことを示す最終的なパケットを送信することが一般的です。

以下の例は、ブラウザーがサーバー側イベントをサポートするサーバーと通信する方法を示しています。

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

そして、クライアントにメッセージを逐次的に送信します。

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
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

このコードを実行すると、次の結果が期待されます。

<img src="/assets/img/server side events demo.gif" />

## プロキシされた IP とホストの解決

Sisk はプロキシと使用できます。したがって、クライアントとプロキシの間のトランザクションで、IP アドレスがプロキシ エンドポイントに置き換えられる可能性があります。

Sisk では、[forwarding resolvers](/docs/jp/advanced/forwarding-resolvers) を使用して独自の解決策を定義できます。

## ヘッダーのエンコード

ヘッダーのエンコードは、一部の実装では問題になる可能性があります。Windows では、UTF-8 ヘッダーはサポートされていないため、ASCII が使用されます。Sisk には、不正にエンコードされたヘッダーをデコードするための組み込みエンコード コンバーターが含まれています。

この操作はコストがかかるため、デフォルトでは無効になっていますが、[NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) フラグで有効にすることができます。