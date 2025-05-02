# 服务器发送事件

Sisk 支持开箱即用地通过服务器发送事件发送消息。您可以创建可 disposable 和持久的连接，在运行时获取连接并使用它们。

此功能有一些受到浏览器限制的限制，例如只能发送文本消息，无法永久关闭连接。服务器端关闭的连接将由客户端每 5 秒（某些浏览器为 3 秒）尝试重新连接。

这些连接对于在不每次由客户端请求信息的情况下，从服务器向客户端发送事件非常有用。

## 创建 SSE 连接

SSE 连接的工作方式与常规 HTTP 请求类似，但不是发送响应并立即关闭连接，而是保持连接打开以发送消息。

调用 [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法，请求将进入等待状态，同时创建 SSE 实例。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

在上面的代码中，我们创建了一个 SSE 连接并发送一条“Hello, world”消息，然后从服务器端关闭 SSE 连接。

> [!NOTE]
> 当关闭服务器端连接时，默认情况下客户端将尝试再次连接，该连接将重新启动，永久执行该方法。
>
> 通常，在从服务器关闭连接时，转发终止消息以防止客户端尝试再次连接是很常见的。

## 追加头部

如果您需要发送头部，可以在发送任何消息之前使用 [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) 方法。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

注意，必须在发送任何消息之前发送头部。

## 等待失败连接

连接通常在服务器由于可能的客户端断开连接而无法发送消息时终止。因此，连接会自动终止，类的实例将被丢弃。

即使重新连接，类的实例也不会工作，因为它与之前的连接相关联。在某些情况下，您可能需要在稍后需要此连接，而不想通过路由的回调方法管理它。

为此，我们可以用标识符标识 SSE 连接，并在稍后使用它，甚至在路由的回调之外。此外，我们使用 [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) 标记连接，以便在不终止路由和自动终止连接的情况下。

KeepAlive 中的 SSE 连接将等待发送错误（由断开连接引起）以恢复方法执行。也可以为此设置超时。在超时后，如果未发送任何消息，则连接将被终止，执行将恢复。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 在 15 秒内无任何消息时终止连接

    return sse.Close();
});
```

上述方法将创建连接，处理它并等待断开连接或错误。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 连接仍然活跃
    evs.Send("Hello again!");
}
```

上面的代码片段将尝试查找新创建的连接，如果存在，则向其发送消息。

所有已标识的活动服务器连接都将可在集合 [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) 中。该集合仅存储活动和已标识的连接。关闭的连接将从集合中删除。

> [!NOTE]
> 值得注意的是，KeepAlive 由可能以无法控制的方式连接到 Sisk 的组件（例如，Web 代理，HTTP 内核或网络驱动程序）建立的限制，并且它们在一段时间内后关闭空闲连接。
>
> 因此，通过发送周期性 ping 或延长连接关闭前的时间来保持连接打开非常重要。阅读下一节以更好地了解发送周期性 ping。

## 设置连接 ping 策略

Ping 策略是一种自动向客户端发送周期性消息的方法。此功能允许服务器在不将连接无限期保持打开的情况下，了解客户端何时已断开与该连接的连接。

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    using var sse = request.GetEventSource();
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });

    sse.KeepAlive();
    return sse.Close();
}
```

在上面的代码中，每 5 秒将向客户端发送一个新的 ping 消息。这将保持 TCP 连接活跃，防止由于不活动而关闭。此外，当发送消息失败时，连接将自动关闭，释放连接使用的资源。

## 查询连接

您可以使用谓词搜索活动连接的标识符，以便能够广播，例如。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

您还可以使用 [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) 方法获取所有活动 SSE 连接。