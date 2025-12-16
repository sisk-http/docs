# Web Sockets

Sisk 同时支持 web sockets，例如接收和发送消息到客户端。

此功能在大多数浏览器中工作正常，但在 Sisk 中仍然是实验性的。如果您发现任何错误，请在 github 上报告。

## 接收消息

WebSocket 消息按顺序接收，直到由 `ReceiveMessageAsync` 处理。该方法在超时、操作被取消或客户端断开连接时返回无消息。

同时只能进行一个读取和写入操作，因此，当您使用 `ReceiveMessageAsync` 等待消息时，无法写入连接的客户端。

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

下面的示例包含一种使用持久 websocket 连接的方法，您可以接收消息、处理它们并完成使用 socket。

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

类似于服务器端事件中的 ping 策略，您也可以配置 ping 策略以保持 TCP 连接在无活动时保持打开。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```