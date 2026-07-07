# Protokollierung

Sie können Sisk so konfigurieren, dass Zugriffs- und Fehlermeldungen automatisch geschrieben werden. Es ist möglich, Log‑Rotation, Erweiterungen und Häufigkeit zu definieren.

Die [LogStream](/api/Sisk.Core.Http.LogStream)-Klasse bietet eine asynchrone Methode zum Schreiben von Logs und hält sie in einer await‑fähigen Schreibwarteschlange. Die `LogStream`‑Klasse implementiert `IAsyncDisposable` und stellt sicher, dass alle ausstehenden Logs geschrieben werden, bevor der Stream geschlossen wird.

In diesem Artikel zeigen wir Ihnen, wie Sie die Protokollierung für Ihre Anwendung konfigurieren.

## Dateibasierte Zugriffsprotokolle

Logs zu Dateien öffnen die Datei, schreiben den Zeilentext und schließen die Datei anschließend für jede geschriebene Zeile. Dieses Verfahren wurde übernommen, um die Schreib‑Reaktionsfähigkeit in den Logs zu erhalten.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

Der obige Code schreibt alle eingehenden Anfragen in die Datei `logs/access.log`. Beachten Sie, dass die Datei automatisch erstellt wird, falls sie nicht existiert, das übergeordnete Verzeichnis jedoch nicht. Es ist nicht nötig, das Verzeichnis `logs/` manuell anzulegen, da die LogStream‑Klasse es automatisch erstellt.

## Stream-basierte Protokollierung

Sie können Log‑Dateien in Instanzen von `TextWriter`‑Objekten schreiben, z. B. `Console.Out`, indem Sie ein `TextWriter`‑Objekt im Konstruktor übergeben:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

Für jede im stream‑basierten Log geschriebene Nachricht wird die Methode `TextWriter.Flush()` aufgerufen.

## Formatierung des Zugriffsprotokolls

Sie können das Zugriffsprotokollformat mit vordefinierten Variablen anpassen. Betrachten Sie die folgende Zeile:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Sie wird eine Meldung wie folgt schreiben:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Sie können Ihre Log‑Datei nach dem in der Tabelle beschriebenen Format formatieren:

| Wert               | Was es darstellt                                                            | Beispiel                               |
|--------------------|------------------------------------------------------------------------------|----------------------------------------|
| %dd                | Tag des Monats (zweistellig formatiert)                                      | 05                                     |
| %dmmm              | Vollständiger Name des Monats                                                | July                                   |
| %dmm               | Abgekürzter Name des Monats (drei Buchstaben)                               | Jul                                    |
| %dm                | Monatszahl (zweistellig formatiert)                                         | 07                                     |
| %dy                | Jahr (vierstellig formatiert)                                               | 2023                                   |
| %th                | Stunde im 12‑Stunden‑Format                                                 | 03                                     |
| %tH                | Stunde im 24‑Stunden‑Format (HH)                                            | 15                                     |
| %ti                | Minuten (zweistellig formatiert)                                            | 30                                     |
| %ts                | Sekunden (zweistellig formatiert)                                           | 45                                     |
| %tm                | Millisekunden (dreistellig formatiert)                                      | 123                                    |
| %tz                | Zeitzonenoffset (Gesamtstunden in UTC)                                      | +03:00                                 |
| %ri                | Remote‑IP‑Adresse des Clients                                                | 192.168.1.100                          |
| %rm                | HTTP‑Methode (Großschreibung)                                               | GET                                    |
| %rs                | URI‑Schema (http/https)                                                     | https                                  |
| %ra                | URI‑Authority (Domain)                                                      | example.com                            |
| %rh                | Host der Anfrage                                                             | www.example.com                        |
| %rp                | Port der Anfrage                                                             | 443                                    |
| %rz                | Pfad der Anfrage                                                             | /path/to/resource                      |
| %rq                | Abfragezeichenfolge                                                          | ?key=value&another=123                 |
| %sc                | HTTP‑Antwortstatuscode                                                       | 200                                    |
| %sd                | Beschreibung des HTTP‑Antwortstatus                                          | OK                                     |
| %lin               | Menschlich lesbare Größe der Anfrage                                         | 1.2 KB                                 |
| %linr              | Rohgröße der Anfrage (Bytes)                                                | 1234                                   |
| %lou               | Menschlich lesbare Größe der Antwort                                         | 2.5 KB                                 |
| %lour              | Rohgröße der Antwort (Bytes)                                                | 2560                                   |
| %lms               | Verstrichene Zeit in Millisekunden                                           | 120                                    |
| %ls                | Ausführungsstatus                                                            | Executed                               |
| %{header-name}    | Stellt den Header `header-name` der Anfrage dar.                             | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name}   | Stellt den Header `header-name` der Antwort dar.                             | `application/json`                     |

Sie können außerdem `HttpServerConfiguration.DefaultAccessLogFormat` verwenden, um das Standard‑Zugriffsprotokollformat zu nutzen.

## Rotierende Protokolle

Sie können den HTTP‑Server so konfigurieren, dass Log‑Dateien zu einer komprimierten .gz‑Datei rotiert werden, sobald sie eine bestimmte Größe erreichen. Die Größe wird periodisch anhand der von Ihnen definierten Schwelle geprüft.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Der obige Code prüft alle sechs Stunden, ob die Datei des LogStreams sein 64 MB‑Limit erreicht hat. Falls ja, wird die Datei zu einer .gz‑Datei komprimiert und anschließend `access.log` bereinigt.

Während dieses Vorgangs ist das Schreiben in die Datei gesperrt, bis die Datei komprimiert und bereinigt ist. Alle Zeilen, die in diesem Zeitraum geschrieben werden sollen, befinden sich in einer Warteschlange, die auf das Ende der Kompression wartet.

Diese Funktion arbeitet nur mit dateibasierten LogStreams.

## Fehlerprotokollierung

Wenn ein Server keine Fehler an den Debugger wirft, leitet er die Fehler zum Log‑Schreiben weiter, sofern welche vorhanden sind. Sie können das Fehler‑Schreiben konfigurieren mit:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Diese Eigenschaft schreibt nur dann etwas in das Log, wenn der Fehler nicht vom Callback oder der [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler)-Eigenschaft erfasst wird.

Der vom Server geschriebene Fehler protokolliert stets Datum und Uhrzeit, die Anforderungs‑Header (nicht den Body), den Fehler‑Stacktrace und, falls vorhanden, den Stacktrace der inneren Ausnahme.

## Andere Protokollierungsinstanzen

Ihre Anwendung kann null oder mehrere LogStreams besitzen; es gibt keine Begrenzung, wie viele Log‑Kanäle sie haben kann. Daher ist es möglich, das Log Ihrer Anwendung in eine andere Datei als das Standard‑AccessLog oder ErrorLog zu leiten.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Erweiterung von LogStream

Sie können die `LogStream`‑Klasse erweitern, um benutzerdefinierte Formate zu schreiben, die mit der aktuellen Sisk‑Log‑Engine kompatibel sind. Das nachstehende Beispiel ermöglicht das Schreiben farbiger Meldungen in die Konsole über die Spectre.Console‑Bibliothek:

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

Eine weitere Möglichkeit, automatisch benutzerdefinierte Logs für jede Anfrage/Antwort zu schreiben, besteht darin, einen [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) zu erstellen. Das nachstehende Beispiel ist etwas umfangreicher. Es schreibt den Body von Anfrage und Antwort als JSON in die Konsole. Es kann allgemein beim Debuggen von Anfragen nützlich sein. Dieses Beispiel nutzt ContextBag und HttpServerHandler.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // Zu diesem Zeitpunkt ist die Verbindung geöffnet und der Client hat den Header gesendet, der angibt,
            // dass der Inhalt JSON ist. Die nachfolgende Zeile liest den Inhalt und lässt ihn in der Anfrage gespeichert.
            //
            // Wenn der Inhalt nicht in der Anforderungsaktion gelesen wird, kann die GC den Inhalt wahrscheinlich sammeln,
            // nachdem die Antwort an den Client gesendet wurde, sodass der Inhalt nach dem Schließen der Antwort nicht mehr verfügbar ist.
            //
            _ = request.RawBody;

            // Hinweis im Kontext hinzufügen, dass diese Anfrage einen JSON-Body enthält
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // Formatiert das JSON mithilfe der CypherPotato.LightJson-Bibliothek neu
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // prüfen, ob die Antwort JSON ist
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // holt den internen Serververarbeitungsstatus
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```