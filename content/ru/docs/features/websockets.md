---
title: "Веб-сокеты"
linkTitle: "Web-сокеты"
weight: 30
aliases:
  - "/docs/ru/features/websockets.html"
sourceHash: "cef36acaab7b825b"
---

Sisk также поддерживает веб‑сокеты, позволяя получать и отправлять сообщения клиенту.

Эта функция работает во всех основных браузерах, но в Sisk она всё ещё экспериментальная. Пожалуйста, если вы обнаружите ошибки, сообщите о них на GitHub.

## Приём сообщений

Сообщения WebSocket получаются в порядке их отправки и ставятся в очередь до обработки методом `ReceiveMessageAsync`. Этот метод не возвращает сообщение, если истек тайм‑аут, операция была отменена или клиент отключился.

Одновременно может выполняться только одна операция чтения или записи, поэтому, пока вы ждёте сообщение с помощью `ReceiveMessageAsync`, запись клиенту невозможна.

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

## Постоянное соединение

Пример ниже показывает, как использовать постоянное соединение WebSocket: получать сообщения, обрабатывать их и завершать работу с сокетом.

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

## Политика ping

Подобно политике ping в Server Side Events, вы также можете настроить политику ping, чтобы поддерживать TCP‑соединение открытым при отсутствии активности в нём.

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```

## Управляемые соединения

При принятии WebSocket вы можете указать идентификатор. Идентифицированные сокеты регистрируются в [HttpServer.WebSockets](/api/Sisk.Core.Http.HttpServer.WebSockets), что позволяет серверу находить активные соединения вне маршрута, принявшего их.

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

Из другой части приложения можно запросить коллекцию по идентификатору или предикату:

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

Каждый `HttpWebSocket` предоставляет свойства `Identifier`, `State`, `IsClosed` и `PingPolicy`. Коллекция также предоставляет методы `All()`, `Find(...)`, `GetByIdentifier(...)`, `ActiveConnections` и `DropAll()` для стратегий управляемых сервером соединений.
