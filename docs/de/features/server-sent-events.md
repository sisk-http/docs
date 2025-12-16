# Server Sent Events

Sisk unterstützt das Senden von Nachrichten über Server Sent Events direkt. Sie können verwerfbare und beständige Verbindungen erstellen, die Verbindungen während der Laufzeit abrufen und diese verwenden.

Diese Funktion hat einige durch Browser auferlegte Einschränkungen, wie z. B. das Senden nur von Textnachrichten und die Unfähigkeit, eine Verbindung dauerhaft zu schließen. Eine serverseitig geschlossene Verbindung wird dazu führen, dass der Client alle 5 Sekunden (bei einigen Browsern alle 3 Sekunden) versucht, erneut zu verbinden.

Diese Verbindungen sind nützlich für das Senden von Ereignissen vom Server an den Client, ohne dass der Client die Informationen jedes Mal anfordern muss.

## Erstellen einer SSE-Verbindung

Eine SSE-Verbindung funktioniert wie eine reguläre HTTP-Anfrage, aber anstelle des Sendens einer Antwort und des sofortigen Schließens der Verbindung, wird die Verbindung geöffnet, um Nachrichten zu senden.

Durch den Aufruf der [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource)-Methode wird die Anfrage in einen Wartezustand versetzt, während die SSE-Instanz erstellt wird.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();

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
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Schlüssel", "Header-Wert");

    sse.Send("Hallo!");

    return sse.Close();
});
```

Es ist notwendig, die Header vor dem Senden von Nachrichten zu senden.

## Wait-For-Fail-Verbindungen

Verbindungen werden normalerweise beendet, wenn der Server nicht mehr in der Lage ist, Nachrichten zu senden, aufgrund einer möglichen Client-seitigen Trennung. Durch diese Trennung wird die Verbindung automatisch beendet und die Instanz der Klasse wird verworfen.

Sogar bei einer erneuten Verbindung wird die Instanz der Klasse nicht funktionieren, da sie mit der vorherigen Verbindung verknüpft ist. In einigen Situationen können Sie diese Verbindung später benötigen und möchten sie nicht über die Rückrufmethode der Route verwalten.

Dafür können wir die SSE-Verbindungen mit einem Identifikator kennzeichnen und sie später mithilfe dieses Identifikators abrufen, auch außerhalb der Rückrufmethode der Route. Zusätzlich markieren wir die Verbindung mit [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail), um die Route nicht zu beenden und die Verbindung automatisch zu beenden.

Eine SSE-Verbindung in KeepAlive wird warten, bis ein Sendeerror (verursacht durch eine Trennung) auftritt, um die Methode erneut auszuführen. Es ist auch möglich, eine Zeitüberschreitung für diese zu setzen. Nach Ablauf der Zeit wird die Verbindung beendet, wenn keine Nachricht gesendet wurde, und die Ausführung wird fortgesetzt.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource("meine-Verbindungs-Id");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // warte 15 Sekunden ohne Nachricht, bevor die Verbindung beendet wird

    return sse.Close();
});
```

Die obige Methode wird die Verbindung erstellen, verwalten und auf eine Trennung oder einen Fehler warten.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("meine-Verbindungs-Id");
if (evs != null)
{
    // die Verbindung ist noch aktiv
    evs.Send("Hallo nochmal!");
}
```

Und der obige Codeabschnitt wird versuchen, die neu erstellte Verbindung zu finden, und wenn sie existiert, wird er eine Nachricht an sie senden.

Alle aktiven Serververbindungen, die identifiziert werden, sind in der Sammlung [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) verfügbar. Diese Sammlung speichert nur aktive und identifizierte Verbindungen. Geschlossene Verbindungen werden aus der Sammlung entfernt.

> [!NOTE]
> Es ist wichtig zu beachten, dass KeepAlive eine durch Komponenten, die möglicherweise auf unkontrollierbare Weise mit Sisk verbunden sind, wie z. B. ein Web-Proxy, ein HTTP-Kernel oder ein Netzwerktreiber, festgelegte Grenze hat, und diese Komponenten inaktive Verbindungen nach einer bestimmten Zeit schließen.
>
> Es ist daher wichtig, die Verbindung durch das Senden periodischer Pings oder durch Verlängern der maximalen Zeit, bevor die Verbindung geschlossen wird, offen zu halten. Lesen Sie den nächsten Abschnitt, um besser zu verstehen, wie periodische Pings gesendet werden.

## Einrichten der Verbindungs-Ping-Richtlinie

Die Ping-Richtlinie ist eine automatisierte Möglichkeit, periodische Nachrichten an Ihren Client zu senden. Diese Funktion ermöglicht es dem Server, zu verstehen, wenn der Client von dieser Verbindung getrennt wurde, ohne dass die Verbindung unendlich lange geöffnet bleiben muss.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    using var sse = request.GetEventSource();
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

Im obigen Code wird alle 5 Sekunden eine neue Ping-Nachricht an den Client gesendet. Dies hält die TCP-Verbindung aktiv und verhindert, dass sie aufgrund von Inaktivität geschlossen wird. Wenn auch eine Nachricht nicht gesendet werden kann, wird die Verbindung automatisch geschlossen, und die durch die Verbindung verwendeten Ressourcen werden freigegeben.

## Abfragen von Verbindungen

Sie können nach aktiven Verbindungen suchen, indem Sie einen Prädikaten auf den Verbindungs-Identifikator anwenden, um beispielsweise eine Rundsendung durchzuführen.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("meine-Verbindungs-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Rundsenden an alle Ereignisquellen, die mit 'meine-Verbindungs-' beginnen");
}
```

Sie können auch die [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All)-Methode verwenden, um alle aktiven SSE-Verbindungen abzurufen.