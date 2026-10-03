# 基础

Source: https://docs.sisk-framework.org/zh-cn/docs/fundamentals/index.html



## 基础

- [路由](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/routing.md): The Router 是构建服务器的第一步。它负责保存 Route 对象，这些对象是将 URL 及其方法映射到服务器执行的操作的端点。每个操作负责接收请求并向客户端返回响应。
路由是路径表达式（“路径模式”）与它们可以监听的 HTTP 方法的配对。当向服务器发出请求时，服务器会尝试找到匹配该请求的路由，然后调用该路由的 …
- [请求处理](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/request-handlers.md): 请求处理程序，也称为“中间件”，是在路由器上执行请求之前或之后运行的函数。它们可以在每个路由或每个路由器上定义。
请求处理程序有两种类型：
BeforeResponse：定义请求处理程序将在调用路由器操作之前执行。 AfterResponse：定义请求处理程序将在调用路由器操作之后执行。在此上下文中发送 HTTP 响应 …
- [请求](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/requests.md): 请求是表示 HTTP 请求消息的结构体。HttpRequest 对象包含了在整个应用程序中处理 HTTP 消息的实用函数。
一个 HTTP 请求由方法、路径、版本、头部和正文组成。
在本文档中，我们将教您如何获取这些元素。
获取请求方法 # 要获取收到的请求的方法，可以使用 Method 属性：
C# static …
- [响应](https://docs.sisk-framework.org/zh-cn/docs/fundamentals/responses.md): 响应表示对 HTTP 请求的 HTTP 响应对象。它们由服务器发送给客户端，以指示对资源、页面、文档、文件或其他对象的请求。
HTTP 响应由状态、头部和内容组成。
在本文档中，我们将教您如何使用 Sisk 构建 HTTP 响应。
设置 HTTP 状态 # 自 HTTP/1.0 起，HTTP 状态列表保持不变，Sisk …


