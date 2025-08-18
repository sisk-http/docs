# Aktivierung von CORS (Cross-Origin Resource Sharing) in Sisk

Sisk verfügt über ein Tool, das bei der Handhabung von [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Guides/CORS) hilfreich sein kann, wenn Sie Ihren Dienst öffentlich zugänglich machen. Diese Funktion ist kein Bestandteil des HTTP-Protokolls, sondern eine spezifische Funktion von Webbrowsern, die vom W3C definiert wurde. Dieser Sicherheitsmechanismus verhindert, dass eine Webseite Anfragen an eine andere Domain als die, die die Webseite bereitgestellt hat, stellt. Ein Dienstanbieter kann bestimmten Domains den Zugriff auf seine Ressourcen erlauben, oder nur einer Domain.

## Same Origin

Damit eine Ressource als „same origin“ identifiziert wird, muss eine Anfrage den [Origin](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Reference/Headers/Origin)-Header in ihrer Anfrage angeben:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

Und der Remote-Server muss mit einem [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Headers/Access-Control-Allow-Origin)-Header mit demselben Wert wie die angeforderte Origin antworten:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Diese Überprüfung ist **explizit**: Host, Port und Protokoll müssen exakt mit der angeforderten Origin übereinstimmen. Prüfen Sie das Beispiel:

- Ein Server antwortet, dass sein `Access-Control-Allow-Origin` `https://example.com` ist:
    - `https://example.net` – die Domain ist anders.
    - `http://example.com` – das Schema ist anders.
    - `http://example.com:5555` – der Port ist anders.
    - `https://www.example.com` – der Host ist anders.

In der Spezifikation ist nur die Syntax für beide Header erlaubt, sowohl für Anfragen als auch für Antworten. Der URL-Pfad wird ignoriert. Der Port wird ebenfalls ausgelassen, wenn es sich um einen Standardport handelt (80 für HTTP und 443 für HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Aktivierung von CORS

Standardmäßig haben Sie das Objekt [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) innerhalb Ihres [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

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

Diese Header müssen für alle Antworten an einen Webclient gesendet werden, einschließlich Fehler und Weiterleitungen.

Sie werden feststellen, dass die Klasse [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) zwei ähnliche Eigenschaften hat: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) und [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Beachten Sie, dass eine die Mehrzahl und die andere die Einzahl ist.

- Die **AllowOrigin**-Eigenschaft ist statisch: nur die von Ihnen angegebene Origin wird für alle Antworten gesendet.
- Die **AllowOrigins**-Eigenschaft ist dynamisch: der Server prüft, ob die Origin der Anfrage in dieser Liste enthalten ist. Wenn sie gefunden wird, wird sie für die Antwort dieser Origin gesendet.

### Wildcards und automatische Header

Alternativ können Sie ein Wildcard (`*`) in der Origin der Antwort verwenden, um anzugeben, dass jede Origin auf die Ressource zugreifen darf. Dieser Wert ist jedoch nicht für Anfragen mit Credentials (Authorisierungsheader) erlaubt und diese Operation [führt zu einem Fehler](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Sie können dieses Problem umgehen, indem Sie explizit auflisten, welche Origins über die Eigenschaft [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) erlaubt sind, oder auch die Konstante [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) im Wert von [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) verwenden. Diese magische Eigenschaft definiert den `Access-Control-Allow-Origin`-Header für denselben Wert wie der `Origin`-Header der Anfrage.

Sie können auch [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) und [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) für ein Verhalten ähnlich wie `AllowOrigin` verwenden, das automatisch auf Basis der gesendeten Header antwortet.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Antwortet basierend auf dem Origin-Header der Anfrage
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Antwortet basierend auf dem Access-Control-Request-Method-Header oder der Anfrage-Methode
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Antwortet basierend auf dem Access-Control-Request-Headers-Header oder den gesendeten Headern
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## Andere Wege, CORS anzuwenden

Wenn Sie mit [service providers](/docs/de/extensions/service-providers) arbeiten, können Sie Werte, die in der Konfigurationsdatei definiert sind, überschreiben:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Überschreibt die in der Konfiguration definierte Origin
            // Datei.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Deaktivieren von CORS auf spezifischen Routen

Die Eigenschaft `UseCors` ist sowohl für Routen als auch für alle Routenattribute verfügbar und kann mit folgendem Beispiel deaktiviert werden:

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

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Preflight-Anfragen

Eine Preflight-Anfrage ist eine [OPTIONS](https://developer.mozilla.org/en-US/docs/de/Web/HTTP/Reference/Methods/OPTIONS)-Methode, die der Client vor der eigentlichen Anfrage sendet.

Der Sisk-Server antwortet immer mit einem `200 OK` und den entsprechenden CORS-Headern, und dann kann der Client mit der eigentlichen Anfrage fortfahren. Diese Bedingung gilt nicht, wenn eine Route für die Anfrage mit dem [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) explizit für `Options` konfiguriert ist.

## Globale Deaktivierung von CORS

Es ist nicht möglich, dies zu tun. Um CORS nicht zu verwenden, konfigurieren Sie es nicht.