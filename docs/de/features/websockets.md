# Web Sockets

Sisk unterstützt auch Web Sockets, sowohl beim Empfangen als auch beim Senden von Nachrichten an den Client.

Diese Funktion funktioniert in den meisten Browsern einwandfrei, ist aber in Sisk noch experimentell. Bitte melden Sie etwaige Fehler auf GitHub.

## Asynchrones Akzeptieren und Empfangen von Nachrichten

Das folgende Beispiel zeigt, wie WebSocket in der Praxis funktioniert, mit einem Beispiel für das Öffnen einer Verbindung, das Empfangen einer Nachricht und das Anzeigen im Konsolenfenster.

Alle von WebSocket empfangenen Nachrichten werden in Bytes empfangen, daher müssen Sie diese bei Empfang dekodieren.

Standardmäßig werden Nachrichten in Pakete aufgeteilt und das letzte Stück wird als letztes Paket der Nachricht gesendet. Sie können die Paketgröße mit dem [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)-Flag konfigurieren. Diese Pufferung gilt sowohl für das Senden als auch für das Empfangen von Nachrichten.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    
    ws.OnReceive += (sender, msg) =>
    {
        string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
        Console.WriteLine("Nachricht empfangen: " + msgText);

        // erhält den HttpWebSocket-Kontext, der die Nachricht empfangen hat
        HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
        senderWebSocket.Send("Antwort!");
    };

    ws.WaitForClose();
    
    return ws.Close();
});
```

> [!NOTE]
>
> Verwenden Sie keine asynchronen Ereignisse auf diese Weise. Sie können Ausnahmen außerhalb des HTTP-Server-Bereichs auslösen und Ihre Anwendung zum Absturz bringen.

Wenn Sie asynchrone Code-Handler verwenden und mit mehreren Nachrichten gleichzeitig umgehen müssen, können Sie die Nachrichten-Schleife verwenden:

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
    using var ws = await request.GetWebSocketAsync();
    
    WebSocketMessage? message;
    while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
    {
        var messageText = message.GetString();
        Console.WriteLine($"Nachricht empfangen: {messageText}");

        await ws.SendAsync("Hallo vom Server!");
    }

    return ws.Close();
});
```

## Synchrones Akzeptieren und Empfangen von Nachrichten

Das folgende Beispiel enthält eine Möglichkeit, einen synchronen WebSocket zu verwenden, ohne einen asynchronen Kontext, in dem Sie die Nachrichten empfangen, verarbeiten und dann den Socket schließen.

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    WebSocketMessage? msg;
    
    askName:
    ws.Send("Wie heißt du?");
    msg = ws.WaitNext();
        
    string? name = msg?.GetString();

    if (string.IsNullOrEmpty(name))
    {
        ws.Send("Bitte gib deinen Namen ein!");
        goto askName;
    }
    
    askAge:
    ws.Send("Und wie alt bist du?");
    msg = ws.WaitNext();
        
    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        ws.Send("Bitte gib eine gültige Zahl ein");
        goto askAge;
    }
        
    ws.Send($"Du bist {name} und {age} Jahre alt.");
        
    return ws.Close();
});
```

## Senden von Nachrichten

Die Send-Methode hat drei Überlastungen, die es ermöglichen, Text, ein Byte-Array oder einen Byte-Span zu senden. Alle von ihnen werden in Pakete aufgeteilt, wenn die [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)-Flagge des Servers größer ist als die Gesamtgröße der Payload.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hallo, Welt"); // wird als UTF-8-Byte-Array kodiert
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Warten auf WebSocket-Schließung

Die Methode [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) blockiert den aktuellen Aufrufstack, bis die Verbindung entweder vom Client oder vom Server beendet wird.

Dadurch wird die Ausführung des Rückrufs der Anfrage blockiert, bis der Client oder der Server die Verbindung trennt.

Sie können die Verbindung auch manuell mit der [Close()-Methode](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close) schließen. Diese Methode gibt ein leeres [HttpResponse](/api/Sisk.Core.Http.HttpResponse)-Objekt zurück, das nicht an den Client gesendet wird, aber als Rückgabe aus der Funktion fungiert, in der die HTTP-Anfrage empfangen wurde.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // warten Sie, bis der Client die Verbindung schließt
        ws.WaitForClose();

        // warten Sie, bis 60 Sekunden lang keine Nachrichten mehr ausgetauscht werden
        // oder bis eine Partei die Verbindung schließt
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ping-Richtlinie

Ähnlich wie bei der Ping-Richtlinie in Server Side Events können Sie auch eine Ping-Richtlinie konfigurieren, um die TCP-Verbindung offen zu halten, wenn es Inaktivität gibt.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "Ping-Nachricht";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```