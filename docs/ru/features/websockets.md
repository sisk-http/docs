# Web Sockets

Sisk поддерживает веб‑сокеты, например, получение и отправка сообщений клиенту.

Эта функция работает корректно во многих браузерах, но в Sisk она всё ещё экспериментальная. Если вы обнаружите ошибки, сообщите о них на GitHub.

## Приём сообщений асинхронно

Сообщения WebSocket принимаются в порядке, ставятся в очередь до обработки `ReceiveMessageAsync`. Этот метод не возвращает сообщение, если истёк таймаут, операция отменена или клиент отключён.

Одновременно может выполняться только одна операция чтения и записи, поэтому, пока вы ждёте сообщение через `ReceiveMessageAsync`, писать в подключённого клиента невозможно.

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

## Приём сообщений синхронно

Ниже приведён пример использования синхронного веб‑сокета без асинхронного контекста, где вы получаете сообщения, обрабатываете их и завершаете работу с сокетом.

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

## Политика Ping

Подобно тому, как работает политика ping в Server Side Events, вы также можете настроить политику ping, чтобы держать TCP‑соединение открытым при отсутствии активности.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
