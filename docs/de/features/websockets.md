# Web-Sockets

Sisk unterstützt auch Web-Sockets, wie das Empfangen und Senden von Nachrichten an ihre Clients.

Diese Funktion funktioniert in den meisten Browsern einwandfrei, in Sisk ist sie jedoch noch experimentell. Bitte melden Sie alle Fehler auf Github.

## Akzeptieren von Nachrichten

WebSocket-Nachrichten werden in der Reihenfolge ihres Eingangs empfangen und bis zur Verarbeitung durch `ReceiveMessageAsync` zwischengespeichert. Diese Methode gibt keine Nachricht zurück, wenn die Zeitüberschreitung erreicht ist, wenn der Vorgang abgebrochen wird oder wenn der Client getrennt wird.

Nur ein Lese- und Schreibvorgang kann gleichzeitig erfolgen, daher ist es nicht möglich, während des Wartens auf eine Nachricht mit `ReceiveMessageAsync` an den verbundenen Client zu schreiben.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Empfangene Nachricht: " + msgText);

        await ws.SendAsync("Hallo!");
    }

    return await ws.CloseAsync();
});
```

## Beständige Verbindung

Das folgende Beispiel enthält eine Möglichkeit, eine beständige WebSocket-Verbindung zu verwenden, bei der Sie die Nachrichten empfangen, bearbeiten und die Verbindung beenden.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("Wie ist Ihr Name?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Bitte geben Sie Ihren Namen ein!");
        goto askName;
    }

askAge:
    await ws.SendAsync("Und Ihr Alter?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Bitte geben Sie eine gültige Zahl ein");
        goto askAge;
    }

    await ws.SendAsync($"Sie sind {name} und {age} Jahre alt.");

    return await ws.CloseAsync();
});
```

## Ping-Richtlinie

Ähnlich wie die Ping-Richtlinie bei Server-Seitigen Ereignissen funktioniert, können Sie auch eine Ping-Richtlinie konfigurieren, um die TCP-Verbindung bei Inaktivität offen zu halten.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-nachricht",
    interval: TimeSpan.FromSeconds(10));
```