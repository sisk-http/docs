# Веб-сокеты

Sisk поддерживает веб-сокеты, такие как получение и отправка сообщений клиенту.

Эта функция работает хорошо в большинстве браузеров, но в Sisk она еще экспериментальная. Пожалуйста, если вы найдете какие-либо ошибки, сообщите об этом на github.

## Принятие сообщений

Сообщения веб-сокетов получаются в порядке, помещаются в очередь до тех пор, пока они не будут обработаны методом `ReceiveMessageAsync`. Этот метод не возвращает сообщение, когда истекает время ожидания, когда операция отменяется или когда клиент отключается.

Только одна операция чтения и записи может происходить одновременно, поэтому, пока вы ждете сообщения с помощью `ReceiveMessageAsync`, невозможно записать в подключенный клиент.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Получено сообщение: " + msgText);

        await ws.SendAsync("Привет!");
    }

    return await ws.CloseAsync();
});
```

## Постоянное соединение

Пример ниже содержит способ использования постоянного соединения веб-сокета, где вы получаете сообщения, обрабатываете их и завершаете использование сокета.

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("Как вас зовут?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Пожалуйста, введите ваше имя!");
        goto askName;
    }

askAge:
    await ws.SendAsync("А ваш возраст?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Пожалуйста, введите действительное число");
        goto askAge;
    }

    await ws.SendAsync($"Вы {name}, и вам {age} лет.");

    return await ws.CloseAsync();
});
```

## Политика пинга

Аналогично тому, как работает политика пинга в Server Side Events, вы также можете настроить политику пинга, чтобы поддерживать TCP-соединение открытым, если в нем нет активности.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```