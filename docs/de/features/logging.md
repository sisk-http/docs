# Protokollierung

Sie können Sisk so konfigurieren, dass es automatisch Zugriffs- und Fehlerprotokolle schreibt. Es ist möglich, Protokollrotation, Erweiterungen und Häufigkeit zu definieren.

Die [LogStream](/api/Sisk.Core.Http.LogStream)-Klasse bietet eine asynchrone Möglichkeit, Protokolle zu schreiben und sie in einer wartbaren Warteschlange zu halten. Die `LogStream`-Klasse implementiert `IAsyncDisposable`, um sicherzustellen, dass alle ausstehenden Protokolle geschrieben werden, bevor der Stream geschlossen wird.

In diesem Artikel zeigen wir Ihnen, wie Sie die Protokollierung für Ihre Anwendung konfigurieren.

## Dateibasierte Zugriffsprotokolle

Protokolle in Dateien öffnen die Datei, schreiben den Text der Zeile und schließen die Datei für jede geschriebene Zeile. Dieses Verfahren wurde beibehalten, um die Schreibreaktion in den Protokollen aufrechtzuerhalten.

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

Der obige Code schreibt alle eingehenden Anfragen in die Datei `logs/access.log`. Beachten Sie, dass die Datei automatisch erstellt wird, wenn sie nicht existiert, jedoch nicht das Verzeichnis davor. Es ist nicht notwendig, das Verzeichnis `logs/` zu erstellen, da die `LogStream`-Klasse es automatisch erstellt.

## Stream-basierte Protokollierung

Sie können Protokolldateien an `TextWriter`-Objekte wie `Console.Out` schreiben, indem Sie ein `TextWriter`-Objekt im Konstruktor übergeben:

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

Für jede in der stream-basierten Protokollierung geschriebene Nachricht wird die `TextWriter.Flush()`-Methode aufgerufen.

## Zugriffsprotokollformat

Sie können das Zugriffsprotokollformat durch vordefinierte Variablen anpassen. Betrachten Sie die folgende Zeile:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Sie schreibt eine Nachricht wie:

    29/märz/2023 15:21:47 -0300 Ausgeführt ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Sie können das Protokollformat durch die im folgenden Tabelle beschriebenen Werte anpassen:

| Wert  | Was es darstellt                                                                 | Beispiel                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | Tag des Monats (als zwei Ziffern formatiert)                                        | 05                                    |
| %dmmm  | Vollständiger Name des Monats                                                            | März                                  |
| %dmm   | Abgekürzter Name des Monats (drei Buchstaben)                                  | Mär                                  |
| %dm    | Monat (als zwei Ziffern formatiert)                                          | 03                                    |
| %dy    | Jahr (als vier Ziffern formatiert)                                                 | 2023                                 |
| %th    | Stunde im 12-Stunden-Format                                                          | 03                                    |
| %tH    | Stunde im 24-Stunden-Format (HH)                                                    | 15                                    |
| %ti    | Minuten (als zwei Ziffern formatiert)                                               | 30                                    |
| %ts    | Sekunden (als zwei Ziffern formatiert)                                               | 45                                    |
| %tm    | Millisekunden (als drei Ziffern formatiert)                                        | 123                                   |
| %tz    | Zeitzone (gesamte Stunden in UTC)                                         | +03:00                               |
| %ri    | Client-IP-Adresse                                                                       | 192.168.1.100                        |
| %rm    | HTTP-Methode (in Großbuchstaben)                                                          | GET                                   |
| %rs    | URI-Schema (http/https)                                                          | https                                |
| %ra    | URI-Autorität (Domain)                                                           | example.com                          |
| %rh    | Host der Anfrage                                                             | www.example.com                       |
| %rp    | Port der Anfrage                                                             | 443                                  |
| %rz    | Pfad der Anfrage                                                             | /path/to/resource                    |
| %rq    | Abfragezeichenfolge                                                                    | ?key=value&another=123               |
| %sc    | HTTP-Antwortstatuscode                                                      | 200                                  |
| %sd    | HTTP-Antwortstatusbeschreibung                                              | OK                                   |
| %lin   | Menschlich lesbare Größe der Anfrage                                             | 1,2 KB                               |
| %linr  | Rohgröße der Anfrage (Bytes)                                                | 1234                                |
| %lou   | Menschlich lesbare Größe der Antwort                                            | 2,5 KB                               |
| %lour  | Rohgröße der Antwort (Bytes)                                               | 2560                                |
| %lms   | Verstrichene Zeit in Millisekunden                                                   | 120                                  |
| %ls    | Ausführungsstatus                                                                | Ausgeführt                |
| %{header-name}    | Stellt den `header-name`-Header der Anfrage dar.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:header-name}    | Stellt den `header-name`-Header der Antwort dar. | `application/json` |

Sie können auch `HttpServerConfiguration.DefaultAccessLogFormat` verwenden, um das Standard-Zugriffsprotokollformat zu verwenden.

## Rotierende Protokolle

Sie können den HTTP-Server so konfigurieren, dass er die Protokolldateien in eine komprimierte .gz-Datei umwandelt, wenn sie eine bestimmte Größe erreichen. Die Größe wird regelmäßig durch den von Ihnen definierten Schwellenwert überprüft.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Der obige Code überprüft alle sechs Stunden, ob die Datei des `LogStream` die 64-MB-Grenze erreicht hat. Wenn ja, wird die Datei in eine .gz-Datei komprimiert und die `access.log`-Datei wird gelöscht.

Während dieses Prozesses wird das Schreiben in die Datei gesperrt, bis die Datei komprimiert und gelöscht ist. Alle Zeilen, die in diesem Zeitraum geschrieben werden sollen, werden in einer Warteschlange gespeichert, bis die Komprimierung abgeschlossen ist.

Diese Funktion funktioniert nur mit dateibasierten `LogStream`-Objekten.

## Fehlerprotokollierung

Wenn ein Server keine Fehler an den Debugger weiterleitet, leitet er Fehler an die Protokollierung weiter, wenn Fehler auftreten. Sie können die Fehlerprotokollierung mit konfigurieren:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Diese Eigenschaft schreibt nur dann etwas in das Protokoll, wenn der Fehler nicht durch den Rückruf oder die [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler)-Eigenschaft abgefangen wird.

Der Fehler, der vom Server geschrieben wird, schreibt immer das Datum und die Uhrzeit, die Anfrageheader (nicht den Anfragebody), die Fehlerstapelverfolgung und die innere Ausnahme-Stapelverfolgung, wenn vorhanden.

## Andere Protokollierungsinstanzen

Ihre Anwendung kann null oder mehrere `LogStream`-Objekte haben, es gibt keine Begrenzung für die Anzahl der Protokollkanäle, die sie haben kann. Es ist daher möglich, die Protokolle Ihrer Anwendung in eine andere Datei als die Standard-`AccessLog`- oder `ErrorLog`-Datei umzuleiten.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Anwendung gestartet am {0}", DateTime.Now);
```

## Erweiterung von LogStream

Sie können die `LogStream`-Klasse erweitern, um benutzerdefinierte Formate zu schreiben, die mit dem aktuellen Sisk-Protokollmotor kompatibel sind. Das folgende Beispiel ermöglicht es, farbige Nachrichten in der Konsole über die Spectre.Console-Bibliothek zu schreiben:

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

Eine weitere Möglichkeit, automatisch benutzerdefinierte Protokolle für jede Anfrage/Antwort zu schreiben, besteht darin, einen [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) zu erstellen. Das folgende Beispiel ist ein wenig umfassender. Es schreibt den Body der Anfrage und Antwort in JSON in die Konsole. Es kann für die allgemeine Fehlersuche nützlich sein. Dieses Beispiel verwendet ContextBag und HttpServerHandler.

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

        app.Router += new Route(RouteMethod.Any, "/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hallo, Welt!!"
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
            // dass der Inhalt JSON ist. Die folgende Zeile liest den Inhalt und speichert ihn im Anfrageobjekt.
            //
            // Wenn der Inhalt nicht im Anfragevorgang gelesen wird, wird der Inhalt möglicherweise nach dem Senden der Antwort an den Client
            // durch den Garbage Collector gesammelt, sodass der Inhalt möglicherweise nicht mehr verfügbar ist, nachdem die Antwort geschlossen wurde.
            //
            _ = request.RawBody;

            // Fügen Sie einen Hinweis im Kontext hinzu, um anzugeben, dass diese Anfrage einen JSON-Body enthält
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
            // Reformuliert das JSON mithilfe der CypherPotato.LightJson-Bibliothek
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // Überprüfen, ob die Antwort JSON ist
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // Ruft den internen Server-Verarbeitungsstatus ab
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