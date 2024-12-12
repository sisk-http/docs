## Server Sent Events

Sisk 支持开箱即用地通过 Server Sent Events 发送消息。您可以创建可丢弃的和持久连接，在运行时获取连接并使用它们。

此功能受到浏览器的一些限制，例如只能发送文本消息，并且无法永久关闭连接。服务器端关闭连接会导致客户端每隔 5 秒（某些浏览器为 3 秒）尝试重新连接一次。

这些连接对于从服务器向客户端发送事件非常有用，而无需客户端每次都请求信息。

## 创建 SSE 连接

SSE 连接的工作方式类似于常规 HTTP 请求，但它不会在发送响应并立即关闭连接后保持连接打开以发送消息。

通过调用 [HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) 方法，请求将处于等待状态，同时创建 SSE 实例。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

在上面的代码中，我们创建了一个 SSE 连接并发送一条“Hello, world”消息，然后我们从服务器端关闭 SSE 连接。

> [!NOTE]
> 当关闭服务器端连接时，默认情况下，客户端将尝试再次连接，并且连接将重新启动，无限期地执行该方法。
>
> 通常，当从服务器关闭连接时，从服务器转发终止消息很常见，以防止客户端再次尝试连接。

## 追加标头

如果您需要发送标头，可以在发送任何消息之前使用 [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) 方法。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

请注意，在发送任何消息之前必须发送标头。

## Wait-For-Fail 连接

连接通常在服务器无法再发送消息时终止，例如由于客户端断开连接。这样，连接会自动终止，并且实例将被丢弃。

即使重新连接，该实例也无法使用，因为它与之前的连接相关联。在某些情况下，您可能需要稍后使用此连接，并且不想通过路由的回调方法来管理它。

为此，我们可以使用标识符标识 SSE 连接，并稍后使用它来获取它们，即使不在路由的回调之外。此外，我们使用 [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) 标记连接，以便不终止路由并自动终止连接。

保持活动状态的 SSE 连接将等待发送错误（由断开连接引起）来恢复方法执行。还可以为此设置一个超时。在该时间过后，如果未发送任何消息，则会终止连接并恢复执行。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 等待 15 秒，如果没有消息则终止连接

    return sse.Close();
});
```

上述方法将创建连接，处理它并等待断开连接或错误。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 连接仍然存在
    evs.Send("Hello again!");
}
```

上面的代码片段将尝试查找新创建的连接，如果存在，则向其发送一条消息。

所有活动服务器连接都将包含在 [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) 集合中。此集合仅存储活动和已标识的连接。已关闭的连接将从集合中移除。

> [!NOTE]
> 重要的是要注意，保持活动状态受到可能以不可控方式连接到 Sisk 的组件（例如 Web 代理、HTTP 内核或网络驱动程序）的限制，它们会在一段时间后关闭空闲连接。
>
> 因此，通过发送周期性 ping 或延长连接关闭的最大时间来保持连接打开非常重要。阅读下一节，以更好地了解发送周期性 ping。

## 设置连接 ping 策略

Ping 策略是一种自动向客户端发送周期性消息的方法。此功能允许服务器了解客户端何时断开该连接，而无需无限期地保持连接打开。

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    var sse = request.GetEventSource();
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

在上面的代码中，每隔 5 秒，将向客户端发送一条新的 ping 消息。这将保持 TCP 连接活动，并防止由于空闲而关闭连接。此外，当消息发送失败时，连接会自动关闭，释放连接使用的资源。

## 查询连接

您可以使用连接标识符上的谓词来搜索活动连接，例如广播。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

您还可以使用 [All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) 方法获取所有活动 SSE 连接。