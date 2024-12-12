## WebSockets

Sisk也支持WebSockets，例如接收和发送消息到客户端。

此功能在大多数浏览器中都能正常工作，但在Sisk中仍处于实验阶段。如果您发现任何错误，请在github上报告。

## 异步接收和发送消息

以下示例演示了WebSocket在实践中的工作方式，并以打开连接、接收消息并将其显示在控制台为例。

WebSocket接收到的所有消息都是以字节接收的，因此您需要在接收时对其进行解码。

默认情况下，消息被分割成块，最后一部分作为消息的最终数据包发送。您可以使用[WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)标志配置数据包大小。此缓冲区对于发送和接收消息都是相同的。

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

            // 获取接收消息的HttpWebSocket上下文
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Response!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## 同步接收和发送消息

以下示例包含一种使用同步WebSocket的方法，无需异步上下文，您可以接收消息、处理它们并完成使用套接字。

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

Send方法有三个重载，允许您发送文本、字节数组或字节跨度。如果服务器的[WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)标志大于总有效负载大小，则它们都会被分块。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world");     // 将被编码为UTF-8字节数组
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## 等待WebSocket关闭

[WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose)方法阻止当前调用堆栈，直到连接由客户端或服务器终止。

通过此方法，请求的回调执行将阻塞，直到客户端或服务器断开连接。

您也可以使用[Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close)方法手动关闭连接。此方法返回一个空的[HttpResponse](/api/Sisk.Core.Http.HttpResponse)对象，该对象不会发送到客户端，但作为接收HTTP请求的函数的返回值。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // 等待客户端关闭连接
        ws.WaitForClose();

        // 等待60秒内没有消息交换，或者某个方关闭连接
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Ping策略

类似于Server Side Events中的Ping策略，您还可以配置Ping策略来保持TCP连接处于活动状态，即使没有活动。 

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```