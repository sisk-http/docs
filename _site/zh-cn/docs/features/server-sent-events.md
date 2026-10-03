# Server Sent Events

Source: https://docs.sisk-framework.org/zh-cn/docs/features/server-sent-events.html

Sisk 开箱即支持通过 Server Sent Events 发送消息。您可以创建一次性和持久的连接，在运行时获取这些连接并使用它们。

此功能受到浏览器的某些限制，例如只能发送文本消息且无法永久关闭连接。服务器端关闭的连接会导致客户端每隔 5 秒（某些浏览器为 3 秒）尝试重新连接。

这些连接对于在服务器向客户端发送事件时，无需客户端每次请求信息非常有用。

## 创建 SSE 连接

SSE 连接的工作方式类似普通的 HTTP 请求，但不是在发送响应后立即关闭连接，而是保持连接打开以发送消息。

调用 [HttpRequest.GetEventSource()](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetEventSource.md) 方法时，请求会进入等待状态，同时创建 SSE 实例。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

在上述代码中，我们创建了一个 SSE 连接并发送了 “Hello, world” 消息，随后从服务器端关闭了 SSE 连接。

> [!NOTE]
> 当关闭服务器端连接时，默认情况下客户端会在该端尝试重新连接，连接会被重新启动，方法会再次执行，永无止境。
>
> 通常在服务器关闭连接时会转发一个终止消息，以防止客户端再次尝试重新连接。

## 追加 Header

如果需要发送 Header，可以在发送任何消息之前使用 [HttpRequestEventSource.AppendHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader.md) 方法。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

请注意，必须在发送任何消息之前发送 Header。

## Wait-For-Fail 连接

当服务器因可能的客户端断开而无法继续发送消息时，连接通常会被终止。此时连接会自动结束，类的实例也会被丢弃。

即使重新连接，类的实例也无法工作，因为它绑定到之前的连接。在某些情况下，您可能稍后仍需要此连接，并且不想通过路由的回调方法来管理它。

为此，我们可以为 SSE 连接指定标识符，并在以后（甚至在路由回调之外）使用该标识符获取它们。此外，我们使用 [WaitForFail](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail.md) 标记连接，以防止路由被终止并自动关闭连接。

在 `WaitForFail` 模式下，SSE 连接会等待因断开导致的发送错误，或等待配置的空闲容忍时间到期后，路由才会恢复并关闭连接。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 等待 15 秒未收到任何消息后终止连接

    return sse.Close();
});
```

上述方法将创建连接、处理它并等待断开或错误。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 连接仍然存活
    evs.Send("Hello again!");
}
```

上面的代码片段会尝试查找新创建的连接，如果存在，则向其发送一条消息。

所有已标识的活动服务器连接都可以在集合 [HttpServer.EventSources](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.EventSources.md) 中获取。该集合仅存储活动且已标识的连接，已关闭的连接会从集合中移除。

> [!NOTE]
> 需要注意的是，保持连接活跃的上限受可能以不可控方式连接到 Sisk 的组件限制，例如 Web 代理、HTTP 内核或网络驱动，它们会在一定时间后关闭空闲连接。
>
> 因此，重要的是通过定期发送 ping 或延长最大存活时间来保持连接打开。阅读下一节以更好地了解如何发送周期性 ping。

## 设置连接 Ping 策略

Ping 策略是一种自动向客户端发送周期性消息的方式。该功能使服务器能够在不必无限期保持连接打开的情况下，判断客户端是否已断开。

```cs
[RouteGet("/sse")]
public async Task<HttpResponse> Events(HttpRequest request)
{
    using var sse = await request.GetEventSourceAsync("user-events");
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    await sse.WaitForFailAsync(TimeSpan.FromMinutes(10));
    return await sse.CloseAsync();
}
```

如上代码所示，每隔 5 秒会向客户端发送一次新的 ping 消息。这将保持 TCP 连接活跃，防止因闲置而被关闭。同时，当消息发送失败时，连接会自动关闭，释放连接占用的资源。

在异步路由中使用 [SendAsync](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync.md) 和 [CloseAsync](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync.md)。如果需要在关闭前丢弃已排队的事件，请调用 [Cancel](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel.md)。

## 查询连接

您可以使用对连接标识符的谓词搜索活动连接，以实现广播等功能。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

您也可以使用 [All](https://docs.sisk-framework.org/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All.md) 方法获取所有活动的 SSE 连接。
