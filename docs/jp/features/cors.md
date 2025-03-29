# CORS（クロスオリジンリソース共有）をSiskで有効にする

Siskには、サービスを公開する際に[CORS（クロスオリジンリソース共有）](https://developer.mozilla.org/ja/docs/jp/Web/HTTP/CORS)を処理するためのツールがあります。この機能はHTTPプロトコルの一部ではなく、W3Cによって定義されたWebブラウザーの特定の機能です。このセキュリティメカニズムにより、Webページは提供されたWebページと異なるドメインへのリクエストを送信することができません。サービスプロバイダーは、特定のドメインまたは1つのドメインにリソースへのアクセスを許可できます。

## 同一オリジン

リソースが「同一オリジン」として識別されるためには、リクエストには[オリジン](https://developer.mozilla.org/ja/docs/jp/Web/HTTP/Headers/Origin)ヘッダーが含まれている必要があります。

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

そして、リモートサーバーは、リクエストされたオリジンと同じ値を持つ[Access-Control-Allow-Origin](https://developer.mozilla.org/ja/docs/jp/Web/HTTP/Headers/Access-Control-Allow-Origin)ヘッダーで応答する必要があります。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

この検証は**明示的**です。ホスト、ポート、プロトコルは、リクエストされたものと同じでなければなりません。次の例を確認してください。

- サーバーは、`Access-Control-Allow-Origin`が`https://example.com`であることを応答します。
  - `https://example.net` - ドメインが異なります。
  - `http://example.com` - スキームが異なります。
  - `http://example.com:5555` - ポートが異なります。
  - `https://www.example.com` - ホストが異なります。

仕様では、ヘッダーの構文は、リクエストとレスポンスの両方に許可されます。URLパスは無視されます。デフォルトのポート（HTTPの80、HTTPSの443）である場合は、ポートは省略されます。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## CORSを有効にする

ネイティブに、[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)オブジェクトが[ListeningHost](/api/Sisk.Core.Http.ListeningHost)内にあります。

サーバーを初期化するときにCORSを構成できます。

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

[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)クラスには、2つの似たプロパティがあります。[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin)と[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)です。1つは単数形、もう1つは複数形です。

- **AllowOrigin**プロパティは静的です。指定したオリジンだけがすべてのレスポンスに送信されます。
- **AllowOrigins**プロパティは動的です。サーバーは、リクエストのオリジンがこのリストに含まれているかどうかを確認します。如果見つかった場合、そのオリジンのレスポンスに送信されます。

### オリジンでのワイルドカード

代わりに、レスポンスのオリジンでワイルドカード(`*`)を使用して、任意のオリジンがリソースにアクセスできるように指定できます。ただし、この値は、資格情報（認証ヘッダー）を持つリクエストには許可されず、この操作は[エラー](https://developer.mozilla.org/ja/docs/jp/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)になります。

この問題を回避するには、[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)プロパティを使用して、許可されるオリジンを明示的にリストするか、または[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin)プロパティの値に[AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin)定数を使用できます。このマジックプロパティは、`Access-Control-Allow-Origin`ヘッダーをリクエストの`Origin`ヘッダーの値と同じ値に定義します。

## CORSを適用する他の方法

[サービスプロバイダー](/docs/jp/extensions/service-providers)を扱っている場合は、構成ファイルで定義された値をオーバーライドできます。

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

## 特定のルートでのCORSの無効化

`UseCors`プロパティは、ルートとすべてのルート属性で使用でき、次の例のように無効にできます。

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

## レスポンスの値の置き換え

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

## プリフライトリクエスト

プリフライトリクエストは、クライアントが実際のリクエストを送信する前に送信する[OPTIONS](https://developer.mozilla.org/ja/docs/jp/Web/HTTP/Reference/Methods/OPTIONS)メソッドのリクエストです。

Siskサーバーは、適用可能なCORSヘッダーとともに`200 OK`でリクエストに応答し、クライアントは実際のリクエストを続行できます。この条件は、ルートが[RouteMethod](/api/Sisk.Core.Routing.RouteMethod)を`Options`に明示的に構成した場合を除き、適用されません。

## CORSのグローバルな無効化

これは不可能です。CORSを使用しない場合は、構成しないでください。