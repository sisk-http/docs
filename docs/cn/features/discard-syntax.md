HTTP服务器可用于侦听来自操作的回调请求，例如OAuth身份验证，并在收到该请求后被丢弃。这在需要后台操作但不想为其设置整个HTTP应用程序的情况下很有用。

以下示例展示了如何使用[CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener) 在端口5555上创建一个侦听HTTP服务器，并等待下一个上下文：

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // 等待下一个HTTP请求
    var context = await server.WaitNextAsync();
    Console.WriteLine($"Requested path: {context.Request.Path}");
}
```

[WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext) 函数等待下一个已完成请求处理的上下文。获得此操作的结果后，服务器已经完全处理了请求并向客户端发送了响应。 


