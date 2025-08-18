# Web Sockets

Sisk 支持 WebSockets，例如接收和发送消息给客户端。

此功能在大多数浏览器中运行良好，但在 Sisk 中仍处于实验阶段。若发现任何 bug，请在 GitHub 上报告。

## 异步接收消息

WebSocket 消息按顺序接收，排队直到被 `ReceiveMessageAsync` 处理。该方法在超时、操作被取消或客户端断开时返回无消息。

一次只能进行一次读取和写入操作，因此在等待 `ReceiveMessageAsync` 的消息时，无法向已连接的客户端写入。

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

## 同步接收消息

下面的示例展示了如何使用同步 WebSocket，而不需要异步上下文，在接收消息、处理后完成 socket 的使用。

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

类似于 Server Side Events 中的 ping 策略，你也可以配置 ping 策略，以在无活动时保持 TCP 连接打开。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
