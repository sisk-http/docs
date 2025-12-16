# Manuel (erweitert) Einrichten

In diesem Abschnitt erstellen wir unseren HTTP-Server ohne vordefinierte Standards, auf eine völlig abstrakte Weise. Hier können Sie Ihren HTTP-Server manuell aufbauen. Jeder ListeningHost hat einen Router und ein HTTP-Server kann mehrere ListeningHosts haben, die jeweils auf einen anderen Host auf einem anderen Port verweisen.

Zunächst müssen wir das Konzept von Anfrage/Antwort verstehen. Es ist ziemlich einfach: für jede Anfrage muss es eine Antwort geben. Sisk folgt diesem Prinzip auch. Lassen Sie uns eine Methode erstellen, die mit einer "Hallo, Welt!"-Nachricht in HTML antwortet, wobei der Statuscode und die Header angegeben werden.

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
                    <h1>Hallo, Welt!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

Der nächste Schritt ist, diese Methode mit einer HTTP-Route zu verknüpfen.

## Router

Router sind Abstraktionen von Anfrage-Routen und dienen als Brücke zwischen Anfragen und Antworten für den Dienst. Router verwalten Dienstrouten, Funktionen und Fehler.

Ein Router kann mehrere Routen haben und jede Route kann unterschiedliche Operationen auf diesem Pfad ausführen, wie z.B. die Ausführung einer Funktion, das Bereitstellen einer Seite oder das Bereitstellen einer Ressource vom Server.

Lassen Sie uns unseren ersten Router erstellen und unsere `IndexPage`-Methode mit dem Index-Pfad verknüpfen.

```csharp
Router mainRouter = new Router();

// SetRoute wird alle Index-Routen mit unserer Methode verknüpfen.
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

Jetzt kann unser Router Anfragen empfangen und Antworten senden. Allerdings ist `mainRouter` nicht an einen Host oder einen Server gebunden, daher funktioniert er nicht selbstständig. Der nächste Schritt ist, unseren ListeningHost zu erstellen.

## Listening Hosts und Ports

Ein [ListeningHost](/api/Sisk.Core.Http.ListeningHost) kann einen Router und mehrere Listening-Ports für denselben Router hosten. Ein [ListeningPort](/api/Sisk.Core.Http.ListeningPort) ist ein Präfix, an dem der HTTP-Server lauscht.

Hier können wir einen `ListeningHost` erstellen, der auf zwei Endpunkte für unseren Router verweist:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Jetzt wird unser HTTP-Server auf den angegebenen Endpunkten lauschen und seine Anfragen an unseren Router weiterleiten.

## Server-Konfiguration

Die Server-Konfiguration ist für das meiste Verhalten des HTTP-Servers selbst verantwortlich. In dieser Konfiguration können wir `ListeningHosts` mit unserem Server verknüpfen.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Fügen Sie unseren ListeningHost zu dieser Server-Konfiguration hinzu
```

Als Nächstes können wir unseren HTTP-Server erstellen:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Startet den Server
Console.ReadKey(); // Verhindert, dass die Anwendung beendet wird
```

Jetzt können wir unsere ausführbare Datei kompilieren und unseren HTTP-Server mit dem Befehl starten:

```bash
dotnet watch
```

Bei der Laufzeit öffnen Sie Ihren Browser und navigieren zum Server-Pfad, und Sie sollten sehen:

<img src="/assets/img/localhost.png" >