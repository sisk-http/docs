# Server Sent Events

Sisk unterstützt das Senden von Nachrichten über Server Sent Events out of the box. Sie können disposible und persistente Verbindungen erstellen, die Verbindungen während der Laufzeit abrufen und verwenden.

Diese Funktion hat einige Einschränkungen, die von Browsern auferlegt werden, wie z.B. das Senden von nur Textnachrichten und das Nicht-Schließen einer Verbindung dauerhaft. Eine serverseitig geschlossene Verbindung wird von einem Client alle 5 Sekunden (3 für einige Browser) versuchen, erneut zu verbinden.

Diese Verbindungen sind nützlich, um Ereignisse vom Server an den Client zu senden, ohne dass der Client die Informationen jedes Mal anfordern muss.

## Erstellen einer SSE-Verbindung

Eine SSE-Verbindung funktioniert wie eine reguläre HTTP-Anfrage, aber anstatt eine Antwort zu senden und die Verbindung sofort zu schließen, wird die Verbindung offen gehalten, um Nachrichten zu senden.

Durch Aufrufen der [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource)-Methode wird die Anfrage in einen Wartezustand versetzt, während die SSE-Instanz erstellt wird.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();

 sse.Send("Hallo, Welt!");

 return sse.Close();
});
```

Im obigen Code erstellen wir eine SSE-Verbindung und senden eine "Hallo, Welt!"-Nachricht, dann schließen wir die SSE-Verbindung von der Serverseite.

> [!NOTE]
> Wenn eine serverseitige Verbindung geschlossen wird, versucht der Client standardmäßig, die Verbindung erneut herzustellen, und die Verbindung wird neu gestartet, die Methode wird erneut ausgeführt, für immer.
>
> Es ist üblich, eine Terminationsnachricht vom Server zu senden, wenn die Verbindung vom Server geschlossen wird, um zu verhindern, dass der Client versucht, erneut zu verbinden.

## Anhängen von Headern

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

Beachten Sie, dass es notwendig ist, die Header zu senden, bevor Sie Nachrichten senden.

## Wait-For-Fail-Verbindungen

Verbindungen werden normalerweise beendet, wenn der Server nicht mehr in der Lage ist, Nachrichten zu senden, aufgrund einer möglichen clientseitigen Trennung. Damit wird die Verbindung automatisch beendet und die Instanz der Klasse verworfen.

Selbst bei einer erneuten Verbindung funktioniert die Instanz der Klasse nicht, da sie an die vorherige Verbindung gekoppelt ist. In einigen Situationen benötigen Sie diese Verbindung später und möchten sie nicht über die Callback-Methode der Route verwalten.

Dafür können wir die SSE-Verbindungen mit einer Kennung identifizieren und sie später mithilfe dieser Kennung abrufen, auch außerhalb des Callbacks der Route. Darüber hinaus markieren wir die Verbindung mit [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail), um die Route nicht zu beenden und die Verbindung automatisch zu beenden.

Eine SSE-Verbindung in KeepAlive wartet auf einen Sendefehler (verursacht durch Trennung), um die Methoden Ausführung fortzusetzen. Es ist auch möglich, ein Timeout für dies festzulegen. Nach Ablauf der Zeit wird die Verbindung beendet, wenn keine Nachricht gesendet wurde, und die Ausführung wird fortgesetzt.

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource("meine-index-verbindung");

 sse.WaitForFail(TimeSpan.FromSeconds(15)); // warten Sie 15 Sekunden ohne Nachrichten, bevor Sie die Verbindung beenden

 return sse.Close();
});
```

Die obige Methode erstellt die Verbindung, behandelt sie und wartet auf eine Trennung oder einen Fehler.

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("meine-index-verbindung");
if (evs != null)
{
 // die Verbindung ist noch aktiv
 evs.Send("Hallo wieder!");
}
```

Und das obige Code-Snippet versucht, die neu erstellte Verbindung zu suchen, und wenn sie existiert, sendet es eine Nachricht an sie.

Alle aktiven Serververbindungen, die identifiziert werden, stehen in der Sammlung [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) zur Verfügung. Diese Sammlung speichert nur aktive und identifizierte Verbindungen. Geschlossene Verbindungen werden aus der Sammlung entfernt.

> [!NOTE]
> Es ist wichtig zu beachten, dass Keep-Alive eine Grenze hat, die von Komponenten festgelegt wird, die möglicherweise auf unkontrollierbare Weise mit Sisk verbunden sind, wie z.B. ein Web-Proxy, ein HTTP-Kernel oder ein Netzwerktreiber, und diese schließen inaktive Verbindungen nach einer bestimmten Zeit.
>
> Daher ist es wichtig, die Verbindung offen zu halten, indem Sie periodische Pings senden oder die maximale Zeit verlängern, bevor die Verbindung geschlossen wird. Lesen Sie den nächsten Abschnitt, um besser zu verstehen, wie periodische Pings gesendet werden.

## Einrichtung von Ping-Richtlinien für Verbindungen

Ping-Richtlinien sind eine automatisierte Möglichkeit, periodische Nachrichten an Ihren Client zu senden. Diese Funktion ermöglicht es dem Server, zu verstehen, wann der Client die Verbindung getrennt hat, ohne die Verbindung auf unbestimmte Zeit offen halten zu müssen.

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
 using var sse = request.GetEventSource();
 sse.WithPing(ping =>
 {
 ping.DataMessage = "Ping-Nachricht";
 ping.Interval = TimeSpan.FromSeconds(5);
 ping.Start();
 });
    
 sse.KeepAlive();
 return sse.Close();
}
```

Im obigen Code wird alle 5 Sekunden eine neue Ping-Nachricht an den Client gesendet. Dies hält die TCP-Verbindung aktiv und verhindert, dass sie aufgrund von Inaktivität geschlossen wird. Wenn eine Nachricht nicht gesendet werden kann, wird die Verbindung automatisch geschlossen, wodurch die von der Verbindung verwendeten Ressourcen freigegeben werden.

## Abfragen von Verbindungen

Sie können aktive Verbindungen mithilfe eines Prädikats für die Verbindungs-ID suchen, um beispielsweise zu broadcasten.

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("meine-verbindung-"));
foreach (HttpRequestEventSource e in evs)
{
 e.Send("Broadcast an alle Ereignisquellen, die mit 'meine-verbindung-' beginnen");
}
```

Sie können auch die [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All)-Methode verwenden, um alle aktiven SSE-Verbindungen zu erhalten.