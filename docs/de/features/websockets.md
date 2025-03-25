# Web-Sockets

Sisk unterstützt auch Web-Sockets, wie das Empfangen und Senden von Nachrichten an den Client.

Diese Funktion funktioniert in den meisten Browsern einwandfrei, aber in Sisk ist sie noch experimentell. Bitte, wenn Sie Fehler finden, melden Sie diese auf GitHub.

## Asynchrone Annahme und Empfang von Nachrichten

Das folgende Beispiel zeigt, wie WebSockets in der Praxis funktionieren, mit einem Beispiel für die Öffnung einer Verbindung, den Empfang einer Nachricht und die Anzeige in der Konsole.

Alle von WebSocket empfangenen Nachrichten werden in Bytes empfangen, daher müssen Sie diese bei Empfang decodieren.

Standardmäßig werden Nachrichten in Chunks fragmentiert und das letzte Stück wird als letztes Paket der Nachricht gesendet. Sie können die Paketgröße mit der [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)-Flag konfigurieren. Diese Pufferung ist sowohl für das Senden als auch für das Empfangen von Nachrichten gleich.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        ws.OnReceive += (sender, msg) =>
        {
            string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
            Console.WriteLine("Empfangene Nachricht: " + msgText);

            // erhält den HttpWebSocket-Kontext, der die Nachricht empfangen hat
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Antwort!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Synchrone Annahme und Empfang von Nachrichten

Das folgende Beispiel enthält eine Möglichkeit, einen synchronen WebSocket zu verwenden, ohne einen asynchronen Kontext, bei dem Sie Nachrichten empfangen, diese bearbeiten und die Verwendung des Sockets beenden.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("Wie ist Ihr Name?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("Bitte geben Sie Ihren Namen ein!");
            goto askName;
        }

    askAge:
        ws.Send("Und Ihr Alter?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("Bitte geben Sie eine gültige Zahl ein");
            goto askAge;
        }

        ws.Send($"Sie sind {name} und {age} Jahre alt.");

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Senden von Nachrichten

Die Send-Methode hat drei Überladungen, die es ermöglichen, Text, ein Byte-Array oder einen Byte-Span zu senden. Alle werden in Chunks aufgeteilt, wenn die Server-[WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)-Flag größer als die Gesamtpayload-Größe ist.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hallo, Welt");     // wird als UTF-8-Byte-Array codiert
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Warten auf WebSocket-Schließen

Die Methode [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) blockiert den aktuellen Aufrufstack, bis die Verbindung durch den Client oder den Server beendet wird.

Mit dieser Methode wird die Ausführung des Callbacks der Anfrage blockiert, bis der Client oder der Server die Verbindung trennt.

Sie können die Verbindung auch manuell mit der [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close)-Methode schließen. Diese Methode gibt ein leeres [HttpResponse](/api/Sisk.Core.Http.HttpResponse)-Objekt zurück, das nicht an den Client gesendet wird, aber als Rückgabewert aus der Funktion dient, in der die HTTP-Anfrage empfangen wurde.

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // warten auf Client-Verbindungstrennung
        ws.WaitForClose();

        // wartet, bis keine Nachrichten mehr ausgetauscht werden (60 Sekunden)
        // oder bis eine Partei die Verbindung trennt
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ping-Richtlinie

Ähnlich wie die Ping-Richtlinie bei Server-Seitigen Ereignissen funktioniert, können Sie auch eine Ping-Richtlinie konfigurieren, um die TCP-Verbindung offen zu halten, wenn es inaktiv ist.

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-Nachricht";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```