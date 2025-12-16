# Aktivierung von CORS (Cross-Origin Resource Sharing) in Sisk

Sisk verfügt über ein Tool, das bei der Verarbeitung von [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Guides/CORS) nützlich sein kann, wenn Sie Ihren Dienst öffentlich zugänglich machen. Diese Funktion ist nicht Teil des HTTP-Protokolls, sondern eine spezifische Funktion von Webbrowsern, die von der W3C definiert wird. Dieser Sicherheitsmechanismus verhindert, dass eine Webseite Anfragen an einen anderen Domain als diejenige sendet, die die Webseite bereitgestellt hat. Ein Dienstanbieter kann bestimmten Domains den Zugriff auf seine Ressourcen erlauben oder nur einer.

## Same Origin

Damit eine Ressource als "same origin" identifiziert wird, muss eine Anfrage den [Origin](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Reference/Headers/Origin)-Header in ihrer Anfrage enthalten:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

Und der Remote-Server muss mit einem [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/Access-Control-Allow-Origin)-Header antworten, der den gleichen Wert wie die angeforderte Ursprung hat:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Diese Überprüfung ist **explizit**: Der Host, Port und Protokoll müssen identisch mit dem Angeforderten sein. Überprüfen Sie das Beispiel:

- Ein Server antwortet, dass sein `Access-Control-Allow-Origin` `https://example.com` ist:
    - `https://example.net` - die Domäne ist unterschiedlich.
    - `http://example.com` - das Schema ist unterschiedlich.
    - `http://example.com:5555` - der Port ist unterschiedlich.
    - `https://www.example.com` - der Host ist unterschiedlich.

In der Spezifikation ist nur die Syntax für beide Header zulässig, sowohl für Anfragen als auch für Antworten. Der URL-Pfad wird ignoriert. Der Port wird auch weggelassen, wenn es sich um einen Standardport (80 für HTTP und 443 für HTTPS) handelt.

```http
Origin: null
Origin: <schema>://<hostname>
Origin: <schema>://<hostname>:<port>
```

## Aktivierung von CORS

Natürlich haben Sie das [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)-Objekt innerhalb Ihres [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

Sie können CORS beim Initialisieren des Servers konfigurieren:

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

Der obige Code sendet die folgenden Header für **alle Antworten**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Diese Header müssen für alle Antworten an einen Web-Client gesendet werden, einschließlich Fehler und Umleitungen.

Sie können feststellen, dass die [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders)-Klasse zwei ähnliche Eigenschaften hat: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) und [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Beachten Sie, dass eine plural und die andere singular ist.

- Die **AllowOrigin**-Eigenschaft ist statisch: Nur die Ursprung, die Sie angeben, wird für alle Antworten gesendet.
- Die **AllowOrigins**-Eigenschaft ist dynamisch: Der Server überprüft, ob die Ursprung der Anfrage in dieser Liste enthalten ist. Wenn sie gefunden wird, wird sie für die Antwort dieser Ursprung gesendet.

### Wildcards und automatische Header

Alternativ können Sie ein Wildcard-Zeichen (`*`) in der Antwort-Ursprung verwenden, um anzugeben, dass jede Ursprung auf die Ressource zugreifen darf. Allerdings ist dieser Wert nicht zulässig für Anfragen, die Anmeldeinformationen (Autorisierungsheader) enthalten, und dieser Vorgang [wird zu einem Fehler führen](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Sie können dieses Problem umgehen, indem Sie explizit auflisten, welche Ursprünge über die [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)-Eigenschaft zugelassen werden oder auch die [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin)-Konstante im Wert von [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) verwenden. Diese magische Eigenschaft wird den `Access-Control-Allow-Origin`-Header für den gleichen Wert wie den `Origin`-Header der Anfrage definieren.

Sie können auch [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) und [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) für ein ähnliches Verhalten wie `AllowOrigin` verwenden, das automatisch basierend auf den gesendeten Headern antwortet.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Antworte basierend auf dem Origin-Header der Anfrage
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Antworte basierend auf dem Access-Control-Request-Method-Header oder der Anfragemethode
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Antworte basierend auf dem Access-Control-Request-Headers-Header oder den gesendeten Headern
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders],

        exposeHeaders: [HttpKnownHeaderNames.ContentType, "X-Authenticated-Account-Id"],
        allowCredentials: true))
    .Build();
```

## Andere Möglichkeiten, CORS anzuwenden

Wenn Sie mit [Dienstanbietern](/docs/de/extensions/service-providers) arbeiten, können Sie Werte überschreiben, die in der Konfigurationsdatei definiert sind:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Überschreibt die Ursprung, die in der Konfigurationsdatei definiert ist.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Deaktivierung von CORS auf bestimmten Routen

Die `UseCors`-Eigenschaft ist für beide Routen und alle Routenattribute verfügbar und kann mit dem folgenden Beispiel deaktiviert werden:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Grünes Widget", "Rotes Widget" };
    }
}
```

## Ersetzen von Werten in der Antwort

Sie können Werte explizit in einer Router-Aktion ersetzen oder entfernen:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Entfernt den Access-Control-Allow-Credentials-Header
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Ersetzt den Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Grünes Widget", "Rotes Widget" };
    }
}
```

## Preflight-Anfragen

Eine Preflight-Anfrage ist eine [OPTIONS](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Reference/Methods/OPTIONS)-Methode-Anfrage, die der Client vor der eigentlichen Anfrage sendet.

Der Sisk-Server antwortet immer auf die Anfrage mit einem `200 OK` und den anwendbaren CORS-Headern, und dann kann der Client mit der eigentlichen Anfrage fortfahren. Diese Bedingung wird nur nicht angewendet, wenn eine Route für die Anfrage mit der [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) explizit für `Options` konfiguriert ist.

## Deaktivierung von CORS global

Es ist nicht möglich, dies zu tun. Um CORS nicht zu verwenden, konfigurieren Sie es nicht.