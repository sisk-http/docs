# API 文档

`Sisk.Documenting` 扩展允许您为 Sisk 应用程序自动生成 API 文档。它利用您的代码结构和属性创建一个全面的文档站点，支持导出到 Open API（Swagger）格式。

> [!WARNING]
> 此包目前处于开发中，尚未发布。其行为和 API 可能会在未来的更新中发生变化。

由于此包尚未在 NuGet 上提供，因此您必须直接将源代码纳入您的项目或将其作为项目依赖项引用。您可以在 [这里](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting) 访问源代码。

要使用 `Sisk.Documenting`，您需要在应用程序生成器中注册它，并使用文档属性装饰您的路由处理程序。

### 注册中间件

使用 `HttpServerBuilder` 上的 `UseApiDocumentation` 扩展方法来启用 API 文档。

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "我的应用程序",
        ApplicationDescription = "应用程序描述。",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**：定义应用程序的元数据，例如名称、描述和版本。
- **routerPath**：文档用户界面（或 JSON）将在此 URL 路径上可访问。
- **exporter**：配置如何导出文档。`OpenApiExporter` 启用 Open API（Swagger）支持。

### 文档端点

您可以使用 `[ApiEndpoint]` 和 `[ApiQueryParameter]` 属性在路由处理程序方法上描述端点。

### `ApiEndpoint`

`[ApiEndpoint]` 属性允许您为端点提供描述。

```csharp
[ApiEndpoint(Description = "返回问候消息。")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

`[ApiQueryParameter]` 属性记录端点接受的查询字符串参数。

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "要问候的人的名称。", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**：查询参数的名称。
- **IsRequired**：指定参数是否是必需的。
- **Description**：参数的可读描述。
- **Type**：预期的数据类型（例如“string”、“int”）。

### `ApiEndpoint`

注释端点以一般信息。

*   **Name** (string, required in constructor): API 端点的名称。
*   **Description** (string): 端点的简要描述。
*   **Group** (string): 允许按控制器或模块对端点进行分组。
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): 如果为 `true`，则尝试使用方法的 XML 文档摘要，如果 `Description` 未设置。

### `ApiHeader`

记录端点期望或使用的特定 HTTP 标头。

*   **HeaderName** (string, required in constructor): 标头的键（例如“Authorization”）。
*   **Description** (string): 标头的用途描述。
*   **IsRequired** (bool): 指示标头是否是必需的。

### `ApiParameter`

定义端点的通用参数，通常用于表单字段或 `[ApiQueryParameter]` 不涵盖的正文参数。

*   **Name** (string, required in constructor): 参数的名称。
*   **TypeName** (string, required in constructor): 参数的数据类型（例如“string”、“int”）。
*   **Description** (string): 参数的描述。
*   **IsRequired** (bool): 指示参数是否是必需的。

### `ApiParametersFrom`

自动从指定类或类型的属性生成参数文档。

*   **Type** (Type, required in constructor): 要反射属性的类 `Type`。

### `ApiPathParameter`

记录路径变量（例如 `/users/{id}`）。

*   **Name** (string, required in constructor): 路径参数的名称。
*   **Description** (string): 参数的描述。
*   **Type** (string): 预期的数据类型。

### `ApiQueryParameter`

记录查询字符串参数（例如 `?page=1`）。

*   **Name** (string, required in constructor): 查询参数的键。
*   **Description** (string): 参数的描述。
*   **Type** (string): 预期的数据类型。
*   **IsRequired** (bool): 指示查询参数是否必须存在。

### `ApiRequest`

描述预期的请求正文。

*   **Description** (string, required in constructor): 请求正文的描述。
*   **Example** (string): 包含请求正文示例的原始字符串。
*   **ExampleLanguage** (string): 示例的语言（例如“json”、“xml”）。
*   **ExampleType** (Type): 如果设置，示例将从此类型自动生成（如果上下文支持）。

### `ApiResponse`

描述端点可能返回的响应。

*   **StatusCode** (HttpStatusCode, required in constructor): 返回的 HTTP 状态代码（例如 `HttpStatusCode.OK`）。
*   **Description** (string): 响应条件的描述。
*   **Example** (string): 包含响应正文示例的原始字符串。
*   **ExampleLanguage** (string): 示例的语言。
*   **ExampleType** (Type): 如果设置，示例将从此类型自动生成。

## 类型处理程序

类型处理程序负责将您的 .NET 类型（类、枚举等）转换为文档示例。这对于根据您的数据模型生成自动请求和响应正文示例特别有用。

这些处理程序在 `ApiGenerationContext` 中配置。

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

`JsonExampleTypeHandler` 是一个内置处理程序，生成 JSON 示例。它实现了 `IExampleBodyTypeHandler` 和 `IExampleParameterTypeHandler`。

它可以使用特定的 `JsonSerializerOptions` 或 `IJsonTypeInfoResolver` 自定义以匹配应用程序的序列化逻辑。

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### 自定义类型处理程序

您可以实现自己的处理程序以支持其他格式（如 XML）或自定义示例的生成方式。

#### IExampleBodyTypeHandler

实现此接口以生成请求和响应类型的正文示例。

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // 为类型生成 XML 字符串
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

实现此接口以从类型生成详细的参数描述（由 `[ApiParametersFrom]` 使用）。

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
                description: "生成的描述"
            ));
        }

        return examples.ToArray();
    }
}
```

## 导出器

导出器负责将收集的 API 文档元数据转换为其他工具可以使用或用户可以查看的特定格式。

### OpenApiExporter

默认提供的导出器是 `OpenApiExporter`，它生成一个遵循 [OpenAPI 规范 3.0.0](https://spec.openapis.org/oas/v3.0.0) 的 JSON 文件。

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "支持",
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

### 创建自定义导出器

您可以通过实现 `IApiDocumentationExporter` 接口创建自己的导出器。这允许您以 Markdown、HTML、Postman 收藏或任何其他自定义格式输出文档。

该接口要求您实现一个方法：`ExportDocumentationContent`。

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. 处理文档对象
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. 以 HttpContent 形式返回内容
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

然后，简单地在您的配置中使用它：

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### 完整示例

以下是完整示例，演示如何设置 `Sisk.Documenting` 和文档一个简单控制器。

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
            ApplicationName = "我的应用程序",
            ApplicationDescription = "它向某人问候。"
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
    [ApiEndpoint(Description = "返回问候消息。")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "要问候的人的名称。", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

在此示例中，访问 `/api/docs` 将提供“我的应用程序”API 的生成文档，描述 `GET /` 端点及其 `name` 参数。