# SiskでのCORS (Cross-Origin Resource Sharing) の有効化

Siskには、公開サービスでCORS (Cross-Origin Resource Sharing) を処理するためのツールがあります。この機能は、HTTPプロトコルの一部ではなく、W3Cによって定義されたWebブラウザーの特定の機能です。このセキュリティメカニズムにより、Webページは提供されたWebページと異なるドメインへのリクエストを送信できなくなります。サービスプロバイダーは、特定のドメインまたはすべてのドメインがリソースにアクセスできるように許可できます。

## 同一オリジン

リソースが「同一オリジン」とみなされるためには、リクエストに[Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin)ヘッダーが含まれている必要があります。

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

そして、リモートサーバーは、リクエストされたオリジンと同じ値を持つ[Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)ヘッダーで応答する必要があります。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

この検証は**明示的**です。ホスト、ポート、プロトコルはすべてリクエストされたものと同じでなければなりません。次の例を確認してください。

- サーバーは`Access-Control-Allow-Origin`が`https://example.com`であることを応答します。
  - `https://example.net` - ドメインが異なります。
  - `http://example.com` - スキームが異なります。
  - `http://example.com:5555` - ポートが異なります。
  - `https://www.example.com` - ホストが異なります。

仕様では、ヘッダーの構文は、リクエストとレスポンスの両方に許可されます。URLパスは無視されます。デフォルトポート (HTTPの80、HTTPSの443) の場合、ポートは省略されます。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## CORSの有効化

ネイティブに、[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)オブジェクトが[ListeningHost](/api/Sisk.Core.Http.ListeningHost)内にあります。

サーバーの初期化時にCORSを構成できます。

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

上記のコードは、**すべてのレスポンス**に次のヘッダーを送信します。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

これらのヘッダーは、エラーとリダイレクトを含むすべてのレスポンスにWebクライアントに送信される必要があります。

[CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)クラスには、[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin)と[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)という2つの似たプロパティがあります。1つは単数形、もう1つは複数形です。

- **AllowOrigin**プロパティは静的です。指定したオリジンだけがすべてのレスポンスに送信されます。
- **AllowOrigins**プロパティは動的です。サーバーは、リクエストのオリジンがこのリストに含まれているかどうかを確認します。如果見つかれば、そのオリジンのレスポンスに送信されます。

### オリジンでのワイルドカード

代わりに、レスポンスのオリジンでワイルドカード(`*`)を使用して、任意のオリジンがリソースにアクセスできるように指定できます。ただし、この値は、資格情報 (認証ヘッダー) を含むリクエストには許可されず、この操作は[エラー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)になります。

この問題を回避するには、[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)プロパティで許可されるオリジンを明示的にリストするか、[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin)プロパティの値に[AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin)定数を使用できます。このマジックプロパティは、`Access-Control-Allow-Origin`ヘッダーをリクエストの`Origin`ヘッダーの値と同じ値に定義します。

## CORSを適用する他の方法

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

## レスポンスでの値の置き換え

ルーター アクションで値を明示的に置き換えるまたは削除できます。

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

プリフライト リクエストは、クライアントが実際のリクエストを送信する前に送信する[OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS)メソッド リクエストです。

Siskサーバーは、適用可能なCORSヘッダーとともに`200 OK`で常にリクエストに応答し、クライアントは実際のリクエストを続行できます。この条件は、`Options`に明示的に構成されたルートが存在する場合を除き、適用されません。

## CORSのグローバルな無効化

これは不可能です。CORSを使用しない場合は、構成しないでください。