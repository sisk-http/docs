# Web Sockets

Sisk 也支持 Web Sockets，可以接收和发送消息到客户端。

此功能在大多数浏览器中运行良好，但在 Sisk 中仍处于实验阶段。如果您发现任何错误，请在 GitHub 上报告。

## 异步接受和接收消息

下面的示例展示了 WebSocket 在实践中的工作原理，包括建立连接、接收消息并在控制台中显示。

WebSocket 接收到的所有消息都是以字节形式接收的，因此您需要在收到消息时解码它们。

默认情况下，消息被分成块，最后一个块作为消息的最后一个数据包发送。您可以使用 [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) 标志配置数据包大小。此缓冲适用于发送和接收消息。

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    
    ws.OnReceive += (sender, msg) =>
    {
        string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
        Console.WriteLine("Received message: " + msgText);

        // 获取接收消息的 HttpWebSocket 上下文
        HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
        senderWebSocket.Send("Response!");
    };

    ws.WaitForClose();
    
    return ws.Close();
});
```

> [!NOTE]
>
> 不要以这种方式使用异步事件。您可能会在 HTTP 服务器域之外抛出异常，这可能会使您的应用程序崩溃。

如果您需要处理异步代码并同时处理多个消息，可以使用消息循环：

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
    using var ws = await request.GetWebSocketAsync();
    
    WebSocketMessage? message;
    while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
    {
        var messageText = message.GetString();
        Console.WriteLine($"Received message: {messageText}");

        await ws.SendAsync("Hello from server!");
    }

    return ws.Close();
});
```

## 同步接受和接收消息

下面的示例包含一种使用同步 WebSocket 的方法，在这种方法中，您接收消息，处理它们，然后完成使用套接字。

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    WebSocketMessage? msg;
    
askName:
    ws.Send("What is your name?");
    msg = ws.WaitNext();
        
    string? name = msg?.GetString();

    if (string.IsNullOrEmpty(name))
    {
        ws.Send("Please, insert your name!");
        goto askName;
    }
    
askAge:
    ws.Send("And your age?");
    msg = ws.WaitNext();
        
    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        ws.Send("Please, insert an valid number");
        goto askAge;
    }
        
    ws.Send($"You're {name}, and you are {age} old.");
        
    return ws.Close();
});
```

## 发送消息

Send 方法有三个重载，允许您发送文本、字节数组或字节跨度。如果服务器的 [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) 标志大于总有效负载大小，则所有这些方法都会被分块。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world"); // 将被编码为 UTF-8 字节数组
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## 等待 WebSocket 关闭

[WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) 方法阻塞当前调用栈，直到连接被客户端或服务器终止。

这样，请求回调的执行将被阻塞，直到客户端或服务器断开连接。

您也可以使用 [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close) 方法手动关闭连接。此方法返回一个空的 [HttpResponse](/api/Sisk.Core.Http.HttpResponse) 对象，该对象不会发送到客户端，但作为接收 HTTP 请求的函数的返回值。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // 等待客户端关闭连接
        ws.WaitForClose();

        // 等待 60 秒内没有消息交换
        // 或直到某一方关闭连接
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Ping 策略

与服务器端事件中的 ping 策略类似，您也可以配置 ping 策略，以在 TCP 连接中保持活动状态。

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```