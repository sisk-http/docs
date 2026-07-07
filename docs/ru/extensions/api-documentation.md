# Документация API

Расширение `Sisk.Documenting` позволяет автоматически генерировать документацию API для вашего приложения Sisk. Оно использует структуру вашего кода и атрибуты для создания полноценного сайта документации, поддерживая экспорт в формат Open API (Swagger).

> [!WARNING]
> Этот пакет находится в разработке и ещё не опубликован. Его поведение и API могут измениться в будущих обновлениях.

Поскольку пакет ещё недоступен в NuGet, вам необходимо включить исходный код напрямую в ваш проект или добавить его как зависимость проекта. Исходный код можно найти [здесь](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Чтобы использовать `Sisk.Documenting`, нужно зарегистрировать его в построителе приложения и пометить обработчики маршрутов атрибутами документации.

### Регистрация генерации документации

Используйте метод расширения `UseApiDocumentation` на вашем `HttpServerHostContextBuilder`, чтобы предоставить сгенерированную документацию API из того же роутера, который обслуживает приложение.

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

- **context**: Определяет метаданные о вашем приложении, такие как имя, описание и версия.
- **routerPath**: URL‑путь, по которому будет доступен пользовательский интерфейс документации (или JSON).
- **exporter**: Настраивает способ экспорта документации. `OpenApiExporter` включает поддержку Open API (Swagger).

### Документирование конечных точек

Вы можете описывать свои конечные точки с помощью атрибутов `[ApiEndpoint]` и `[ApiQueryParameter]` на методах обработчиков маршрутов.

### `ApiEndpoint`

Атрибут `[ApiEndpoint]` позволяет задать описание для конечной точки.

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

Атрибут `[ApiQueryParameter]` документирует параметры строки запроса, которые принимает конечная точка.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: Имя параметра запроса.
- **IsRequired**: Указывает, обязателен ли параметр.
- **Description**: Человекочитаемое описание параметра.
- **Type**: Ожидаемый тип данных (например, `"string"`, `"int"`).

### `ApiEndpoint`

Аннотирует конечную точку общей информацией.

*   **Name** (string, required in constructor): Имя API‑конечной точки.
*   **Description** (string): Краткое описание того, что делает конечная точка.
*   **Group** (string): Позволяет группировать конечные точки (например, по контроллеру или модулю).
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): Если `true`, пытается использовать сводку XML‑документации метода, если `Description` не задано.

### `ApiHeader`

Документирует конкретный HTTP‑заголовок, который ожидает или использует конечная точка.

*   **HeaderName** (string, required in constructor): Ключ заголовка (например, `"Authorization"`).
*   **Description** (string): Описывает назначение заголовка.
*   **IsRequired** (bool): Указывает, обязателен ли заголовок для запроса.

### `ApiParameter`

Определяет общий параметр для конечной точки, часто используемый для полей формы или параметров тела, не покрытых другими атрибутами.

*   **Name** (string, required in constructor): Имя параметра.
*   **TypeName** (string, required in constructor): Тип данных параметра (например, `"string"`, `"int"`).
*   **Description** (string): Описание параметра.
*   **IsRequired** (bool): Указывает, обязателен ли параметр.

### `ApiParametersFrom`

Автоматически генерирует документацию параметров из свойств указанного класса или типа.

*   **Type** (Type, required in constructor): Класс `Type`, свойства которого следует отразить.

### `ApiPathParameter`

Документирует переменную пути (например, в `/users/{id}`).

*   **Name** (string, required in constructor): Имя параметра пути.
*   **Description** (string): Описывает, что представляет собой параметр.
*   **Type** (string): Ожидаемый тип данных.

### `ApiQueryParameter`

Документирует параметр строки запроса (например, `?page=1`).

*   **Name** (string, required in constructor): Ключ параметра запроса.
*   **Description** (string): Описание параметра.
*   **Type** (string): Ожидаемый тип данных.
*   **IsRequired** (bool): Указывает, должен ли параметр присутствовать.

### `ApiRequest`

Описывает ожидаемое тело запроса.

*   **Description** (string, required in constructor): Описание тела запроса.
*   **Example** (string): Необработанная строка с примером тела запроса.
*   **ExampleLanguage** (string): Язык примера (например, `"json"`, `"xml"`).
*   **PayloadType** (Type): Если задан, пример и схема будут сгенерированы автоматически из этого типа, когда поддерживаемые обработчики контекста позволяют это.

### `ApiResponse`

Описывает возможный ответ от конечной точки.

*   **StatusCode** (HttpStatusCode, required in constructor): Возвращаемый HTTP‑статус (например, `HttpStatusCode.OK`).
*   **Description** (string): Описание условия для этого ответа.
*   **Example** (string): Необработанная строка с примером тела ответа.
*   **ExampleLanguage** (string): Язык примера.
*   **PayloadType** (Type): Если задан, пример и схема будут сгенерированы автоматически из этого типа, когда поддерживаемые обработчики контекста позволяют это.

## Обработчики типов

Обработчики типов отвечают за преобразование ваших .NET‑типов (классов, перечислений и т.д.) в примеры документации. Это особенно полезно для автоматической генерации примеров запросов и ответов на основе ваших моделей данных.

Эти обработчики настраиваются в `ApiGenerationContext`.

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

`JsonContentTypeHandler` — встроенный обработчик, который генерирует JSON‑примеры, примеры параметров и JSON‑схемы. Он реализует `IExampleBodyTypeHandler`, `IExampleParameterTypeHandler` и `IContentSchemaTypeHandler`.

Его можно настроить с помощью конкретных `JsonSerializerOptions` или `IJsonTypeInfoResolver`, чтобы соответствовать логике сериализации вашего приложения.

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

### Пользовательские обработчики типов

Вы можете реализовать собственные обработчики для поддержки других форматов (например, XML) или для настройки генерации примеров.

#### IExampleBodyTypeHandler

Реализуйте этот интерфейс, чтобы генерировать примеры тела для типов запросов и ответов.

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

Реализуйте этот интерфейс, чтобы генерировать подробные описания параметров из типа (используется `[ApiParametersFrom]`).

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

## Экспортеры

Экспортеры отвечают за преобразование собранных метаданных документации API в конкретный формат, который может быть использован другими инструментами или отображён пользователю.

### OpenApiExporter

Экспортёр по умолчанию — `OpenApiExporter`, который генерирует JSON‑файл в соответствии со [Спецификацией OpenAPI 3.0.0](https://spec.openapis.org/oas/v3.0.0).

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

### Создание собственного экспортёра

Вы можете создать собственный экспортёр, реализовав интерфейс `IApiDocumentationExporter`. Это позволит выводить документацию в форматах, таких как Markdown, HTML, коллекция Postman или любой другой пользовательский формат.

Интерфейс требует реализации единственного метода: `ExportDocumentationContent`.

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

Затем просто используйте его в конфигурации:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Полный пример

Ниже приведён полный пример, демонстрирующий настройку `Sisk.Documenting` и документирование простого контроллера.

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

В этом примере обращение к `/api/docs` будет отдавать сгенерированную документацию для API «My application», описывающую эндпоинт `GET /` и его параметр `name`.