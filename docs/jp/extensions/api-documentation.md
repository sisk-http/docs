# API ドキュメント

`Sisk.Documenting` 拡張機能を使用すると、Sisk アプリケーションの API ドキュメントを自動的に生成できます。コード構造や属性を利用して包括的なドキュメントサイトを作成し、Open API（Swagger）形式へのエクスポートをサポートします。

> [!WARNING]
> このパッケージは現在開発中で、まだ公開されていません。動作や API は今後のアップデートで変更される可能性があります。

このパッケージは NuGet で入手できないため、ソースコードをプロジェクトに直接組み込むか、プロジェクト依存として参照する必要があります。ソースコードは[こちら](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting)から取得できます。

`Sisk.Documenting` を使用するには、アプリケーション ビルダーに登録し、ルートハンドラにドキュメント属性を付与します。

### ドキュメント生成の登録

`HttpServerHostContextBuilder` の `UseApiDocumentation` 拡張メソッドを使用して、アプリケーションを提供するルーターと同じルーターから生成された API ドキュメントを公開します。

```csharp
using Sisk.Documenting;
using Sisk.Documenting.Exporters;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "My Application",
        ApplicationDescription = "Description of my application.",
        ApplicationVersion = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: アプリケーション名、説明、バージョンなどのメタデータを定義します。
- **routerPath**: ドキュメントのユーザーインターフェイス（または JSON）がアクセス可能になる URL パスです。
- **exporter**: ドキュメントのエクスポート方法を構成します。`OpenApiExporter` は Open API（Swagger）サポートを有効にします。

### エンドポイントのドキュメント化

ルートハンドラ メソッドに `[ApiEndpoint]` と `[ApiQueryParameter]` 属性を付与して、エンドポイントを記述できます。

### `ApiEndpoint`

`[ApiEndpoint]` 属性でエンドポイントの説明を提供できます。

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

`[ApiQueryParameter]` 属性は、エンドポイントが受け取るクエリ文字列パラメータを文書化します。

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: クエリ パラメータの名前。
- **IsRequired**: パラメータが必須かどうかを指定します。
- **Description**: パラメータの人間可読な説明。
- **Type**: 期待されるデータ型（例: `"string"`、`"int"`）。

### `ApiEndpoint`

エンドポイントに一般情報を付与します。

* **Name** (string, required in constructor): API エンドポイントの名前。
* **Description** (string): エンドポイントの簡潔な説明。
* **Group** (string): エンドポイントをグループ化するために使用します（例: コントローラやモジュール単位）。
* **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): `true` の場合、`Description` が設定されていないときにメソッドの XML ドキュメント要約を使用しようとします。

### `ApiHeader`

エンドポイントが期待または使用する特定の HTTP ヘッダーを文書化します。

* **HeaderName** (string, required in constructor): ヘッダーのキー（例: `"Authorization"`）。
* **Description** (string): ヘッダーの目的を説明します。
* **IsRequired** (bool): リクエストに対してヘッダーが必須かどうかを示します。

### `ApiParameter`

フォーム フィールドやボディ パラメータなど、他の属性でカバーされない汎用パラメータを定義します。

* **Name** (string, required in constructor): パラメータの名前。
* **TypeName** (string, required in constructor): パラメータのデータ型（例: `"string"`、`"int"`）。
* **Description** (string): パラメータの説明。
* **IsRequired** (bool): パラメータが必須かどうかを示します。

### `ApiParametersFrom`

指定したクラスまたは型のプロパティから自動的にパラメータ文書を生成します。

* **Type** (Type, required in constructor): プロパティを反映させるクラス `Type`。

### `ApiPathParameter`

パス変数（例: `/users/{id}`）を文書化します。

* **Name** (string, required in constructor): パス パラメータの名前。
* **Description** (string): パラメータが何を表すかを説明します。
* **Type** (string): 期待されるデータ型。

### `ApiQueryParameter`

クエリ文字列パラメータ（例: `?page=1`）を文書化します。

* **Name** (string, required in constructor): クエリ パラメータのキー。
* **Description** (string): パラメータの説明。
* **Type** (string): 期待されるデータ型。
* **IsRequired** (bool): クエリ パラメータが必須かどうかを示します。

### `ApiRequest`

期待されるリクエスト ボディを記述します。

* **Description** (string, required in constructor): リクエスト ボディの説明。
* **Example** (string): リクエスト ボディの例を含む生文字列。
* **ExampleLanguage** (string): 例の言語（例: `"json"`、`"xml"`）。
* **PayloadType** (Type): 設定されている場合、構成されたコンテキスト ハンドラがサポートしていれば、この型から自動的に例とスキーマが生成されます。

### `ApiResponse`

エンドポイントからの可能なレスポンスを記述します。

* **StatusCode** (HttpStatusCode, required in constructor): 返される HTTP ステータスコード（例: `HttpStatusCode.OK`）。
* **Description** (string): このレスポンスの条件を説明します。
* **Example** (string): レスポンス ボディの例を含む生文字列。
* **ExampleLanguage** (string): 例の言語。
* **PayloadType** (Type): 設定されている場合、構成されたコンテキスト ハンドラがサポートしていれば、この型から自動的に例とスキーマが生成されます。

## タイプハンドラ

タイプハンドラは、.NET の型（クラス、列挙型など）をドキュメント例に変換する役割を担います。データモデルに基づくリクエストやレスポンス ボディの自動例生成に特に有用です。

これらのハンドラは `ApiGenerationContext` 内で構成します。

```csharp
using Sisk.Documenting.Content;

var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonContentTypeHandler(),
    ParameterExampleTypeHandler = new JsonContentTypeHandler(),
    ContentSchemaTypeHandler = new JsonContentTypeHandler()
};
```

### JsonContentTypeHandler

`JsonContentTypeHandler` は組み込みハンドラで、JSON の例、パラメータ例、JSON スキーマを生成します。`IExampleBodyTypeHandler`、`IExampleParameterTypeHandler`、`IContentSchemaTypeHandler` を実装しています。

アプリケーションのシリアライズ ロジックに合わせて、特定の `JsonSerializerOptions` や `IJsonTypeInfoResolver` でカスタマイズできます。

```csharp
var jsonHandler = new JsonContentTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
context.ParameterExampleTypeHandler = jsonHandler;
context.ContentSchemaTypeHandler = jsonHandler;
```

### カスタムタイプハンドラ

XML など他のフォーマットをサポートしたり、例の生成方法をカスタマイズしたりするために、独自のハンドラを実装できます。

#### IExampleBodyTypeHandler

リクエストおよびレスポンス型のボディ例を生成するためにこのインターフェイスを実装します。

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Generate XML string for the type
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

`[ApiParametersFrom]` で使用される、型から詳細なパラメータ説明を生成するためにこのインターフェイスを実装します。

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

エクスポーターは、収集された API ドキュメント メタデータを、他のツールが利用できる形式やユーザーに表示できる形式に変換する役割を担います。

### OpenApiExporter

デフォルトで提供されるエクスポーターは `OpenApiExporter` で、[OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0) に従った JSON ファイルを生成します。

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

### カスタムエクスポーターの作成

`IApiDocumentationExporter` インターフェイスを実装して独自のエクスポーターを作成できます。これにより、Markdown、HTML、Postman Collection、または任意のカスタム形式でドキュメントを出力できます。

インターフェイスは単一メソッド `ExportDocumentationContent` の実装を要求します。

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Process the documentation object
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Return the content as an HttpContent
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

その後、設定で単に使用します：

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### 完全な例

以下は `Sisk.Documenting` を設定し、シンプルなコントローラをドキュメント化する完全な例です。

```csharp
using Sisk.Core.Entity;
using Sisk.Core.Http;
using Sisk.Core.Routing;
using Sisk.Documenting;
using Sisk.Documenting.Annotations;
using Sisk.Documenting.Exporters;

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
        router.MapInstance(new MyController());
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

この例では、`/api/docs` にアクセスすると「My application」API の生成されたドキュメントが提供され、`GET /` エンドポイントとその `name` パラメータが記述されます。