# 功能

Source: https://docs.sisk-framework.org/zh-cn/docs/features/index.html



## 功能

- [日志](https://docs.sisk-framework.org/zh-cn/docs/features/logging.md): 您可以配置 Sisk 自动写入访问日志和错误日志。可以定义日志轮转、扩展名和频率。
LogStream 类提供了一种异步写入日志并将其保存在可等待写入队列中的方式。LogStream 类实现了 IAsyncDisposable，确保在流关闭之前写入所有未完成的日志。
本文将向您展示如何为应用程序配置日志记录。
基于文件 …
- [Server Sent Events](https://docs.sisk-framework.org/zh-cn/docs/features/server-sent-events.md): Sisk 开箱即支持通过 Server Sent Events 发送消息。您可以创建一次性和持久的连接，在运行时获取这些连接并使用它们。
此功能受到浏览器的某些限制，例如只能发送文本消息且无法永久关闭连接。服务器端关闭的连接会导致客户端每隔 5 秒（某些浏览器为 3 秒）尝试重新连接。
这些连接对于在服务器向客户端发送 …
- [Web 套接字](https://docs.sisk-framework.org/zh-cn/docs/features/websockets.md): Sisk 也支持 Web 套接字，例如接收和发送消息给客户端。
此功能在大多数浏览器中运行良好，但在 Sisk 中仍属实验性。若您发现任何错误，请在 GitHub 上报告。
接收消息 # WebSocket 消息按顺序接收，排队等待 ReceiveMessageAsync 处理。超时、操作被取消或客户端断开时，此方法不 …
- [Discard 语法](https://docs.sisk-framework.org/zh-cn/docs/features/discard-syntax.md): HTTP 服务器可以用于监听来自操作的回调请求，例如 OAuth 身份验证，并在接收到该请求后丢弃。这在需要后台操作但不想为其设置整个 HTTP 应用程序的情况下很有用。
以下示例展示了如何使用 CreateListener 创建一个在端口 5555 上监听的 HTTP 服务器并等待下一个上下文：
C# using …
- [依赖注入](https://docs.sisk-framework.org/zh-cn/docs/features/instancing.md): 通常，会为请求的生命周期专门分配成员和实例，例如数据库连接、已验证的用户或会话令牌。实现这一点的一种可能方式是通过 HttpContext.RequestBag ，它创建一个在整个请求生命周期中都存在的字典。
该字典可以被 请求处理程序 访问，并在整个请求中定义变量。例如，一个验证用户的请求处理程序将用户设置在 …
- [流式内容](https://docs.sisk-framework.org/zh-cn/docs/features/content-streaming.md): Sisk 支持读取和发送流式内容到和从客户端。这一功能对于在请求的生命周期中序列化和反序列化内容的内存开销非常有用。
请求内容流 # 小内容会自动加载到 HTTP 连接缓冲区内存中，快速加载到 HttpRequest.Body 和 HttpRequest.RawBody。对于较大的内容，可以使用 …
- [启用 CORS（跨源资源共享）在 Sisk](https://docs.sisk-framework.org/zh-cn/docs/features/cors.md): Sisk 有一个工具，可以用于处理 跨源资源共享 (CORS) 当公开服务时。这一功能不是 HTTP 协议的一部分，而是由 W3C 定义的 Web 浏览器的特定功能。这种安全机制可以防止 Web 页面向不同于提供 Web 页面的域发送请求。服务提供者可以允许某些域访问其资源，或者只允许一个域。
同源 # 要识别为“同源 …
- [文件服务器](https://docs.sisk-framework.org/zh-cn/docs/features/file-server.md): Sisk 提供 Sisk.Http.FileSystem 命名空间，其中包含用于提供静态文件、目录列表和文件转换的工具。此功能允许您从本地目录提供文件，支持范围请求（音频/视频流）和自定义文件处理。
提供静态文件 # 提供静态文件的最简方式是使用 Router.MapFileSystem。此方法将 URL 前缀映射到磁 …


