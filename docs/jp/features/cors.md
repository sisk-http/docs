# SiskでのCORS（Cross-Origin Resource Sharing）を有効にする

Siskには、公開されているサービスで[CORS（Cross-Origin Resource Sharing）](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Guides/CORS)を処理するためのツールがあります。この機能は、HTTPプロトコルの一部ではなく、W3Cによって定義されたWebブラウザの特定の機能です。このセキュリティメカニズムは、Webページが提供されたWebページと異なるドメインへのリクエストを送信することを防ぎます。サービスプロバイダーは、特定のドメインまたは1つのドメインにリソースへのアクセスを許可できます。

## 同じオリジン

リソースが「同じオリジン」として識別されるためには、リクエストが[オリジン](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Reference/Headers/Origin)ヘッダーを含める必要があります。

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

そして、リモートサーバーは、リクエストされたオリジンと同じ値を持つ[Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/Access-Control-Allow-Origin)ヘッダーで応答する必要があります。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

この検証は**明示的**です。ホスト、ポート、プロトコルは、リクエストされたものと同じでなければなりません。例を確認してください。

* サーバーは、`Access-Control-Allow-Origin` が `https://example.com` であることを応答します。
 + `https://example.net` - ドメインが異なります。
 + `http://example.com` - スキームが異なります。
 + `http://example.com:5555` - ポートが異なります。
 + `https://www.example.com` - ホストが異なります。

仕様では、ヘッダーの構文は、リクエストとレスポンスの両方に対して許可されます。URLパスは無視されます。デフォルトのポート（HTTPの80、HTTPSの443）である場合、ポートは省略されます。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## CORSを有効にする

ネイティブに、[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) オブジェクトが[ListeningHost](/api/Sisk.Core.Http.ListeningHost)内にあります。

サーバーを初期化するときにCORSを設定できます。

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

上記のコードは、**すべてのレスポンス**に対して次のヘッダーを送信します。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

これらのヘッダーは、エラーとリダイレクトを含むすべてのWebクライアントへのレスポンスに送信される必要があります。

[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) クラスには、2つの似たプロパティがあります: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) と [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)。1つは単数形で、もう1つは複数形です。

* **AllowOrigin** プロパティは静的です。指定されたオリジンだけがすべてのレスポンスに送信されます。
* **AllowOrigins** プロパティは動的です。サーバーは、リクエストのオリジンがこのリストに含まれているかどうかを確認します。如果見つかった場合、そのオリジンのレスポンスに送信されます。

### ワイルドカードと自動ヘッダー

代わりに、レスポンスのオリジンにワイルドカード (`*`) を使用して、どのオリジンでもリソースにアクセスできるように指定できます。ただし、この値は、資格情報（認証ヘッダー）を持つリクエストには許可されず、この操作は[エラー](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)になります。

この問題を回避するには、[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) プロパティを使用して、許可されるオリジンを明示的にリストするか、または [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) プロパティの値に [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) 定数を使用できます。このマジックプロパティは、`Access-Control-Allow-Origin` ヘッダーを、リクエストの `Origin` ヘッダーの値と同じ値に定義します。

また、[AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) と [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) を使用して、`AllowOrigin` と同様の動作を実現できます。これらは、ヘッダーが送信された方法に基づいて自動的にレスポンスします。

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // リクエストのOriginヘッダーに基づいてレスポンスします。
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Access-Control-Request-Methodヘッダーまたはリクエストメソッドに基づいてレスポンスします。
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Access-Control-Request-Headersヘッダーまたは送信されたヘッダーに基づいてレスポンスします。
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders],

        exposeHeaders: [HttpKnownHeaderNames.ContentType, "X-Authenticated-Account-Id"],
        allowCredentials: true))
    .Build();
```

## CORSを他の方法で適用する

サービスプロバイダーを扱っている場合は、構成ファイルで定義された値をオーバーライドできます。

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // 構成ファイルで定義されたオリジンをオーバーライドします。
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## 特定のルートでのCORSを無効にする

`UseCors` プロパティは、ルートとすべてのルート属性で使用でき、次の例のように無効にできます。

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## レスポンスの値を置き換える

ルーター アクションで値を明示的に置き換えるまたは削除することができます。

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Access-Control-Allow-Credentialsヘッダーを削除します。
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Access-Control-Allow-Originを置き換えます。
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## プリフライト リクエスト

プリフライト リクエストは、クライアントが実際のリクエストを送信する前に送信する [OPTIONS](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Reference/Methods/OPTIONS) メソッドのリクエストです。

Siskサーバーは、適用可能なCORSヘッダーとともに、常に `200 OK` でリクエストに応答し、クライアントは実際のリクエストを続行できます。この条件は、[RouteMethod](/api/Sisk.Core.Routing.RouteMethod) が `Options` に明示的に設定されたルートが存在する場合を除き、適用されません。

## CORSをグローバルに無効にする

これは不可能です。CORSを使用しない場合は、構成しないでください。