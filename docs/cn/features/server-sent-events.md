# 服务器发送事件

Sisk 支持通过服务器发送事件（Server Sent Events）发送消息。您可以创建可抛弃和持久的连接，在运行时获取这些连接并使用它们。

此功能由于浏览器的限制有一些局限性，例如只能发送文本消息，不能永久关闭连接。服务器端关闭的连接将导致客户端每 5 秒（某些浏览器为 3 秒）尝试重新连接一次。

这些连接对于从服务器向客户端发送事件而无需客户端每次请求信息非常有用。

## 创建 SSE 连接

SSE 连接的工作方式与普通的 HTTP 请求类似，但不是发送响应并立即关闭连接，而是保持连接打开以发送消息。

调用 [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法，请求将被置于等待状态，同时创建 SSE 实例。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

在上面的代码中，我们创建一个 SSE 连接并发送一个“Hello, world”消息，然后我们从服务器端关闭 SSE 连接。

> [!NOTE]
> 当关闭服务器端连接时，客户端将默认尝试在该端重新连接，并且连接将被重启，方法将被再次执行，永远如此。
>
> 通常，当服务器关闭连接时，会从服务器发送终止消息以防止客户端尝试再次重新连接。

## 添加头部

如果需要发送头部，可以使用 [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) 方法，在发送任何消息之前。

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

连接通常在服务器无法发送消息时终止，可能是由于客户端断开连接。这样，连接将被自动终止，类的实例将被丢弃。

即使重新连接，类的实例也将不起作用，因为它与之前的连接相关联。在某些情况下，您可能需要稍后使用此连接，并且不希望通过路由的回调方法管理它。

为此，我们可以使用标识符标识 SSE 连接，并稍后使用它获取连接，即使在路由的回调之外。此外，我们使用 [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) 标记连接，以免自动终止路由和连接。

SSE 连接在 KeepAlive 时将等待发送错误（由断开连接引起）以恢复方法执行。也可以为此设置超时时间。超时后，如果没有发送任何消息，连接将被终止，执行将恢复。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 等待 15 秒内没有任何消息发送后终止连接

    return sse.Close();
});
```

上面的方法将创建连接，处理它，并等待断开连接或错误。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 连接仍然活着
    evs.Send("Hello again!");
}
```

上面的代码片段将尝试查找新创建的连接，如果它存在，将向其发送一条消息。

所有活动的服务器连接都将在 [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) 集合中可用。此集合仅存储活动的和已标识的连接。已关闭的连接将从集合中删除。

> [!NOTE]
> 需要注意，保持活动有一个由可能以不可控方式连接到 Sisk 的组件（如 Web 代理、HTTP 内核或网络驱动程序）建立的限制，它们在一定时间后关闭空闲连接。
>
> 因此，通过发送周期性的 ping 或扩展连接关闭之前的最大时间来保持连接打开非常重要。阅读下一节以更好地理解发送周期性的 ping。

## 设置连接 ping 策略

ping 策略是一种自动向客户端发送周期性消息的方法。该功能允许服务器在不需要保持连接打开的情况下了解客户端何时断开连接。

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

在上面的代码中，每 5 秒将向客户端发送一条新的 ping 消息。这将保持 TCP 连接打开，并防止由于不活动而关闭连接。另外，当消息发送失败时，连接将被自动关闭，释放连接使用的资源。

## 查询连接

您可以使用连接标识符的谓词来搜索活动连接，以便广播，例如。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

您还可以使用 [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) 方法来获取所有活动的 SSE 连接。