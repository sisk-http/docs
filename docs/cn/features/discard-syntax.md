# Discard 语法

HTTP 服务器可以用于监听来自操作的回调请求，例如 OAuth 身份验证，并在接收到该请求后丢弃。这在需要后台操作但不想为其设置整个 HTTP 应用程序的情况下很有用。

以下示例展示了如何使用 [CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) 创建一个在端口 5555 上监听的 HTTP 服务器并等待下一个上下文：

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // 等待下一个 HTTP 请求
    var context = await server.WaitNextAsync();
    Console.WriteLine($"请求路径: {context.Request.Path}");
}
```

[WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext) 函数等待下一个完成的请求处理上下文。一旦获得此操作的结果，服务器已经完全处理了请求并将响应发送给客户端。