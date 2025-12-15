# Web Sockets

Sisk supports web sockets as well, such as receiving and sending messages to their client.

This feature works fine in most browsers, but in Sisk it is still experimental. Please, if you find any bugs, report it on github.

## Accepting messages

WebSocket messages are received in order, queued until processed by `ReceiveMessageAsync`. This method returns no message when the timeout is reached, when the operation is canceled, or when the client is disconnected.

Only one read and write operation can occur simultaneously, therefore, while you are waiting for a message with `ReceiveMessageAsync`, it is not possible to write to the connected client.

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

## Persistent connection

The example below contains a way for you to use a persistent websocket connection, where you receive the messages, deal with them, and finish using the socket.

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

## Ping Policy

Similar to how ping policy in Server Side Events works, you can also configure a ping policy to keep the TCP connection open if there is inactivity in it.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```