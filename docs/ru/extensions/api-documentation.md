# Документация API

Расширение `Sisk.Documenting` позволяет автоматически генерировать документацию API для вашего приложения Sisk. Оно использует структуру вашего кода и атрибуты для создания полной документации, поддерживающей экспорт в формат Open API (Swagger).

> [!WARNING]
> Этот пакет в настоящее время находится в разработке и еще не опубликован. Его поведение и API могут измениться в будущих обновлениях.

Поскольку этот пакет еще не доступен в NuGet, вам необходимо включить исходный код напрямую в ваш проект или ссылаться на него как на зависимость проекта. Исходный код можно найти [здесь](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting).

Чтобы использовать `Sisk.Documenting`, вам необходимо зарегистрировать его в вашем приложении и украсить ваши обработчики маршрутов атрибутами документации.

### Регистрация Middleware

Используйте метод расширения `UseApiDocumentation` на вашем `HttpServerBuilder`, чтобы включить документацию API.

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "Мое приложение",
        ApplicationDescription = "Описание моего приложения.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Определяет метаданные о вашем приложении, такие как имя, описание и версия.
- **routerPath**: URL-путь, где будет доступен интерфейс документации (или JSON).
- **exporter**: Настройка экспорта документации. `OpenApiExporter` включает поддержку Open API (Swagger).

### Документирование конечных точек

Вы можете описать свои конечные точки, используя атрибуты `[ApiEndpoint]` и `[ApiQueryParameter]` на ваших методах обработчиков маршрутов.

### `ApiEndpoint`

Атрибут `[ApiEndpoint]` позволяет предоставить описание для конечной точки.

```csharp
[ApiEndpoint(Description = "Возвращает сообщение приветствия.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

Атрибут `[ApiQueryParameter]` документирует параметры строки запроса, которые принимает конечная точка.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "Имя человека, которого нужно приветствовать.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: Имя параметра запроса.
- **IsRequired**: Указывает, является ли параметр обязательным.
- **Description**: Человекочитаемое описание параметра.
- **Type**: Ожидаемый тип данных (например, "string", "int").

### `ApiEndpoint`

Украшает конечную точку общей информацией.

*   **Name** (string, required in constructor): Имя конечной точки API.
*   **Description** (string): Краткое описание того, что делает конечная точка.
*   **Group** (string): Позволяет группировать конечные точки (например, по контроллеру или модулю).
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): Если `true`, попытается использовать сводку XML-документации метода, если `Description` не задано.

### `ApiHeader`

Документирует конкретный HTTP-заголовок, который ожидает или использует конечная точка.

*   **HeaderName** (string, required in constructor): Ключ заголовка (например, "Authorization").
*   **Description** (string): Описывает цель заголовка.
*   **IsRequired** (bool): Указывает, является ли заголовок обязательным для запроса.

### `ApiParameter`

Определяет общий параметр для конечной точки, часто используемый для полей формы или параметров тела, не охваченных другими атрибутами.

*   **Name** (string, required in constructor): Имя параметра.
*   **TypeName** (string, required in constructor): Тип данных параметра (например, "string", "int").
*   **Description** (string): Описание параметра.
*   **IsRequired** (bool): Указывает, является ли параметр обязательным.

### `ApiParametersFrom`

Автоматически генерирует документацию параметров из свойств указанного класса или типа.

*   **Type** (Type, required in constructor): Тип класса, свойства которого необходимо отразить.

### `ApiPathParameter`

Документирует переменную пути (например, в `/users/{id}`).

*   **Name** (string, required in constructor): Имя параметра пути.
*   **Description** (string): Описывает, что представляет параметр.
*   **Type** (string): Ожидаемый тип данных.

### `ApiQueryParameter`

Документирует параметр строки запроса (например, `?page=1`).

*   **Name** (string, required in constructor): Ключ параметра запроса.
*   **Description** (string): Описывает параметр.
*   **Type** (string): Ожидаемый тип данных.
*   **IsRequired** (bool): Указывает, должен ли присутствовать параметр запроса.

### `ApiRequest`

Описывает ожидаемое тело запроса.

*   **Description** (string, required in constructor): Описание тела запроса.
*   **Example** (string): Строка, содержащая пример тела запроса.
*   **ExampleLanguage** (string): Язык примера (например, "json", "xml").
*   **ExampleType** (Type): Если задано, пример будет сгенерирован автоматически из этого типа (если поддерживается контекстом).

### `ApiResponse`

Описывает возможный ответ от конечной точки.

*   **StatusCode** (HttpStatusCode, required in constructor): Код состояния HTTP, возвращаемый (например, `HttpStatusCode.OK`).
*   **Description** (string): Описывает условие для этого ответа.
*   **Example** (string): Строка, содержащая пример тела ответа.
*   **ExampleLanguage** (string): Язык примера.
*   **ExampleType** (Type): Если задано, пример будет сгенерирован автоматически из этого типа.

## Обработчики типов

Обработчики типов отвечают за преобразование ваших типов .NET (классов, перечислений и т. д.) в примеры документации. Это особенно полезно для генерации автоматических примеров тела запроса и ответа на основе ваших моделей данных.

Эти обработчики настраиваются в `ApiGenerationContext`.

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

`JsonExampleTypeHandler` — это встроенный обработчик, который генерирует примеры JSON. Он реализует как `IExampleBodyTypeHandler`, так и `IExampleParameterTypeHandler`.

Он может быть настроен с помощью конкретных `JsonSerializerOptions` или `IJsonTypeInfoResolver`, чтобы соответствовать логике сериализации вашего приложения.

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### Пользовательские обработчики типов

Вы можете реализовать свои собственные обработчики, чтобы поддерживать другие форматы (например, XML) или настраивать, как генерируются примеры.

#### IExampleBodyTypeHandler

Реализуйте этот интерфейс, чтобы сгенерировать примеры тела для типов запроса и ответа.

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Сгенерируйте строку XML для типа
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

Реализуйте этот интерфейс, чтобы сгенерировать подробные описания параметров из типа (используется атрибутом `[ApiParametersFrom]`).

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
                description: "Сгенерированное описание"
            ));
        }

        return examples.ToArray();
    }
}
```

## Экспортеры

Экспортеры отвечают за преобразование собранных метаданных документации API в конкретный формат, который может быть потреблен другими инструментами или отображен пользователю.

### OpenApiExporter

Экспортер по умолчанию — `OpenApiExporter`, который генерирует файл JSON, соответствующий [спецификации OpenAPI 3.0.0](https://spec.openapis.org/oas/v3.0.0).

```csharp
new OpenApiExporter()
{
    OpenApiVersion = "3.0.0",
    ServerUrls = new[] { "http://localhost:5555" },
    Contact = new OpenApiContact()
    {
        Name = "Поддержка",
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

### Создание пользовательского экспортера

Вы можете создать свой собственный экспортер, реализовав интерфейс `IApiDocumentationExporter`. Это позволяет выводить документацию в форматах, таких как Markdown, HTML, Postman Collection или любой другой пользовательский формат.

Интерфейс требует реализации одного метода: `ExportDocumentationContent`.

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Обработайте объект документации
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Верните содержимое как HttpContent
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

Затем просто используйте его в вашей конфигурации:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Полный пример

Ниже приведен полный пример, демонстрирующий, как настроить `Sisk.Documenting` и задокументировать простой контроллер.

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
            ApplicationName = "Мое приложение",
            ApplicationDescription = "Оно приветствует кого-то."
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
    [ApiEndpoint(Description = "Возвращает сообщение приветствия.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "Имя человека, которого нужно приветствовать.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "мир";
        return new HttpResponse($"Привет, {name}!");
    }
}
```

В этом примере доступ к `/api/docs` предоставит сгенерированную документацию для API "Мое приложение", описывающую конечную точку `GET /` и ее параметр `name`.