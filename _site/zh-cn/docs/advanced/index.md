# 高级

Source: https://docs.sisk-framework.org/zh-cn/docs/advanced/index.html



## 高级

- [手动（高级）设置](https://docs.sisk-framework.org/zh-cn/docs/advanced/manual-setup.md): 当您需要自行组装服务器组件时使用手动设置，例如一个进程必须暴露多个主机、端口、路由器或自定义服务器配置。对于大多数应用程序，构建器 API 更简洁，应该优先使用。手动设置在您想直接控制四个核心部件时非常有用：Router、一个或多个 ListeningHost 对象、HttpServerConfiguration，以及 …
- [请求生命周期](https://docs.sisk-framework.org/zh-cn/docs/advanced/request-lifecycle.md): 下面通过一个 HTTP 请求的示例解释请求的完整生命周期。
接收请求： 每个请求在请求本身和将要发送给客户端的响应之间创建一个 HTTP 上下文。该上下文来自 Sisk 内置的监听器，可以是 HttpListener、Kestrel 或 Cadente。 外部请求验证：对请求进行 …
- [转发解析器](https://docs.sisk-framework.org/zh-cn/docs/advanced/forwarding-resolvers.md): Forwarding Resolver 是一个帮助解码通过请求、代理、CDN 或负载均衡器识别客户端信息的工具。当您的 Sisk 服务通过反向或正向代理运行时，客户端的 IP 地址、主机和协议可能与原始请求不同，因为这是从一个服务转发到另一个服务。此 Sisk 功能允许您在处理请求之前控制并解析这些信息。这些代理通常会 …
- [Http server handlers](https://docs.sisk-framework.org/zh-cn/docs/advanced/http-server-handlers.md): 在 Sisk 0.16 版本中，我们引入了 HttpServerHandler 类，旨在扩展 Sisk 的整体行为并为 Sisk 提供额外的事件处理程序，例如处理 Http 请求、路由、上下文袋等。
该类集中处理整个 HTTP 服务器以及单个请求生命周期中发生的事件。Http 协议没有会话概念，因此无法在请求之间保留信 …
- [每个服务器的多个监听主机](https://docs.sisk-framework.org/zh-cn/docs/advanced/multi-host-setup.md): Sisk Framework 一直支持在每个服务器上使用多个主机，也就是说，一个 HTTP 服务器可以监听多个端口，每个端口都有自己的路由器和在其上运行的服务。
这样，就可以轻松地在单个 HTTP 服务器上使用 Sisk 分离职责并管理服务。下面的示例展示了创建两个 ListeningHost，每个监听不同的端口，使用 …
- [HTTP 服务器引擎](https://docs.sisk-framework.org/zh-cn/docs/advanced/server-engines.md): Sisk Framework 被分成几个包，其中主包（Sisk.HttpServer）不包含一个基本的 HTTP 服务器 - 默认情况下，HttpListener 被用作 Sisk 的主要引擎来执行服务器的低级别角色。
HTTP 引擎实现了 Sisk 提供的应用层以下的层次。这个层次负责连接管理、消息的序列化和反序列化 …


