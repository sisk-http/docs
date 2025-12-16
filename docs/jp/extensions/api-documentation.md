# API ドキュメント

`Sisk.Documenting` 拡張機能を使用すると、Sisk アプリケーションの API ドキュメントを自動的に生成できます。コード構造と属性を利用して、包括的なドキュメント サイトを作成し、Open API (Swagger) 形式へのエクスポートをサポートします。

> [!WARNING]
> このパッケージは現在開発中であり、まだ公開されていません。動作と API は将来の更新で変更される可能性があります。

このパッケージはまだ NuGet で利用できないため、ソース コードを直接プロジェクトに組み込むか、プロジェクト依存関係として参照する必要があります。ソース コードは [ここ](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting) でアクセスできます。

`Sisk.Documenting` を使用するには、アプリケーション ビルダーに登録し、ルート ハンドラーをドキュメント属性で装飾する必要があります。

### ミドルウェアの登録

`HttpServerBuilder` の `UseApiDocumentation` 拡張メソッドを使用して、API ドキュメントを有効にします。

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "My Application",
        ApplicationDescription = "Description of my application.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: アプリケーションのメタデータ (名前、説明、バージョンなど) を定義します。
- **routerPath**: ドキュメント ユーザー インターフェイス (または JSON) がアクセス可能な URL パスです。
- **exporter**: ドキュメントのエクスポート方法を構成します。`OpenApiExporter` は Open API (Swagger) サポートを有効にします。

### エンドポイントのドキュメント化

エンドポイントを `[ApiEndpoint]` と `[ApiQueryParameter]` 属性を使用して説明できます。

### `ApiEndpoint`

`[ApiEndpoint]` 属性を使用してエンドポイントの説明を提供できます。

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

`[ApiQueryParameter]` 属性を使用してエンドポイントが受け付けるクエリ文字列パラメーターをドキュメント化できます。

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: クエリ パラメーターの名前です。
- **IsRequired**: パラメーターが必須かどうかを指定します。
- **Description**: パラメーターの人間が読みやすい説明です。
- **Type**: 期待されるデータ型 (例: "string", "int") です。

### `ApiEndpoint`

エンドポイントに一般的な情報を付加します。

*   **Name** (string, required in constructor): API エンドポイントの名前です。
*   **Description** (string): エンドポイントの簡単な説明です。
*   **Group** (string): エンドポイントをグループ化するために使用されます (例: コントローラーまたはモジュールごとに)。
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): `true` の場合、`Description` が設定されていない場合、メソッドの XML ドキュメントの概要を使用します。

### `ApiHeader`

エンドポイントが期待または使用する特定の HTTP ヘッダーをドキュメント化します。

*   **HeaderName** (string, required in constructor): ヘッダーのキー (例: "Authorization") です。
*   **Description** (string): ヘッダーの目的を説明します。
*   **IsRequired** (bool): ヘッダーがリクエストに必須かどうかを示します。

### `ApiParameter`

エンドポイントの汎用パラメーターを定義します。通常、フォーム フィールドまたは他の属性でカバーされていないボディ パラメーターに使用されます。

*   **Name** (string, required in constructor): パラメーターの名前です。
*   **TypeName** (string, required in constructor): パラメーターのデータ型 (例: "string", "int") です。
*   **Description** (string): パラメーターの説明です。
*   **IsRequired** (bool): パラメーターが必須かどうかを示します。

### `ApiParametersFrom`

指定されたクラスまたは型のプロパティからパラメーターのドキュメントを自動的に生成します。

*   **Type** (Type, required in constructor): プロパティを反映するクラスの `Type` です。

### `ApiPathParameter`

パス変数 (例: `/users/{id}`) をドキュメント化します。

*   **Name** (string, required in constructor): パス パラメーターの名前です。
*   **Description** (string): パラメーターが表すものを説明します。
*   **Type** (string): 期待されるデータ型です。

### `ApiQueryParameter`

クエリ文字列パラメーター (例: `?page=1`) をドキュメント化します。

*   **Name** (string, required in constructor): クエリ パラメーターの名前です。
*   **Description** (string): パラメーターの説明です。
*   **Type** (string): 期待されるデータ型です。
*   **IsRequired** (bool): クエリ パラメーターが必須かどうかを示します。

### `ApiRequest`

期待されるリクエスト ボディを説明します。

*   **Description** (string, required in constructor): リクエスト ボディの説明です。
*   **Example** (string): リクエスト ボディの例を含む生の文字列です。
*   **ExampleLanguage** (string): 例の言語です (例: "json", "xml")。
*   **ExampleType** (Type): 設定されている場合、例はこの型から自動的に生成されます (コンテキストによってサポートされている場合)。

### `ApiResponse`

エンドポイントからの可能なレスポンスを説明します。

*   **StatusCode** (HttpStatusCode, required in constructor): 返される HTTP ステータス コード (例: `HttpStatusCode.OK`) です。
*   **Description** (string): このレスポンスの条件を説明します。
*   **Example** (string): レスポンス ボディの例を含む生の文字列です。
*   **ExampleLanguage** (string): 例の言語です。
*   **ExampleType** (Type): 設定されている場合、例はこの型から自動的に生成されます。

## タイプ ハンドラー

タイプ ハンドラーは、.NET タイプ (クラス、列挙型など) をドキュメントの例に変換する責任を持ちます。これは、データ モデルに基づいて自動的にリクエストおよびレスポンス ボディの例を生成するために特に役立ちます。

これらのハンドラーは、`ApiGenerationContext` 内で構成されます。

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

`JsonExampleTypeHandler` は、JSON の例を生成する組み込みハンドラーです。`IExampleBodyTypeHandler` と `IExampleParameterTypeHandler` の両方を実装しています。

アプリケーションのシリアル化 ロジックに合わせて、特定の `JsonSerializerOptions` または `IJsonTypeInfoResolver` でカスタマイズできます。

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### カスタム タイプ ハンドラー

他の形式 (例: XML) をサポートするか、例の生成方法をカスタマイズするために、独自のハンドラーを実装できます。

#### IExampleBodyTypeHandler

リクエストおよびレスポンス タイプのボディの例を生成するために、このインターフェイスを実装します。

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // タイプの XML 文字列を生成します
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

タイプからパラメーターの詳細な説明を生成するために (`[ApiParametersFrom]` で使用されます) このインターフェイスを実装します。

```csharp
public class CustomParameterHandler : IExampleParameterTypeHandler
{
    public ParameterExampleResult[] GetParameterExamplesForType(Type type)
    {
        var properties = type.GetProperties();
        var examples = new List<ParameterExampleResult>();

        foreach (var prop in properties)
        {
            examples.Add(new ParameterExampleResult(
                name: prop.Name,
                typeName: prop.PropertyType.Name,
                isRequired: true,
                description: "Generated description"
            ));
        }

        return examples.ToArray();
    }
}
```

## エクスポーター

エクスポーターは、収集された API ドキュメント メタデータを、他のツールで消費できるか、ユーザーに表示できる特定の形式に変換する責任を持ちます。

### OpenApiExporter

提供されるデフォルトのエクスポーターは `OpenApiExporter` であり、[OpenAPI仕様 3.0.0](https://spec.openapis.org/oas/v3.0.0) に従った JSON ファイルを生成します。

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "Support",
        Email = "support@example.com",
        Url = "https://example.com/support"
    },
    License = new OpenApiLicense()
    {
        Name = "MIT",
        Url = "https://opensource.org/licenses/MIT"
    },
    TermsOfService = "https://example.com/terms"
}
```

### カスタム エクスポーターの作成

独自のエクスポーターを作成するには、`IApiDocumentationExporter` インターフェイスを実装します。これにより、Markdown、HTML、Postman コレクション、またはその他のカスタム形式でのドキュメントの出力を生成できます。

インターフェイスでは、単一のメソッド `ExportDocumentationContent` を実装する必要があります。

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. ドキュメント オブジェクトを処理します
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. コンテンツを HttpContent として返します
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

次に、構成でそれを使用します。

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### 完全な例

以下は、`Sisk.Documenting` を設定し、シンプルなコントローラーをドキュメント化する方法を示す完全な例です。

```csharp
using Sisk.Core.Entity;
using Sisk.Core.Http;
using Sisk.Core.Routing;
using Sisk.Documenting;
using Sisk.Documenting.Annotations;

using var host = HttpServer.CreateBuilder(5555)
    .UseCors(CrossOriginResourceSharingHeaders.CreatePublicContext())
    .UseApiDocumentation(
        context: new ApiGenerationContext()
        {
            ApplicationName = "My application",
            ApplicationDescription = "It greets someone."
        },
        routerPath: "/api/docs",
        exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] })
    .UseRouter(router =>
    {
        router.SetObject(new MyController());
    })
    .Build();

await host.StartAsync();

class MyController
{
    [RouteGet]
    [ApiEndpoint(Description = "Returns a greeting message.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

この例では、`/api/docs` にアクセスすると、"My application" API の生成されたドキュメントが提供され、`GET /` エンドポイントとその `name` パラメーターが説明されます。