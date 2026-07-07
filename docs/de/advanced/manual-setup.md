# Manuelle (erweiterte) Einrichtung

Verwenden Sie die manuelle Einrichtung, wenn Sie die Serverkomponenten selbst zusammenbauen müssen, z. B. wenn ein Prozess mehrere Hosts, Ports, Router oder eine benutzerdefinierte Serverkonfiguration bereitstellen muss. Für die meisten Anwendungen ist die Builder‑API kürzer und sollte bevorzugt werden. Die manuelle Einrichtung ist nützlich, wenn Sie direkte Kontrolle über die vier Kernkomponenten haben wollen: einen `Router`, ein oder mehrere `ListeningHost`‑Objekte, eine `HttpServerConfiguration` und den finalen `HttpServer`.

Zunächst müssen wir das Request/Response‑Konzept verstehen. Es ist ganz einfach: Für jede Anfrage muss es eine Antwort geben. Sisk folgt diesem Prinzip ebenfalls. Erstellen wir eine Methode, die mit einer „Hello, World!“-Nachricht in HTML antwortet und dabei den Statuscode sowie Header angibt.

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

Der nächste Schritt ist, diese Methode mit einer HTTP‑Route zu verknüpfen.

## Router

Router sind Abstraktionen von Anforderungsrouten und dienen als Brücke zwischen Anfragen und Antworten für den Dienst. Router verwalten Service‑Routen, Funktionen und Fehler.

Ein Router kann mehrere Routen besitzen, und jede Route kann unterschiedliche Operationen auf diesem Pfad ausführen, z. B. eine Funktion ausführen, eine Seite bereitstellen oder eine Ressource vom Server liefern.

Erstellen wir unseren ersten Router und verknüpfen die `IndexPage`‑Methode mit dem Index‑Pfad.

```csharp
Router mainRouter = new Router();

mainRouter.MapGet("/", IndexPage);
```

Jetzt kann unser Router Anfragen empfangen und Antworten senden. Allerdings ist `mainRouter` nicht an einen Host oder Server gebunden, sodass er allein nicht funktioniert. Der nächste Schritt ist, unser `ListeningHost` zu erstellen.

## Listening‑Hosts und Ports

Ein [ListeningHost](/api/Sisk.Core.Http.ListeningHost) kann einen Router und mehrere Listening‑Ports für denselben Router hosten. Ein [ListeningPort](/api/Sisk.Core.Http.ListeningPort) ist ein Präfix, an dem der HTTP‑Server lauscht.

Hier können wir einen `ListeningHost` erstellen, der auf zwei Endpunkte für unseren Router zeigt:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Jetzt wird unser HTTP‑Server an den angegebenen Endpunkten lauschen und die Anfragen an unseren Router weiterleiten.

## Serverkonfiguration

Die Serverkonfiguration ist für das meiste Verhalten des HTTP‑Servers selbst verantwortlich. In dieser Konfiguration können wir `ListeningHosts` mit unserem Server verknüpfen.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Fügt unseren ListeningHost zu dieser Serverkonfiguration hinzu
```

Gemeinsame Optionen der Serverkonfiguration:

| Eigenschaft | Standard | Verwendung | Hinweise |
| --- | --- | --- | --- |
| [RemoteRequestsAction](/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction) | `RequestListenAction.Accept` | Der Dienst sollte nicht‑lokale Anfragen ablehnen, es sei denn, sie kommen über einen vertrauenswürdigen Reverse‑Proxy. | Auf `Drop` setzen nur, wenn Ihre Bereitstellungstopologie klar ist. |
| [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader) | `false` | Clients oder Proxies benötigen die Sisk‑Request‑ID im `X-Request-Id`‑Response‑Header. | Kombinieren Sie dies mit Logs, die `HttpRequest.RequestId` enthalten. |
| [IdleConnectionTimeout](/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout) | `120` Sekunden | Leerlauf‑Keep‑Alive‑Verbindungen sollten früher oder später geschlossen werden. | Dies wird von der HTTP‑Engine angewendet. |
| [NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings) | `false` | Sie erhalten Header mit einer Kodierungsinkongruenz. | Dies verursacht Verarbeitungsaufwand; deaktivieren Sie es nur bei Bedarf. |
| [SendSiskHeader](/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader) | `true` | Sie möchten den `X-Powered-By`‑Sisk‑Header verbergen oder anzeigen. | Deaktivieren Sie ihn für strengere Produktions‑Header‑Richtlinien. |
| [OptionsLogMode](/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode) | `LogOutput.Both` | Sie möchten die durch automatische `OPTIONS`‑Verarbeitung erzeugten Logs reduzieren oder umleiten. | Verwendet dieselben Log‑Modus‑Werte wie Routen. |
| [AsyncRequestProcessing](/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing) | `true` | Sie benötigen deterministische Einzel‑Request‑Verarbeitung für Diagnosen. | Das Deaktivieren reduziert den Durchsatz. |
| [DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) | `true` | Werte im Request‑Bag, die `IDisposable` implementieren, sollten automatisch entsorgt werden. | Aktiviert lassen, es sei denn, die Besitzverwaltung erfolgt anderswo. |
| [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) | `true` | Wert‑Handler sollten asynchrone Enumerables als blockierende Enumerables erhalten. | Deaktivieren, wenn Sie eigene Async‑Stream‑Verarbeitung implementieren. |
| [KeepAlive](/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive) | `true` | Verbindungen sollten nach Antworten wiederverwendbar bleiben. | Deaktivieren für Clients oder Zwischensysteme, die persistente Verbindungen schlecht handhaben. |
| [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash) | `false` | GET‑Routen sollten zu einer URL mit abschließendem Slash umleiten. | Gilt nur für nicht‑regex‑basierte Routen. |
| [MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) | `0` | Anfragetexte benötigen ein Größenlimit. | `0` bedeutet unbegrenzt, bis Framework‑ oder Speichergrenzen erreicht sind. |
| [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) | `false` | Antworten sollten automatisch komprimiert werden, wenn der Client dies unterstützt. | Bereits komprimierte `CompressedContent`‑Antworten werden nicht erneut komprimiert. |

Als Nächstes können wir unseren HTTP‑Server erstellen:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Startet den Server
Console.ReadKey(); // Verhindert, dass die Anwendung beendet wird
```

Jetzt können wir die ausführbare Datei kompilieren und unseren HTTP‑Server mit dem Befehl starten:

```bash
dotnet watch
```

Zur Laufzeit öffnen Sie Ihren Browser und navigieren zur Server‑URL; Sie sollten Folgendes sehen:

<img src="/assets/img/localhost.png" >