# API 文档

Source: https://docs.sisk-framework.org/zh-cn/docs/extensions/api-documentation.html

`Sisk.Documenting` 扩展允许您自动为 Sisk 应用程序生成 API 文档。它利用您的代码结构和特性来创建一个完整的文档站点，支持导出为 Open API（Swagger）格式。

> [!WARNING]
> 此软件包目前仍在开发中，尚未发布。其行为和 API 可能会在未来的更新中发生更改。

由于此软件包尚未在 NuGet 上提供，您必须将源代码直接合并到项目中或将其作为项目依赖引用。您可以在[此处](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting)访问源代码。

要使用 `Sisk.Documenting`，您需要在应用程序构建器中注册它，并在路由处理程序上使用文档特性进行装饰。

### 注册文档生成

在您的 `HttpServerHostContextBuilder` 上使用 `UseApiDocumentation` 扩展方法，以从提供应用程序的同一路由器公开生成的 API 文档。

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

- **context**：定义有关您的应用程序的元数据，例如名称、描述和版本。
- **routerPath**：文档用户界面（或 JSON）可访问的 URL 路径。
- **exporter**：配置文档的导出方式。`OpenApiExporter` 启用 Open API（Swagger）支持。

### 为端点编写文档

您可以在路由处理方法上使用 `[ApiEndpoint]` 和 `[ApiQueryParameter]` 特性来描述端点。

### `ApiEndpoint`

`[ApiEndpoint]` 特性允许您为端点提供描述。

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

`[ApiQueryParameter]` 特性记录端点接受的查询字符串参数。

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**：查询参数的名称。
- **IsRequired**：指定该参数是否为必需。
- **Description**：参数的人类可读描述。
- **Type**：预期的数据类型（例如 "string", "int"）。

### `ApiEndpoint`

为端点添加通用信息的注解。

*   **Name** (string, required in constructor)：API 端点的名称。
*   **Description** (string)：对端点功能的简要描述。
*   **Group** (string)：允许对端点进行分组（例如按控制器或模块）。
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`)：如果为 `true`，且未设置 `Description`，则尝试使用方法的 XML 文档摘要。

### `ApiHeader`

记录端点期望或使用的特定 HTTP 头部。

*   **HeaderName** (string, required in constructor)：头部的键（例如 "Authorization"）。
*   **Description** (string)：描述该头部的用途。
*   **IsRequired** (bool)：指示该头部在请求中是否为必需。

### `ApiParameter`

为端点定义通用参数，常用于表单字段或未被其他特性覆盖的请求体参数。

*   **Name** (string, required in constructor)：参数的名称。
*   **TypeName** (string, required in constructor)：参数的数据类型（例如 "string", "int"）。
*   **Description** (string)：参数的描述。
*   **IsRequired** (bool)：指示该参数是否为必需。

### `ApiParametersFrom`

自动从指定类或类型的属性生成参数文档。

*   **Type** (Type, required in constructor)：要反射属性的类 `Type`。

### `ApiPathParameter`

记录路径变量（例如 `/users/{id}`）。

*   **Name** (string, required in constructor)：路径参数的名称。
*   **Description** (string)：描述该参数代表的含义。
*   **Type** (string)：预期的数据类型。

### `ApiQueryParameter`

记录查询字符串参数（例如 `?page=1`）。

*   **Name** (string, required in constructor)：查询参数的键。
*   **Description** (string)：描述该参数。
*   **Type** (string)：预期的数据类型。
*   **IsRequired** (bool)：指示该查询参数是否必须存在。

### `ApiRequest`

描述预期的请求体。

*   **Description** (string, required in constructor)：请求体的描述。
*   **Example** (string)：包含请求体示例的原始字符串。
*   **ExampleLanguage** (string)：示例的语言（例如 "json", "xml"）。
*   **PayloadType** (Type)：如果设置，示例和模式将根据此类型自动生成（前提是已配置的上下文处理程序支持）。

### `ApiResponse`

描述端点可能的响应。

*   **StatusCode** (HttpStatusCode, required in constructor)：返回的 HTTP 状态码（例如 `HttpStatusCode.OK`）。
*   **Description** (string)：描述此响应的情况。
*   **Example** (string)：包含响应体示例的原始字符串。
*   **ExampleLanguage** (string)：示例的语言。
*   **PayloadType** (Type)：如果设置，示例和模式将根据此类型自动生成（前提是已配置的上下文处理程序支持）。

## 类型处理程序

类型处理程序负责将您的 .NET 类型（类、枚举等）转换为文档示例。这对于基于数据模型自动生成请求和响应体示例特别有用。

这些处理程序在 `ApiGenerationContext` 中进行配置。

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

`JsonContentTypeHandler` 是内置处理程序，可生成 JSON 示例、参数示例和 JSON 模式。它实现了 `IExampleBodyTypeHandler`、`IExampleParameterTypeHandler` 和 `IContentSchemaTypeHandler`。

它可以使用特定的 `JsonSerializerOptions` 或 `IJsonTypeInfoResolver` 进行自定义，以匹配您应用程序的序列化逻辑。

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

### 自定义类型处理程序

您可以实现自己的处理程序以支持其他格式（如 XML）或自定义示例生成方式。

#### IExampleBodyTypeHandler

实现此接口以为请求和响应类型生成体示例。

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

实现此接口以从类型生成详细的参数描述（供 `[ApiParametersFrom]` 使用）。

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

## 导出器

导出器负责将收集的 API 文档元数据转换为可供其他工具使用或向用户展示的特定格式。

### OpenApiExporter

默认提供的导出器是 `OpenApiExporter`，它生成符合 [OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0) 的 JSON 文件。

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

### 创建自定义导出器

您可以通过实现 `IApiDocumentationExporter` 接口来创建自己的导出器。这使您能够以 Markdown、HTML、Postman Collection 或任何其他自定义格式输出文档。

该接口要求实现一个方法：`ExportDocumentationContent`。

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

然后，在配置中直接使用它：

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### 完整示例

下面是一个完整示例，演示如何设置 `Sisk.Documenting` 并为一个简单的控制器编写文档。

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

在此示例中，访问 `/api/docs` 将提供 “My application” API 的生成文档，描述 `GET /` 端点及其 `name` 参数。
