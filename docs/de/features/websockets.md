# Web Sockets

Sisk unterstützt WebSockets ebenfalls, zum Beispiel das Empfangen und Senden von Nachrichten an den Client.

Diese Funktion arbeitet in den meisten Browsern einwandfrei, in Sisk ist sie jedoch noch experimentell. Bitte melden Sie etwaige Fehler auf GitHub.

## Nachrichten asynchron akzeptieren

WebSocket-Nachrichten werden in Reihenfolge empfangen, bis sie von `ReceiveMessageAsync` verarbeitet werden. Diese Methode liefert keine Nachricht, wenn das Timeout erreicht ist, die Operation abgebrochen wird oder der Client getrennt ist.

Nur eine Lese- und Schreiboperation kann gleichzeitig stattfinden, daher ist es nicht möglich, während des Wartens auf eine Nachricht mit `ReceiveMessageAsync` etwas an den verbundenen Client zu schreiben.

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

## Nachrichten synchron akzeptieren

Das folgende Beispiel zeigt, wie man einen synchronen WebSocket verwendet, ohne einen asynchronen Kontext, wobei man die Nachrichten empfängt, verarbeitet und den Socket anschließend beendet.

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

## Ping-Policy

Ähnlich wie die Ping-Policy bei Server Side Events kann auch hier eine Ping-Policy konfiguriert werden, um die TCP-Verbindung offen zu halten, wenn dort Inaktivität besteht.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
