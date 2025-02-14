# Web 套接字

Sisk 同时支持 Web 套接字，例如接收和发送消息到客户端。

此功能在大多数浏览器中工作正常，但在 Sisk 中仍然是实验性的。如果您发现任何错误，请在 GitHub 上报告。

## 异步接受和接收消息

下面的示例展示了 Web 套接字在实践中的工作方式，包括打开连接、接收消息和在控制台中显示消息的示例。

所有通过 Web 套接字接收的消息都是以字节形式接收的，因此您需要在接收时对其进行解码。

默认情况下，消息被分成块，并且最后一块被发送为消息的最后一个数据包。您可以使用 [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) 标志配置数据包大小。此缓冲对于发送和接收消息是相同的。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

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

    return new ListeningHost("localhost", 5551, r);
}
```

## 同步接受和接收消息

下面的示例包含了一种使用同步 Web 套接字的方法，无需异步上下文，您可以接收消息、处理它们并完成使用套接字。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
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

    return new ListeningHost("localhost", 5551, r);
}
```

## 发送消息

Send 方法有三个重载，允许您发送文本、字节数组或字节跨度。如果服务器的 [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) 标志大于总有效负载大小，则所有这些方法都会将消息分块。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world");     // 将被编码为 UTF-8 字节数组
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## 等待 Web 套接字关闭

[WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) 方法会阻塞当前调用堆栈，直到连接由客户端或服务器终止。

通过此方法，请求的回调执行将被阻塞，直到客户端或服务器断开连接。

您也可以使用 [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close) 方法手动关闭连接。此方法返回一个空 [HttpResponse](/api/Sisk.Core.Http.HttpResponse) 对象，该对象不会发送到客户端，但作为从接收 HTTP 请求的函数返回。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // 等待客户端关闭连接
        ws.WaitForClose();

        // 等待 60 秒内没有消息交换或任一方关闭连接
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ping 策略

与服务器端事件中的 Ping 策略类似，您也可以配置 Ping 策略以保持 TCP 连接在空闲时保持打开。

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```