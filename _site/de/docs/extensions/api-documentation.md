# API-Dokumentation

Source: https://docs.sisk-framework.org/de/docs/extensions/api-documentation.html

Die `Sisk.Documenting`‑Erweiterung ermöglicht es Ihnen, automatisch API‑Dokumentation für Ihre Sisk‑Anwendung zu erzeugen. Sie nutzt Ihre Code‑Struktur und Attribute, um eine umfassende Dokumentations‑Website zu erstellen, die den Export ins Open API‑Format (Swagger) unterstützt.

> [!WARNING]
> Dieses Paket befindet sich derzeit in der Entwicklung und ist noch nicht veröffentlicht. Sein Verhalten und die API können sich in zukünftigen Updates ändern.

Da dieses Paket noch nicht auf NuGet verfügbar ist, müssen Sie den Quellcode direkt in Ihr Projekt einbinden oder es als Projekt‑Abhängigkeit referenzieren. Sie können den Quellcode [hier](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting) abrufen.

Um `Sisk.Documenting` zu verwenden, müssen Sie es in Ihrem Application‑Builder registrieren und Ihre Routinen‑Handler mit Dokumentations‑Attributen versehen.

### Registrieren der Dokumentationsgenerierung

Verwenden Sie die Erweiterungsmethode `UseApiDocumentation` auf Ihrem `HttpServerHostContextBuilder`, um die generierte API‑Dokumentation über denselben Router bereitzustellen, der Ihre Anwendung bedient.

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

- **context**: Definiert Metadaten über Ihre Anwendung, wie Name, Beschreibung und Version.
- **routerPath**: Der URL‑Pfad, unter dem die Dokumentations‑Benutzeroberfläche (oder JSON) erreichbar ist.
- **exporter**: Konfiguriert, wie die Dokumentation exportiert wird. Der `OpenApiExporter` ermöglicht die Unterstützung von Open API (Swagger).

### Dokumentieren von Endpunkten

Sie können Ihre Endpunkte mit den Attributen `[ApiEndpoint]` und `[ApiQueryParameter]` auf Ihren Routinen‑Handler‑Methoden beschreiben.

### `ApiEndpoint`

Das `[ApiEndpoint]`‑Attribut erlaubt es Ihnen, eine Beschreibung für den Endpunkt anzugeben.

```csharp
[ApiEndpoint(Description = "Returns a greeting message.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

Das `[ApiQueryParameter]`‑Attribut dokumentiert Abfrage‑String‑Parameter, die der Endpunkt akzeptiert.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "The name of the person to greet.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: Der Name des Abfrage‑Parameters.
- **IsRequired**: Gibt an, ob der Parameter zwingend erforderlich ist.
- **Description**: Eine menschenlesbare Beschreibung des Parameters.
- **Type**: Der erwartete Datentyp (z. B. „string“, „int“).

### `ApiEndpoint`

Annotiert einen Endpunkt mit allgemeinen Informationen.

*   **Name** (string, required in constructor): Der Name des API‑Endpunkts.
*   **Description** (string): Eine kurze Beschreibung dessen, was der Endpunkt tut.
*   **Group** (string): Ermöglicht das Gruppieren von Endpunkten (z. B. nach Controller oder Modul).
*   **InheritDescriptionFromXmlDocumentation** (bool, default: `true`): Wenn `true`, wird versucht, die XML‑Dokumentations‑Zusammenfassung der Methode zu verwenden, falls `Description` nicht gesetzt ist.

### `ApiHeader`

Dokumentiert einen spezifischen HTTP‑Header, den der Endpunkt erwartet oder verwendet.

*   **HeaderName** (string, required in constructor): Der Schlüssel des Headers (z. B. „Authorization“).
*   **Description** (string): Beschreibt den Zweck des Headers.
*   **IsRequired** (bool): Gibt an, ob der Header für die Anfrage zwingend erforderlich ist.

### `ApiParameter`

Definiert einen generischen Parameter für den Endpunkt, häufig verwendet für Formularfelder oder Body‑Parameter, die nicht durch andere Attribute abgedeckt sind.

*   **Name** (string, required in constructor): Der Name des Parameters.
*   **TypeName** (string, required in constructor): Der Datentyp des Parameters (z. B. „string“, „int“).
*   **Description** (string): Eine Beschreibung des Parameters.
*   **IsRequired** (bool): Gibt an, ob der Parameter zwingend erforderlich ist.

### `ApiParametersFrom`

Erzeugt automatisch Parameter‑Dokumentation aus den Eigenschaften einer angegebenen Klasse oder eines Typs.

*   **Type** (Type, required in constructor): Der Klassen‑`Type`, aus dem die Eigenschaften reflektiert werden sollen.

### `ApiPathParameter`

Dokumentiert eine Pfad‑Variable (z. B. in `/users/{id}`).

*   **Name** (string, required in constructor): Der Name des Pfad‑Parameters.
*   **Description** (string): Beschreibt, was der Parameter repräsentiert.
*   **Type** (string): Der erwartete Datentyp.

### `ApiQueryParameter`

Dokumentiert einen Abfrage‑String‑Parameter (z. B. `?page=1`).

*   **Name** (string, required in constructor): Der Schlüssel des Abfrage‑Parameters.
*   **Description** (string): Beschreibt den Parameter.
*   **Type** (string): Der erwartete Datentyp.
*   **IsRequired** (bool): Gibt an, ob der Abfrage‑Parameter zwingend vorhanden sein muss.

### `ApiRequest`

Beschreibt den erwarteten Request‑Body.

*   **Description** (string, required in constructor): Eine Beschreibung des Request‑Bodies.
*   **Example** (string): Ein Roh‑String, der ein Beispiel des Request‑Bodies enthält.
*   **ExampleLanguage** (string): Die Sprache des Beispiels (z. B. „json“, „xml“).
*   **PayloadType** (Type): Falls gesetzt, werden Beispiel und Schema automatisch aus diesem Typ generiert, sofern die konfigurierten Kontext‑Handler dies unterstützen.

### `ApiResponse`

Beschreibt eine mögliche Antwort des Endpunkts.

*   **StatusCode** (HttpStatusCode, required in constructor): Der zurückgegebene HTTP‑Statuscode (z. B. `HttpStatusCode.OK`).
*   **Description** (string): Beschreibt die Bedingung für diese Antwort.
*   **Example** (string): Ein Roh‑String, der ein Beispiel des Antwort‑Bodies enthält.
*   **ExampleLanguage** (string): Die Sprache des Beispiels.
*   **PayloadType** (Type): Falls gesetzt, werden Beispiel und Schema automatisch aus diesem Typ generiert, sofern die konfigurierten Kontext‑Handler dies unterstützen.

## Typ-Handler

Typ‑Handler sind dafür verantwortlich, Ihre .NET‑Typen (Klassen, Enums usw.) in Dokumentations‑Beispiele zu konvertieren. Das ist besonders nützlich, um automatische Request‑ und Response‑Body‑Beispiele basierend auf Ihren Datenmodellen zu erzeugen.

Diese Handler werden innerhalb des `ApiGenerationContext` konfiguriert.

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

Der `JsonContentTypeHandler` ist ein integrierter Handler, der JSON‑Beispiele, Parameter‑Beispiele und JSON‑Schemas erzeugt. Er implementiert `IExampleBodyTypeHandler`, `IExampleParameterTypeHandler` und `IContentSchemaTypeHandler`.

Er kann mit spezifischen `JsonSerializerOptions` oder `IJsonTypeInfoResolver` angepasst werden, um die Serialisierungs‑Logik Ihrer Anwendung zu berücksichtigen.

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

### Custom Type Handlers

Sie können eigene Handler implementieren, um andere Formate (wie XML) zu unterstützen oder um zu steuern, wie Beispiele generiert werden.

#### IExampleBodyTypeHandler

Implementieren Sie dieses Interface, um Body‑Beispiele für Request‑ und Response‑Typen zu erzeugen.

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

Implementieren Sie dieses Interface, um detaillierte Parameter‑Beschreibungen aus einem Typ zu erzeugen (verwendet von `[ApiParametersFrom]`).

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

## Exporters

Exporter sind dafür verantwortlich, die gesammelten API‑Dokumentations‑Metadaten in ein bestimmtes Format zu konvertieren, das von anderen Tools konsumiert oder dem Benutzer angezeigt werden kann.

### OpenApiExporter

Der standardmäßig bereitgestellte Exporter ist der `OpenApiExporter`, der eine JSON‑Datei gemäß der [OpenAPI Specification 3.0.0](https://spec.openapis.org/oas/v3.0.0) erzeugt.

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

### Creating a Custom Exporter

Sie können Ihren eigenen Exporter erstellen, indem Sie das Interface `IApiDocumentationExporter` implementieren. Damit können Sie die Dokumentation in Formaten wie Markdown, HTML, Postman Collection oder einem anderen benutzerdefinierten Format ausgeben.

Das Interface verlangt die Implementierung einer einzigen Methode: `ExportDocumentationContent`.

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

Dann verwenden Sie ihn einfach in Ihrer Konfiguration:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Full Example

Unten finden Sie ein vollständiges Beispiel, das zeigt, wie `Sisk.Documenting` eingerichtet und ein einfacher Controller dokumentiert wird.

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

In diesem Beispiel liefert das Aufrufen von `/api/docs` die generierte Dokumentation für die API „My application“ und beschreibt den `GET /`‑Endpunkt sowie dessen `name`‑Parameter.
