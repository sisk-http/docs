# Requests

リクエストは HTTP リクエストメッセージを表す構造体です。`[HttpRequest](/api/Sisk.Core.Http.HttpRequest)` オブジェクトは、アプリケーション全体で HTTP メッセージを処理するための便利な関数を提供します。

HTTP リクエストは、メソッド、パス、バージョン、ヘッダー、ボディで構成されます。

このドキュメントでは、これらの要素を取得する方法を説明します。

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
> ルートメソッドとは異なり、このプロパティは `[RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod)` アイテムを返しません。代わりに、実際のリクエストメソッドを返します。

## リクエスト URL コンポーネントの取得

URL のさまざまなコンポーネントは、リクエストの特定のプロパティを介して取得できます。例として、次の URL を考えます。

```
http://localhost:5000/user/login?email=foo@bar.com
```

| コンポーネント名 | 説明 | コンポーネント値 |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | リクエストパスを取得します。 | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | リクエストパスとクエリ文字列を取得します。 | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | 完全な URL リクエスト文字列を取得します。 | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | リクエストホストを取得します。 | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | リクエストホストとポートを取得します。 | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | リクエストクエリを取得します。 | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | 名前付き値コレクションとしてリクエストクエリを取得します。 | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | リクエストが SSL を使用しているかどうかを判定します (true/false)。 | `false` |

また、`[HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri)` プロパティを使用すると、上記のすべてを 1 つのオブジェクトで取得できます。

## リクエストボディの取得

フォーム、ファイル、または API トランザクションなどのボディを含むリクエストがあります。プロパティからリクエストボディを取得できます。

```cs
// リクエストエンコーディングをエンコーダーとして使用して、文字列としてリクエストボディを取得
string body = request.Body;

// またはバイト配列として取得
byte[] bodyBytes = request.RawBody;

// それ以外の場合はストリームとして取得
Stream requestStream = request.GetRequestStream();
```

リクエストにボディがあるかどうか、およびロードされているかどうかは、`[HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents)` と `[IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable)` プロパティで判断できます。`HasContents` はリクエストにコンテンツがあるかを、`IsContentAvailable` は HTTP サーバーがリモートポイントからコンテンツを完全に受信したかを示します。

`GetRequestStream` を使用してリクエストコンテンツを複数回読み取ることはできません。このメソッドで読み取ると、`RawBody` と `Body` の値も利用できなくなります。リクエストストリームは、リクエストのコンテキスト内で破棄する必要はなく、作成された HTTP セッションの終了時に破棄されます。また、`[HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding)` プロパティを使用して、リクエストを手動でデコードするための最適なエンコーディングを取得できます。

サーバーはリクエストコンテンツの読み取りに制限を設けており、これは `[HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body)` と `[HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body)` の両方に適用されます。これらのプロパティは、入力ストリーム全体を `[HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength)` と同じサイズのローカルバッファにコピーします。

クライアントが送信したコンテンツが `[HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength)` を超える場合、ステータス 413 Content Too Large のレスポンスがクライアントに返されます。さらに、設定された制限がない、または制限が大きすぎる場合、クライアントが送信したコンテンツが `[Int32.MaxValue]` (2 GB) を超えると、サーバーは `[OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0)` をスローします。上記のプロパティを介してコンテンツにアクセスしようとするときに発生します。ストリーミングを使用してコンテンツを処理することもできます。

> [!NOTE]
> Sisk は許可していますが、HTTP セマンティクスに従ってアプリケーションを作成し、許可されていない方法でコンテンツを取得または提供しないようにすることが常に良いアイデアです。 [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html) を参照してください。

## リクエストコンテキストの取得

HTTP コンテキストは、HTTP サーバー、ルート、ルーター、リクエストハンドラー情報を格納する Sisk 専用オブジェクトです。これらのオブジェクトを整理するのが難しい環境で、整理するために使用できます。

`[RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag)` オブジェクトは、リクエストハンドラーから別のポイントへ渡される情報を保持し、最終目的地で消費できます。このオブジェクトは、ルートコールバック後に実行されるリクエストハンドラーでも使用できます。

> [!TIP]
> このプロパティは `[HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag)` プロパティからもアクセスできます。

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

上記のリクエストハンドラーは `AuthenticatedUser` をリクエストバッグに定義し、後で最終コールバックで消費できます。

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

`Bag.Set()` と `Bag.Get()` ヘルパーメソッドを使用して、型単位のシングルトンでオブジェクトを取得または設定することもできます。

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

以下の例のように、`[NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection)` でフォームデータの値を取得できます。

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

## マルチパートフォームデータの取得

Sisk の HTTP リクエストは、ファイル、フォームフィールド、または任意のバイナリコンテンツなどのアップロードされたマルチパートコンテンツを取得できます。

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
    // 以下のメソッドは、リクエスト入力全体を
    // MultipartObjects の配列に読み取ります
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // Multipart フォームデータで提供されたファイル名。
        // オブジェクトがファイルでない場合は null が返ります。
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // マルチパートフォームデータオブジェクトのフィールド名。
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // マルチパートフォームデータのコンテンツ長。
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // 既知のコンテンツタイプに基づいて画像フォーマットを判定します。
        // コンテンツが認識されていない一般的なファイル形式の場合、以下のメソッドは
        // MultipartObjectCommonFormat.Unknown を返します。
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Sisk の [Multipart form objects](/api/Sisk.Core.Entity.MultipartObject) とそのメソッド、プロパティ、機能については、さらに詳しく読むことができます。

## クライアント切断の検出

Sisk v1.15 以降、フレームワークは、クライアントとサーバー間の接続が応答を受信する前に予期せず閉じられた場合にスローされる `CancellationToken` を提供します。このトークンは、クライアントが応答を望まなくなったときに長時間実行される操作をキャンセルするために役立ちます。

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // リクエストから切断トークンを取得
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

このトークンはすべての HTTP エンジンと互換性があるわけではなく、各エンジンで実装が必要です。

## サーバー送信イベント（SSE）サポート

Sisk は [Server-sent events](https://developer.mozilla.org/en-US/docs/jp/Web/API/Server-sent_events) をサポートし、チャンクをストリームとして送信し、サーバーとクライアント間の接続を維持できます。

`[HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource)` メソッドを呼び出すと、HttpRequest がリスナー状態になります。この状態では、HTTP リクエストのコンテキストは HttpResponse を期待せず、サーバー側イベントで送信されるパケットと重複します。

すべてのパケットを送信した後、コールバックは `[Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close)` メソッドを返す必要があります。これにより、サーバーに最終レスポンスが送信され、ストリーミングが終了したことが示されます。

送信されるすべてのパケットの総長を予測できないため、`Content-Length` ヘッダーで接続の終了を決定することはできません。

ほとんどのブラウザのデフォルトでは、サーバー側イベントは GET メソッド以外の HTTP ヘッダーやメソッドを送信しません。したがって、イベントソースリクエストで特定のヘッダーが必要なリクエストハンドラーを使用する場合は、ヘッダーがない可能性が高いです。

また、ほとんどのブラウザは、クライアント側で `EventSource.close` メソッドが呼び出されないと、ストリームを再起動します。これにより、サーバー側で無限に追加処理が発生します。この種の問題を回避するには、イベントソースがすべてのパケットの送信を終了したことを示す最終パケットを送信することが一般的です。

以下の例は、ブラウザがサーバー側イベントをサポートするサーバーと通信する方法を示しています。

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

そして、クライアントにメッセージを段階的に送信します。

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

このコードを実行すると、次のような結果が期待されます。

<img src="/assets/img/server side events demo.gif" />

## プロキシされた IP とホストの解決

Sisk はプロキシとともに使用でき、したがって IP アドレスはクライアントからプロキシへのトランザクションでプロキシエンドポイントに置き換えられる場合があります。

Sisk で独自のリゾルバを定義するには、[forwarding resolvers](/docs/jp/advanced/forwarding-resolvers) を使用します。

## ヘッダーエンコーディング

ヘッダーエンコーディングは、いくつかの実装で問題になることがあります。Windows では UTF-8 ヘッダーがサポートされていないため、ASCII が使用されます。Sisk には、誤ってエンコードされたヘッダーをデコードするのに役立つ組み込みエンコーディングコンバータがあります。

この操作はコストが高く、デフォルトでは無効になっていますが、[NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings) フラグで有効にできます。