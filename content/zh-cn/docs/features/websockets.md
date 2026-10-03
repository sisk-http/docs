---
title: "Web 套接字"
linkTitle: "Web套接字"
weight: 30
aliases:
  - "/docs/cn/features/websockets.html"
sourceHash: "cef36acaab7b825b"
---

Sisk 也支持 Web 套接字，例如接收和发送消息给客户端。

此功能在大多数浏览器中运行良好，但在 Sisk 中仍属实验性。若您发现任何错误，请在 GitHub 上报告。

## 接收消息

WebSocket 消息按顺序接收，排队等待 `ReceiveMessageAsync` 处理。超时、操作被取消或客户端断开时，此方法不返回消息。

一次只能进行一次读或写操作，因此在使用 `ReceiveMessageAsync` 等待消息时，无法向已连接的客户端写入数据。

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

## 持久连接

下面的示例展示了如何使用持久的 WebSocket 连接，接收消息、处理它们，并在完成后关闭套接字。

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

## Ping 策略

类似于 Server Side Events 中的 ping 策略，您也可以配置 ping 策略，以在连接空闲时保持 TCP 连接打开。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```

## 托管连接

接受 WebSocket 时，您可以提供标识符。已标识的套接字会注册到 [HttpServer.WebSockets](/api/Sisk.Core.Http.HttpServer.WebSockets)，从而使服务器能够在接受它们的路由之外查找活动连接。

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

在应用程序的其他部分，可通过标识符或谓词查询该集合：

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

每个 `HttpWebSocket` 都公开 `Identifier`、`State`、`IsClosed` 和 `PingPolicy`。该集合还提供 `All()`、`Find(...)`、`GetByIdentifier(...)`、`ActiveConnections` 和 `DropAll()`，用于服务器托管的连接策略。
