# Server Sent Events

Sisk unterstützt das Senden von Nachrichten durch Server Sent Events direkt. Sie können verwerfbare und beständige Verbindungen erstellen, die Verbindungen während der Laufzeit abrufen und diese verwenden.

Diese Funktion hat einige durch Browser auferlegte Einschränkungen, wie z.B. das Senden nur von Textnachrichten und die Unfähigkeit, eine Verbindung dauerhaft zu schließen. Eine serverseitig geschlossene Verbindung wird dazu führen, dass der Client alle 5 Sekunden (bei einigen Browsern alle 3 Sekunden) versucht, erneut zu verbinden.

Diese Verbindungen sind nützlich für das Senden von Ereignissen vom Server an den Client, ohne dass der Client die Informationen jedes Mal anfordern muss.

## Erstellen einer SSE-Verbindung

Eine SSE-Verbindung funktioniert wie eine reguläre HTTP-Anfrage, aber anstelle einer Antwort zu senden und die Verbindung sofort zu schließen, bleibt die Verbindung geöffnet, um Nachrichten zu senden.

Durch den Aufruf der [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource)-Methode wird die Anfrage in einen Wartezustand versetzt, während die SSE-Instanz erstellt wird.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();

    sse.Send("Hallo, Welt!");

    return sse.Close();
});
```

Im obigen Code erstellen wir eine SSE-Verbindung und senden eine "Hallo, Welt"-Nachricht, dann schließen wir die SSE-Verbindung vom Server aus.

> [!NOTE]
> Wenn eine serverseitige Verbindung geschlossen wird, wird der Client standardmäßig versuchen, erneut zu verbinden, und die Verbindung wird neu gestartet, indem die Methode erneut ausgeführt wird, für immer.
>
> Es ist üblich, eine Beendigungsnachricht vom Server zu senden, wenn die Verbindung vom Server aus geschlossen wird, um zu verhindern, dass der Client erneut versucht, eine Verbindung herzustellen.

## Anfügen von Headern

Wenn Sie Header senden müssen, können Sie die [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader)-Methode verwenden, bevor Sie Nachrichten senden.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();
    sse.AppendHeader("Header-Schlüssel", "Header-Wert");

    sse.Send("Hallo!");

    return sse.Close();
});
```

Beachten Sie, dass es notwendig ist, die Header vor dem Senden von Nachrichten zu senden.

## Wait-For-Fail-Verbindungen

Verbindungen werden normalerweise beendet, wenn der Server nicht mehr in der Lage ist, Nachrichten zu senden, aufgrund einer möglichen Client-seitigen Trennung. Mit diesem Verfahren wird die Verbindung automatisch beendet und die Instanz der Klasse wird verworfen.

Auch bei einer erneuten Verbindung wird die Instanz der Klasse nicht funktionieren, da sie mit der vorherigen Verbindung verknüpft ist. In einigen Situationen müssen Sie diese Verbindung möglicherweise später verwenden und möchten sie nicht über die Rückrufmethode der Route verwalten.

Dazu können wir die SSE-Verbindungen mit einem Identifikator kennzeichnen und sie später mithilfe dessen abrufen, auch außerhalb der Rückrufmethode der Route. Zusätzlich markieren wir die Verbindung mit [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail), um die Route nicht zu beenden und die Verbindung automatisch zu beenden.

Eine SSE-Verbindung in KeepAlive wartet auf einen Sendeerror (verursacht durch eine Trennung) zum Wiederaufnehmen der Methodenausführung. Es ist auch möglich, eine Zeitüberschreitung für diese festzulegen. Nach Ablauf der Zeit wird die Verbindung beendet, wenn keine Nachricht gesendet wurde, und die Ausführung wird wiederaufgenommen.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 15 Sekunden warten, ohne dass eine Nachricht gesendet wird, bevor die Verbindung beendet wird

    return sse.Close();
});
```

Die obige Methode erstellt die Verbindung, behandelt sie und wartet auf eine Trennung oder einen Fehler.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // die Verbindung ist noch aktiv
    evs.Send("Hallo nochmal!");
}
```

Und der obige Codeabschnitt versucht, die neu erstellte Verbindung zu finden, und wenn sie existiert, sendet er eine Nachricht an sie.

Alle aktiven Serververbindungen, die identifiziert werden, sind in der Sammlung [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) verfügbar. Diese Sammlung speichert nur aktive und identifizierte Verbindungen. Geschlossene Verbindungen werden aus der Sammlung entfernt.

> [!NOTE]
> Es ist wichtig zu beachten, dass KeepAlive eine durch Komponenten, die möglicherweise mit Sisk in einer nicht kontrollierbaren Weise verbunden sind, wie z.B. einem Web-Proxy, einem HTTP-Kernel oder einem Netzwerktreiber, festgelegte Grenze hat, und diese Komponenten inaktive Verbindungen nach einer bestimmten Zeit schließen.
>
> Es ist daher wichtig, die Verbindung durch das Senden periodischer Pings oder durch Verlängern der maximalen Zeit, bevor die Verbindung geschlossen wird, offen zu halten. Lesen Sie den nächsten Abschnitt, um besser zu verstehen, wie periodische Pings gesendet werden.

## Einrichten der Verbindungs-Ping-Richtlinie

Die Ping-Richtlinie ist eine automatisierte Möglichkeit, periodische Nachrichten an Ihren Client zu senden. Diese Funktion ermöglicht es dem Server, zu verstehen, wenn der Client die Verbindung getrennt hat, ohne dass die Verbindung unendlich lange geöffnet bleiben muss.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    var sse = request.GetEventSource();
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-Nachricht";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });

    sse.KeepAlive();
    return sse.Close();
}
```

Im obigen Code wird alle 5 Sekunden eine neue Ping-Nachricht an den Client gesendet. Dies hält die TCP-Verbindung aktiv und verhindert, dass sie aufgrund von Inaktivität geschlossen wird. Wenn auch eine Nachricht nicht gesendet werden kann, wird die Verbindung automatisch geschlossen und die durch die Verbindung verwendeten Ressourcen werden freigegeben.

## Abfragen von Verbindungen

Sie können nach aktiven Verbindungen suchen, indem Sie einen Prädikaten auf den Verbindungsidentifikator anwenden, um beispielsweise eine Rundsendung durchzuführen.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Rundsenden an alle Ereignisquellen, die mit 'my-connection-' beginnen");
}
```

Sie können auch die [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All)-Methode verwenden, um alle aktiven SSE-Verbindungen abzurufen.