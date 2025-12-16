# API-Dokumentation

Die `Sisk.Documenting`-Erweiterung ermöglicht es Ihnen, API-Dokumentationen für Ihre Sisk-Anwendung automatisch zu generieren. Sie nutzt die Struktur Ihres Codes und Attribute, um eine umfassende Dokumentationsseite zu erstellen, die den Export im Open-API-Format (Swagger) unterstützt.

> [!WARNING]
> Dieses Paket ist derzeit in Entwicklung und wurde noch nicht veröffentlicht. Sein Verhalten und seine API können sich in zukünftigen Updates ändern.

Da dieses Paket noch nicht auf NuGet verfügbar ist, müssen Sie den Quellcode direkt in Ihr Projekt einbinden oder als Projektabhängigkeit referenzieren. Sie können den Quellcode [hier](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Documenting) zugreifen.

Um `Sisk.Documenting` zu verwenden, müssen Sie es im Anwendungs-Builder registrieren und Ihre Routen-Handler mit Dokumentations-Attributen dekorieren.

### Registrierung des Middleware

Verwenden Sie die `UseApiDocumentation`-Erweiterungsmethode auf Ihrem `HttpServerBuilder`, um die API-Dokumentation zu aktivieren.

```csharp
using Sisk.Documenting;

// ...

host.UseApiDocumentation(
    context: new ApiGenerationContext()
    {
        ApplicationName = "Meine Anwendung",
        ApplicationDescription = "Beschreibung meiner Anwendung.",
        Version = "1.0.0"
    },
    routerPath: "/api/docs",
    exporter: new OpenApiExporter() { ServerUrls = ["http://localhost:5555/"] });
```

- **context**: Definiert Metadaten über Ihre Anwendung, wie z.B. Name, Beschreibung und Version.
- **routerPath**: Der URL-Pfad, unter dem die Dokumentations-Benutzeroberfläche (oder JSON) zugänglich sein wird.
- **exporter**: Konfiguriert, wie die Dokumentation exportiert wird. Der `OpenApiExporter` ermöglicht Open-API-Unterstützung (Swagger).

### Dokumentation von Endpunkten

Sie können Ihre Endpunkte mithilfe der `[ApiEndpoint]`- und `[ApiQueryParameter]`-Attribute auf Ihren Routen-Handler-Methoden beschreiben.

### `ApiEndpoint`

Das `[ApiEndpoint]`-Attribut ermöglicht es Ihnen, eine Beschreibung für den Endpunkt bereitzustellen.

```csharp
[ApiEndpoint(Description = "Gibt eine Begrüßungsnachricht zurück.")]
public HttpResponse Index(HttpRequest request) { ... }
```

### `ApiQueryParameter`

Das `[ApiQueryParameter]`-Attribut dokumentiert Abfrage-String-Parameter, die der Endpunkt akzeptiert.

```csharp
[ApiQueryParameter(name: "name", IsRequired = false, Description = "Der Name der Person, die gegrüßt werden soll.", Type = "string")]
public HttpResponse Index(HttpRequest request) { ... }
```

- **name**: Der Name des Abfrage-Parameters.
- **IsRequired**: Gibt an, ob der Parameter obligatorisch ist.
- **Description**: Eine menschenlesbare Beschreibung des Parameters.
- **Type**: Der erwartete Datentyp (z.B. "string", "int").

### `ApiEndpoint`

Kennzeichnet einen Endpunkt mit allgemeinen Informationen.

*   **Name** (string, erforderlich im Konstruktor): Der Name des API-Endpunkts.
*   **Description** (string): Eine kurze Beschreibung dessen, was der Endpunkt tut.
*   **Group** (string): Ermöglicht die Gruppierung von Endpunkten (z.B. nach Controller oder Modul).
*   **InheritDescriptionFromXmlDocumentation** (bool, Standard: `true`): Wenn `true`, wird versucht, die Zusammenfassung der XML-Dokumentation der Methode zu verwenden, wenn `Description` nicht festgelegt ist.

### `ApiHeader`

Dokumentiert einen bestimmten HTTP-Header, den der Endpunkt erwartet oder verwendet.

*   **HeaderName** (string, erforderlich im Konstruktor): Der Schlüssel des Headers (z.B. "Authorization").
*   **Description** (string): Beschreibt den Zweck des Headers.
*   **IsRequired** (bool): Gibt an, ob der Header für die Anfrage obligatorisch ist.

### `ApiParameter`

Definiert einen generischen Parameter für den Endpunkt, oft verwendet für Formulare oder Body-Parameter, die nicht von anderen Attributen abgedeckt werden.

*   **Name** (string, erforderlich im Konstruktor): Der Name des Parameters.
*   **TypeName** (string, erforderlich im Konstruktor): Der Datentyp des Parameters (z.B. "string", "int").
*   **Description** (string): Eine Beschreibung des Parameters.
*   **IsRequired** (bool): Gibt an, ob der Parameter obligatorisch ist.

### `ApiParametersFrom`

Generiert automatisch Parameter-Dokumentation aus den Eigenschaften einer bestimmten Klasse oder eines bestimmten Typs.

*   **Type** (Type, erforderlich im Konstruktor): Der Klassen-Typ, von dem die Eigenschaften reflektiert werden sollen.

### `ApiPathParameter`

Dokumentiert eine Pfadvariable (z.B. in `/users/{id}`).

*   **Name** (string, erforderlich im Konstruktor): Der Name des Pfadparameters.
*   **Description** (string): Beschreibt, was der Parameter darstellt.
*   **Type** (string): Der erwartete Datentyp.

### `ApiQueryParameter`

Dokumentiert einen Abfrage-String-Parameter (z.B. `?page=1`).

*   **Name** (string, erforderlich im Konstruktor): Der Schlüssel des Abfrage-Parameters.
*   **Description** (string): Beschreibt den Parameter.
*   **Type** (string): Der erwartete Datentyp.
*   **IsRequired** (bool): Gibt an, ob der Abfrage-Parameter obligatorisch ist.

### `ApiRequest`

Beschreibt den erwarteten Anforderungs-Body.

*   **Description** (string, erforderlich im Konstruktor): Eine Beschreibung des Anforderungs-Body.
*   **Example** (string): Ein roher String, der ein Beispiel des Anforderungs-Body enthält.
*   **ExampleLanguage** (string): Die Sprache des Beispiels.
*   **ExampleType** (Type): Wenn festgelegt, wird das Beispiel automatisch aus diesem Typ generiert (wenn vom Kontext unterstützt).

### `ApiResponse`

Beschreibt eine mögliche Antwort vom Endpunkt.

*   **StatusCode** (HttpStatusCode, erforderlich im Konstruktor): Der HTTP-Status-Code, der zurückgegeben wird (z.B. `HttpStatusCode.OK`).
*   **Description** (string): Beschreibt die Bedingung für diese Antwort.
*   **Example** (string): Ein roher String, der ein Beispiel des Antwort-Body enthält.
*   **ExampleLanguage** (string): Die Sprache des Beispiels.
*   **ExampleType** (Type): Wenn festgelegt, wird das Beispiel automatisch aus diesem Typ generiert.

## Typ-Handler

Typ-Handler sind verantwortlich für die Umwandlung Ihrer .NET-Typen (Klassen, Enums usw.) in Dokumentations-Beispiele. Dies ist besonders nützlich für die Generierung automatischer Anforderungs- und Antwort-Body-Beispiele basierend auf Ihren Daten-Modellen.

Diese Handler werden im `ApiGenerationContext` konfiguriert.

```csharp
var context = new ApiGenerationContext()
{
    // ...
    BodyExampleTypeHandler = new JsonExampleTypeHandler(),
    ParameterExampleTypeHandler = new JsonExampleTypeHandler()
};
```

### JsonExampleTypeHandler

Der `JsonExampleTypeHandler` ist ein integrierter Handler, der JSON-Beispiele generiert. Er implementiert sowohl `IExampleBodyTypeHandler` als auch `IExampleParameterTypeHandler`.

Er kann mit spezifischen `JsonSerializerOptions` oder `IJsonTypeInfoResolver` angepasst werden, um der Serialisierungslogik Ihrer Anwendung zu entsprechen.

```csharp
var jsonHandler = new JsonExampleTypeHandler(new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
});

context.BodyExampleTypeHandler = jsonHandler;
```

### Benutzerdefinierte Typ-Handler

Sie können Ihre eigenen Handler implementieren, um andere Formate (wie XML) zu unterstützen oder um zu customisieren, wie Beispiele generiert werden.

#### IExampleBodyTypeHandler

Implementieren Sie dieses Interface, um Body-Beispiele für Anforderungs- und Antwort-Typen zu generieren.

```csharp
public class XmlExampleTypeHandler : IExampleBodyTypeHandler
{
    public BodyExampleResult? GetBodyExampleForType(Type type)
    {
        // Generieren Sie eine XML-Zeichenfolge für den Typ
        string xmlContent = MyXmlGenerator.Generate(type);

        return new BodyExampleResult(xmlContent, "xml");
    }
}
```

#### IExampleParameterTypeHandler

Implementieren Sie dieses Interface, um detaillierte Parameter-Beschreibungen aus einem Typ zu generieren (verwendet von `[ApiParametersFrom]`).

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
                description: "Generierte Beschreibung"
            ));
        }

        return examples.ToArray();
    }
}
```

## Exporteure

Exporteure sind verantwortlich für die Umwandlung der gesammelten API-Dokumentations-Metadaten in ein bestimmtes Format, das von anderen Tools konsumiert oder dem Benutzer angezeigt werden kann.

### OpenApiExporter

Der standardmäßig bereitgestellte Exporteur ist der `OpenApiExporter`, der eine JSON-Datei im OpenAPI-Format 3.0.0 generiert.

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

### Erstellung eines benutzerdefinierten Exporteurs

Sie können Ihren eigenen Exporteur erstellen, indem Sie das `IApiDocumentationExporter`-Interface implementieren. Dies ermöglicht es Ihnen, Dokumentationen in Formaten wie Markdown, HTML, Postman-Sammlung oder jedem anderen benutzerdefinierten Format auszugeben.

Das Interface erfordert, dass Sie eine einzige Methode implementieren: `ExportDocumentationContent`.

```csharp
using Sisk.Core.Http;
using Sisk.Documenting;

public class MyCustomExporter : IApiDocumentationExporter
{
    public HttpContent ExportDocumentationContent(ApiDocumentation documentation)
    {
        // 1. Verarbeiten Sie das Dokumentations-Objekt
        var sb = new StringBuilder();
        sb.AppendLine($"# {documentation.ApplicationName}");

        foreach(var endpoint in documentation.Endpoints)
        {
            sb.AppendLine($"## {endpoint.Method} {endpoint.Path}");
            sb.AppendLine(endpoint.Description);
        }

        // 2. Gehen Sie zurück zum Inhalt als HttpContent
        return new StringContent(sb.ToString(), Encoding.UTF8, "text/markdown");
    }
}
```

Dann verwenden Sie es einfach in Ihrer Konfiguration:

```csharp
host.UseApiDocumentation(
    // ...
    exporter: new MyCustomExporter()
);
```

### Vollständiges Beispiel

Unten finden Sie ein vollständiges Beispiel, das zeigt, wie Sie `Sisk.Documenting` einrichten und einen einfachen Controller dokumentieren können.

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
            ApplicationName = "Meine Anwendung",
            ApplicationDescription = "Es begrüßt jemanden."
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
    [ApiEndpoint(Description = "Gibt eine Begrüßungsnachricht zurück.")]
    [ApiQueryParameter(name: "name", IsRequired = false, Description = "Der Name der Person, die gegrüßt werden soll.", Type = "string")]
    public HttpResponse Index(HttpRequest request)
    {
        string? name = request.Query["name"].MaybeNullOrEmpty() ?? "Welt";
        return new HttpResponse($"Hallo, {name}!");
    }
}
```

In diesem Beispiel wird unter `/api/docs` die generierte Dokumentation für die "Meine Anwendung"-API bereitgestellt, die den `GET /`-Endpunkt und seinen `name`-Parameter beschreibt.