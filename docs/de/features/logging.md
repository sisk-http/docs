# Logging

Sie können Sisk so konfigurieren, dass Zugriffs- und Fehlerprotokolle automatisch geschrieben werden. Es ist möglich, Logrotation, Erweiterungen und Frequenz zu definieren.

Die Klasse [LogStream](/api/Sisk.Core.Http.LogStream) bietet einen asynchronen Weg, Protokolle zu schreiben und sie in einer wartbaren Schreibwarteschlange zu halten.

In diesem Artikel zeigen wir Ihnen, wie Sie das Logging für Ihre Anwendung konfigurieren.

## Dateibasierte Zugriffsprotokolle

Protokolle zu Dateien öffnen die Datei, schreiben die Zeilentext und schließen die Datei anschließend für jede geschriebene Zeile. Dieses Verfahren wurde übernommen, um die Schreibreaktivität in den Protokollen zu erhalten.

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

Der obige Code schreibt alle eingehenden Anfragen in die Datei `logs/access.log`. Beachten Sie, dass die Datei automatisch erstellt wird, wenn sie nicht existiert, jedoch der Ordner davor nicht. Es ist nicht erforderlich, das Verzeichnis `logs/` zu erstellen, da die LogStream-Klasse es automatisch erstellt.

## Stream-basiertes Logging

Sie können Logdateien in TextWriter-Objekte schreiben, wie z. B. `Console.Out`, indem Sie ein TextWriter-Objekt im Konstruktor übergeben:

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

Für jede Nachricht, die im stream-basierten Log geschrieben wird, wird die Methode `TextWriter.Flush()` aufgerufen.

## Formatierung des Zugriffsprotokolls

Sie können das Format des Zugriffsprotokolls mit vordefinierten Variablen anpassen. Betrachten Sie die folgende Zeile:

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

Es schreibt eine Nachricht wie:

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

Sie können Ihre Logdatei nach dem beschriebenen Format formatieren:

| Value  | Was es repräsentiert                                                                 | Beispiel                               |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | Tag des Monats (formatiert als zwei Ziffern)                                        | 05                                    |
| %dmmm  | Vollständiger Name des Monats                                                            | July                                  |
| %dmm   | Abgekürzter Name des Monats (drei Buchstaben)                                  | Jul                                  |
| %dm    | Monatsnummer (formatiert als zwei Ziffern)                                          | 07                                    |
| %dy    | Jahr (formatiert als vier Ziffern)                                                 | 2023                                 |
| %th    | Stunde im 12-Stunden-Format                                                          | 03                                    |
| %tH    | Stunde im 24-Stunden-Format (HH)                                                    | 15                                    |
| %ti    | Minuten (formatiert als zwei Ziffern)                                               | 30                                    |
| %ts    | Sekunden (formatiert als zwei Ziffern)                                               | 45                                    |
| %tm    | Millisekunden (formatiert als drei Ziffern)                                            | 123                                   |
| %tz    | Zeitzonenoffset (Gesamtstunden in UTC)                                         | +03:00                               |
| %ri    | Remote IP-Adresse des Clients                                                       | 192.168.1.100                        |
| %rm    | HTTP-Methode (Großbuchstaben)                                                          | GET                                   |
| %rs    | URI-Schema (http/https)                                                          | https                                |
| %ra    | URI-Authority (Domain)                                                           | example.com                          |
| %rh    | Host der Anfrage                                                             | www.example.com                       |
| %rp    | Port der Anfrage                                                             | 443                                  |
| %rz    | Pfad der Anfrage                                                             | /path/to/resource                    |
| %rq    | Abfragezeichenkette                                                                    | ?key=value&another=123               |
| %sc    | HTTP-Antwortstatuscode                                                      | 200                                  |
| %sd    | HTTP-Antwortstatusbeschreibung                                              | OK                                   |
| %lin   | Menschlich lesbare Größe der Anfrage                                             | 1.2 KB                               |
| %linr  | Rohgröße der Anfrage (Bytes)                                                | 1234                                |
| %lou   | Menschlich lesbare Größe der Antwort                                            | 2.5 KB                               |
| %lour  | Rohgröße der Antwort (Bytes)                                               | 2560                                |
| %lms   | Verstrichene Zeit in Millisekunden                                                   | 120                                  |
| %ls    | Ausführungsstatus                                                                | Executed                |
| %{header-name}    | Repräsentiert den Header `header-name` der Anfrage.                                                                | `Mozilla/5.0 (platform; rv:gecko [...]`                |
| %{:res-name}    | Repräsentiert den Header `res-name` der Antwort. | |

## Rotierende Protokolle

Sie können den HTTP-Server so konfigurieren, dass die Logdateien in eine komprimierte .gz-Datei umgewandelt werden, wenn sie eine bestimmte Größe erreichen. Die Größe wird periodisch anhand des von Ihnen definierten Schwellenwerts überprüft.

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

Der obige Code prüft alle sechs Stunden, ob die Datei des LogStreams sein 64 MB-Limit erreicht hat. Wenn ja, wird die Datei in eine .gz-Datei komprimiert und anschließend wird `access.log` bereinigt.

Während dieses Prozesses ist das Schreiben in die Datei gesperrt, bis die Datei komprimiert und bereinigt ist. Alle Zeilen, die in diesem Zeitraum geschrieben werden sollen, befinden sich in einer Warteschlange, die auf das Ende der Komprimierung wartet.

Diese Funktion funktioniert nur mit dateibasierten LogStreams.

## Fehlerprotokollierung

Wenn ein Server keine Fehler an den Debugger weiterleitet, leitet er die Fehler beim Schreiben von Protokollen weiter, wenn welche vorhanden sind. Sie können das Schreiben von Fehlern mit folgendem Code konfigurieren:

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

Diese Eigenschaft schreibt nur etwas in das Protokoll, wenn der Fehler nicht von der Callback-Funktion oder der Eigenschaft [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) erfasst wird.

Der vom Server geschriebene Fehler enthält immer Datum und Uhrzeit, die Anfrage-Header (nicht den Körper), die Fehlerspur und die Spur der inneren Ausnahme, falls vorhanden.

## Weitere Logging-Instanzen

Ihre Anwendung kann null oder mehrere LogStreams haben, es gibt keine Begrenzung, wie viele Logkanäle sie haben kann. Daher ist es möglich, das Log Ihrer Anwendung auf eine Datei zu leiten, die nicht das Standardzugriffs- oder Fehlerprotokoll ist.

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## Erweiterung von LogStream

Sie können die Klasse `LogStream` erweitern, um benutzerdefinierte Formate zu schreiben, die mit der aktuellen Sisk-Log-Engine kompatibel sind. Das folgende Beispiel ermöglicht das Schreiben farbiger Nachrichten in die Konsole über die Bibliothek Spectre.Console:

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

Eine weitere Möglichkeit, automatisch benutzerdefinierte Protokolle für jede Anfrage/Antwort zu schreiben, besteht darin, einen [HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) zu erstellen. Das folgende Beispiel ist etwas ausführlicher. Es schreibt den Körper der Anfrage und Antwort in JSON in die Konsole. Es kann nützlich sein, Anfragen im Allgemeinen zu debuggen. Dieses Beispiel nutzt ContextBag und HttpServerHandler.

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
            // At this point, the connection is open and the client has sent the header specifying
            // that the content is JSON.The line below reads the content and leaves it stored in the request.
            //
            // If the content is not read in the request action, the GC is likely to collect the content
            // after sending the response to the client, so the content may not be available after the response is closed.
            //
            _ = request.RawBody;

            // add hint in the context to tell that this request has an json body on it
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
            // reformats the JSON using the CypherPotato.LightJson library
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // check if the response is JSON
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // gets the internal server handling status
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