# 扩展

Source: https://docs.sisk-framework.org/zh-cn/docs/extensions/index.html



## 扩展

- [模型上下文协议](https://docs.sisk-framework.org/zh-cn/docs/extensions/mcp.md): 可以使用 Sisk.ModelContextProtocol 包构建为使用大型语言模型（LLM）的代理模型提供上下文的应用程序：
Bash dotnet add package Sisk.ModelContextProtocol 该包公开了用于构建在 Streamable HTTP 上运行的 MCP 服务器的实用类和方 …
- [JSON-RPC 扩展](https://docs.sisk-framework.org/zh-cn/docs/extensions/json-rpc.md): Sisk 提供了一个实验性的 JSON-RPC 2.0 API 模块，帮助你创建更简洁的应用程序。此扩展严格实现 JSON-RPC 2.0 传输接口，并提供通过 HTTP GET、POST 请求以及 Sisk 的 WebSocket 进行传输。
你可以使用下面的命令通过 Nuget 安装此扩展。请注意，在实验/测试版中 …
- [SSL 代理](https://docs.sisk-framework.org/zh-cn/docs/extensions/ssl-proxy.md): 警告
此功能是实验性的，不应在生产环境中使用。如果您想让 Sisk 与 SSL 协作，请参阅 此文档。
Sisk SSL 代理是一个模块，提供了 Sisk 中 ListeningHost 的 HTTPS 连接，并将 HTTPS 消息路由到不安全的 HTTP 上下文。该模块是为使用 HttpListener 运行的服务提 …
- [基本身份验证](https://docs.sisk-framework.org/zh-cn/docs/extensions/basic-auth.md): Basic Auth 包添加了一个请求处理程序，能够处理基本身份验证方案，并且只需进行很少的配置和努力，即可在 Sisk 应用程序中使用。 基本 HTTP 身份验证是一种最小的输入形式，通过用户 ID 和密码对请求进行身份验证，会话由客户端完全控制，并且没有身份验证或访问令牌。
有关基本身份验证方案的更多信息，请参阅 …
- [服务提供者](https://docs.sisk-framework.org/zh-cn/docs/extensions/service-providers.md): 服务提供者是一种将 Sisk 应用程序移植到不同环境的方式，使用可移植的配置文件。该功能允许您在不修改应用程序代码的情况下更改服务器端口、参数和其他选项。该模块依赖于 Sisk 构造语法，可以通过 UsePortableConfiguration 方法进行配置。
一个配置提供者是通过 …
- [INI 配置提供程序](https://docs.sisk-framework.org/zh-cn/docs/extensions/ini-configuration.md): Sisk 有一种除了 JSON 之外的获取启动配置的方法。实际上，任何实现 IConfigurationReader 的管道都可以与 PortableConfigurationBuilder.WithConfigurationPipeline一起使用，读取服务器配置从任何文件类型。 …
- [API 文档](https://docs.sisk-framework.org/zh-cn/docs/extensions/api-documentation.md): Sisk.Documenting 扩展允许您自动为 Sisk 应用程序生成 API 文档。它利用您的代码结构和特性来创建一个完整的文档站点，支持导出为 Open API（Swagger）格式。
警告
此软件包目前仍在开发中，尚未发布。其行为和 API 可能会在未来的更新中发生更改。
由于此软件包尚未在 NuGet 上提 …


