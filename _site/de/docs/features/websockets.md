# WebSockets

Source: https://docs.sisk-framework.org/de/docs/features/websockets.html

Sisk unterstützt ebenfalls WebSockets, zum Beispiel das Empfangen und Senden von Nachrichten an den Client.

Diese Funktion funktioniert in den meisten Browsern einwandfrei, ist aber in Sisk noch experimentell. Bitte melden Sie etwaige Fehler auf GitHub.

## Empfangen von Nachrichten

WebSocket-Nachrichten werden in Reihenfolge empfangen und bis zur Verarbeitung durch `ReceiveMessageAsync` in einer Warteschlange gehalten. Diese Methode liefert keine Nachricht, wenn das Zeitlimit erreicht wird, die Operation abgebrochen wird oder der Client die Verbindung trennt.

Nur ein Lese- und Schreibvorgang kann gleichzeitig stattfinden, daher ist es nicht möglich, während des Wartens auf eine Nachricht mit `ReceiveMessageAsync` an den verbundenen Client zu schreiben.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Received message: " + msgText);

        await ws.SendAsync("Hello!");
    }

    return await ws.CloseAsync();
});
```

## Persistente Verbindung

Das nachstehende Beispiel zeigt, wie Sie eine persistente WebSocket-Verbindung nutzen können, bei der Sie die Nachrichten empfangen, verarbeiten und die Verbindung anschließend schließen.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("What is your name?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Please, insert your name!");
        goto askName;
    }

askAge:
    await ws.SendAsync("And your age?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Please, insert an valid number");
        goto askAge;
    }

    await ws.SendAsync($"You're {name}, and you are {age} old.");

    return await ws.CloseAsync();
});
```

## Ping-Richtlinie

Ähnlich wie die Ping-Richtlinie bei Server‑Sent‑Events können Sie auch eine Ping‑Richtlinie konfigurieren, um die TCP‑Verbindung bei Inaktivität offen zu halten.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```

## Verwaltete Verbindungen

Beim Akzeptieren eines WebSockets können Sie einen Bezeichner angeben. Identifizierte Sockets werden in [HttpServer.WebSockets](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WebSockets.md) registriert, wodurch der Server aktive Verbindungen außerhalb der Route, die sie akzeptiert hat, finden kann.

```cs
router.MapGet("/connect/<userId>", async (HttpRequest req) =>
{
    string userId = req.RouteParameters["userId"].GetString();

    using var ws = await req.GetWebSocketAsync(identifier: $"user:{userId}");
    ws.State = userId;

    ws.PingPolicy.Start(
        dataMessage: "ping",
        interval: TimeSpan.FromSeconds(10));

    while (await ws.ReceiveMessageAsync(TimeSpan.FromMinutes(5)) is { } message)
    {
        await ws.SendAsync("Received: " + message.GetString());
    }

    return await ws.CloseAsync();
});
```

Aus einem anderen Teil der Anwendung können Sie die Sammlung nach Bezeichner oder Prädikat abfragen:

```cs
HttpWebSocket? socket = server.WebSockets.GetByIdentifier("user:42");
if (socket is { IsClosed: false })
{
    await socket.SendAsync("Your report is ready.");
}

foreach (HttpWebSocket activeSocket in server.WebSockets.Find(id => id.StartsWith("user:")))
{
    await activeSocket.SendAsync("Broadcast message");
}
```

Jeder `HttpWebSocket` stellt `Identifier`, `State`, `IsClosed` und `PingPolicy` bereit. Die Sammlung bietet außerdem `All()`, `Find(...)`, `GetByIdentifier(...)`, `ActiveConnections` und `DropAll()` für serververwaltete Verbindungsstrategien.
