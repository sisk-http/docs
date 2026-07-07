# Server Sent Events

Sisk unterstützt das Senden von Nachrichten über Server Sent Events von Haus aus. Sie können flüchtige und dauerhafte Verbindungen erstellen, die Verbindungen zur Laufzeit abrufen und verwenden.

Diese Funktion hat einige von Browsern auferlegte Einschränkungen, wie das Senden nur von Textnachrichten und die Unfähigkeit, eine Verbindung dauerhaft zu schließen. Eine serverseitig geschlossene Verbindung führt dazu, dass der Client alle 5 Sekunden (bei manchen Browsern 3 Sekunden) periodisch versucht, die Verbindung wiederherzustellen.

Diese Verbindungen sind nützlich, um Ereignisse vom Server zum Client zu senden, ohne dass der Client die Informationen jedes Mal anfordern muss.

## Erstellen einer SSE-Verbindung

Eine SSE-Verbindung funktioniert wie eine reguläre HTTP-Anfrage, jedoch wird die Verbindung, anstatt nach dem Senden einer Antwort sofort zu schließen, offen gehalten, um Nachrichten zu senden.

Durch Aufrufen der Methode [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) wird die Anfrage in einen Wartezustand versetzt, während die SSE-Instanz erstellt wird.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

Im obigen Code erstellen wir eine SSE-Verbindung und senden eine „Hello, world“-Nachricht, anschließend schließen wir die SSE-Verbindung serverseitig.

> [!NOTE]
> Beim Schließen einer serverseitigen Verbindung versucht der Client standardmäßig, erneut zu verbinden, und die Verbindung wird neu gestartet, wobei die Methode endlos erneut ausgeführt wird.
>
> Es ist üblich, vom Server aus eine Beendigungsnachricht zu senden, sobald die Verbindung vom Server geschlossen wird, um zu verhindern, dass der Client erneut versucht, sich zu verbinden.

## Anhängen von Headern

Falls Sie Header senden müssen, können Sie die Methode [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) verwenden, bevor Sie Nachrichten senden.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

Beachten Sie, dass die Header vor dem Senden von Nachrichten gesendet werden müssen.

## Wait-For-Fail-Verbindungen

Verbindungen werden normalerweise beendet, wenn der Server aufgrund einer möglichen clientseitigen Trennung keine Nachrichten mehr senden kann. In diesem Fall wird die Verbindung automatisch beendet und die Instanz der Klasse verworfen.

Selbst bei einer erneuten Verbindung funktioniert die Instanz der Klasse nicht mehr, da sie mit der vorherigen Verbindung verknüpft ist. In manchen Situationen benötigen Sie diese Verbindung später und möchten sie nicht über die Callback‑Methode der Route verwalten.

Dafür können wir die SSE-Verbindungen mit einem Bezeichner identifizieren und später, auch außerhalb des Callback der Route, abrufen. Zusätzlich markieren wir die Verbindung mit [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail), um die Route nicht zu beenden und die Verbindung automatisch zu schließen.

Eine SSE-Verbindung im `WaitForFail` wartet auf einen Sendefehler, der durch eine Trennung verursacht wurde, oder darauf, dass die konfigurierte Leerlauftoleranz abläuft, bevor die Route fortgesetzt und die Verbindung geschlossen wird.

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // wait for 15 seconds without any message before terminating the connection

    return sse.Close();
});
```

Die obige Methode erstellt die Verbindung, verwaltet sie und wartet auf eine Trennung oder einen Fehler.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // the connection is still alive
    evs.Send("Hello again!");
}
```

Und das obige Snippet versucht, die neu erstellte Verbindung zu finden, und falls sie existiert, wird eine Nachricht an sie gesendet.

Alle aktiven, identifizierten Serververbindungen sind in der Sammlung [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) verfügbar. Diese Sammlung speichert nur aktive und identifizierte Verbindungen. Geschlossene Verbindungen werden aus der Sammlung entfernt.

> [!NOTE]
> Es ist wichtig zu beachten, dass Keep‑Alive ein von Komponenten festgelegtes Limit hat, die in unkontrollierbarer Weise mit Sisk verbunden sein können, wie ein Web‑Proxy, ein HTTP‑Kernel oder ein Netzwerktreiber, und diese schließen Leerlaufverbindungen nach einer bestimmten Zeit.
>
> Daher ist es wichtig, die Verbindung offen zu halten, indem periodische Pings gesendet oder die maximale Zeit bis zum Schließen der Verbindung verlängert wird. Lesen Sie den nächsten Abschnitt, um das Senden periodischer Pings besser zu verstehen.

## Einrichtung der Ping-Policy für Verbindungen

Die Ping-Policy ist ein automatisierter Weg, periodische Nachrichten an Ihren Client zu senden. Diese Funktion ermöglicht es dem Server zu erkennen, wann der Client die Verbindung getrennt hat, ohne die Verbindung unbegrenzt offen halten zu müssen.

```cs
[RouteGet("/sse")]
public async Task<HttpResponse> Events(HttpRequest request)
{
    using var sse = await request.GetEventSourceAsync("user-events");
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    await sse.WaitForFailAsync(TimeSpan.FromMinutes(10));
    return await sse.CloseAsync();
}
```

Im obigen Code wird alle 5 Sekunden eine neue Ping-Nachricht an den Client gesendet. Dadurch bleibt die TCP-Verbindung aktiv und wird nicht wegen Inaktivität geschlossen. Außerdem wird die Verbindung automatisch geschlossen, wenn das Senden einer Nachricht fehlschlägt, wodurch die genutzten Ressourcen freigegeben werden.

Verwenden Sie [SendAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync) und [CloseAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync) in asynchronen Routen. Wenn Sie vor dem Schließen ausstehende Ereignisse verwerfen müssen, rufen Sie [Cancel](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel) auf.

## Abfragen von Verbindungen

Sie können nach aktiven Verbindungen suchen, indem Sie ein Prädikat auf den Verbindungsbezeichner anwenden, um beispielsweise zu broadcasten.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

Sie können auch die Methode [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) verwenden, um alle aktiven SSE-Verbindungen zu erhalten.