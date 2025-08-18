# SiskでCORS（クロスオリジンリソース共有）を有効にする

Siskには、サービスを公開する際に[クロスオリジンリソース共有（CORS）](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Guides/CORS) を扱うのに便利なツールがあります。この機能はHTTPプロトコルの一部ではなく、W3C によって定義された Web ブラウザ固有の機能です。このセキュリティメカニズムは、Web ページが Web ページを提供したドメインとは異なるドメインへのリクエストを行うことを防止します。サービスプロバイダーは、特定のドメインにリソースへのアクセスを許可するか、あるいは単一のドメインのみを許可することができます。

## 同一オリジン

リソースが「同一オリジン」として識別されるには、リクエストが [Origin](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Reference/Headers/Origin) ヘッダーをリクエストに含める必要があります。

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

そしてリモートサーバーは、リクエストされたオリジンと同じ値を持つ [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Headers/Access-Control-Allow-Origin) ヘッダーで応答しなければなりません。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

この検証は **明示的** です：ホスト、ポート、プロトコルはリクエストされたものと同じでなければなりません。例を確認してください。

- サーバーが `Access-Control-Allow-Origin` を `https://example.com` と応答する場合：
    - `https://example.net` - ドメインが異なる。
    - `http://example.com` - スキームが異なる。
    - `http://example.com:5555` - ポートが異なる。
    - `https://www.example.com` - ホストが異なる。

仕様では、リクエストとレスポンスの両方のヘッダーに対して構文のみが許可されます。URL パスは無視されます。ポートはデフォルトポート（HTTP は 80、HTTPS は 443）である場合は省略されます。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## CORS を有効にする

ネイティブに、[ListeningHost](/api/Sisk.Core.Http.ListeningHost) 内に [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) オブジェクトがあります。

サーバーを初期化するときに CORS を構成できます。

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

上記のコードは **すべてのレスポンス** に対して次のヘッダーを送信します。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

これらのヘッダーは、エラーやリダイレクトを含むすべてのレスポンスに対して送信する必要があります。

[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) クラスには、[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) と [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) の 2 つの似たプロパティがあります。1 つは複数形、もう 1 つは単数形です。

- **AllowOrigin** プロパティは静的です：指定したオリジンのみがすべてのレスポンスで送信されます。
- **AllowOrigins** プロパティは動的です：サーバーはリクエストのオリジンがこのリストに含まれているかを確認します。見つかった場合、そのオリジンのレスポンスに送信されます。

### ワイルドカードと自動ヘッダー

代わりに、レスポンスのオリジンにワイルドカード（`*`）を使用して、任意のオリジンがリソースにアクセスできるように指定できます。ただし、この値は認証情報（認証ヘッダー）を持つリクエストには許可されず、[エラー](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials) が発生します。

この問題を回避するには、[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) プロパティで許可されるオリジンを明示的に列挙するか、[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) の値に [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) 定数を使用します。このマジックプロパティは、リクエストの `Origin` ヘッダーと同じ値で `Access-Control-Allow-Origin` ヘッダーを定義します。

また、`AllowOrigin` と同様の動作を自動で行う [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) と [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) を使用できます。

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // リクエストの Origin ヘッダーに基づいて応答
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Access-Control-Request-Method ヘッダーまたはリクエストメソッドに基づいて応答
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Access-Control-Request-Headers ヘッダーまたは送信されたヘッダーに基づいて応答
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## CORS を適用する他の方法

[サービスプロバイダー](/docs/jp/extensions/service-providers) を扱っている場合、設定ファイルで定義された値を上書きできます。

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // 設定ファイルで定義されたオリジンを上書き
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## 特定のルートで CORS を無効にする

`UseCors` プロパティはルートとすべてのルート属性で利用可能で、次の例のように無効にできます。

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

## レスポンス内の値を置き換える

ルーターアクションで明示的に値を置き換えたり削除したりできます。

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Access-Control-Allow-Credentials ヘッダーを削除
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Access-Control-Allow-Origin を置き換え
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## プリフライトリクエスト

プリフライトリクエストは、実際のリクエストの前にクライアントが送信する [OPTIONS](https://developer.mozilla.org/en-US/docs/jp/Web/HTTP/Reference/Methods/OPTIONS) メソッドリクエストです。

Sisk サーバーは常に `200 OK` と適用される CORS ヘッダーで応答し、クライアントは実際のリクエストを続行できます。この条件は、`Options` に対して明示的に構成された [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) を持つルートが存在する場合にのみ適用されません。

## CORS をグローバルに無効にする

これは不可能です。CORS を使用しない場合は、構成しないでください。