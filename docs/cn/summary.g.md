# 文档概览

## 欢迎

### [入门](/docs/cn/getting-started)

- [第一步](/docs/cn/getting-started#first-steps)
- [创建项目](/docs/cn/getting-started#creating-a-project)
- [构建 HTTP 服务器](/docs/cn/getting-started#building-the-http-server)
- [手动（高级）设置](/docs/cn/getting-started#manual-advanced-setup)

### [安装](/docs/cn/installing)

### [原生 AOT 支持](/docs/cn/native-aot)

- [不支持的功能](/docs/cn/native-aot#not-supported-features)

### [部署你的 Sisk 应用](/docs/cn/deploying)

- [发布你的应用](/docs/cn/deploying#publishing-your-app)
- [代理你的应用](/docs/cn/deploying#proxying-your-application)
- [创建服务](/docs/cn/deploying#creating-an-service)

### [使用 SSL](/docs/cn/ssl)

- [通过 Sisk.Cadente.CoreEngine](/docs/cn/ssl#through-the-siskcadentecoreengine)
- [通过 Windows 上的 IIS](/docs/cn/ssl#through-iis-on-windows)
- [通过 mitmproxy](/docs/cn/ssl#through-mitmproxy)
- [通过 Sisk.SslProxy 包](/docs/cn/ssl#through-sisksslproxy-package)

### [Cadente](/docs/cn/cadente)

- [概览](/docs/cn/cadente#overview)
- [安装](/docs/cn/cadente#installation)
- [与 Sisk 一起使用](/docs/cn/cadente#using-with-sisk)
- [独立使用](/docs/cn/cadente#standalone-usage)

### [在 Windows 上配置命名空间预留](/docs/cn/registering-namespace)

### [更新日志](/docs/cn/changelogs)

### [常见问题](/docs/cn/faq)

- [Sisk 是开源的吗？](/docs/cn/faq#is-sisk-open-source)
- [是否接受贡献？](/docs/cn/faq#are-contributions-accepted)
- [Sisk 有资金支持吗？](/docs/cn/faq#is-sisk-funded)
- [我可以在生产环境中使用 Sisk 吗？](/docs/cn/faq#can-i-use-sisk-in-production)
- [Sisk 是否提供身份验证、监控和数据库服务？](/docs/cn/faq#does-sisk-have-authentication-monitoring-and-database-services)
- [为什么我应该使用 Sisk 而不是 <framework>？](/docs/cn/faq#why-should-i-use-sisk-instead-of-framework)
- [我需要学习什么才能使用 Sisk？](/docs/cn/faq#what-do-i-need-to-learn-sisk)
- [我可以使用 Sisk 开发商业应用吗？](/docs/cn/faq#can-i-develop-commercial-applications-with-sisk)

## 基础

### [路由](/docs/cn/fundamentals/routing)

- [匹配路由](/docs/cn/fundamentals/routing#matching-routes)
- [正则路由](/docs/cn/fundamentals/routing#regex-routes)
- [前缀路由](/docs/cn/fundamentals/routing#prefixing-routes)
- [无请求参数的路由](/docs/cn/fundamentals/routing#routes-without-request-parameter)
- [任意方法路由](/docs/cn/fundamentals/routing#any-method-routes)
- [任意路径路由](/docs/cn/fundamentals/routing#any-path-routes)
- [忽略大小写的路由匹配](/docs/cn/fundamentals/routing#ignore-case-route-matching)
- [未找到 (404) 回调处理器](/docs/cn/fundamentals/routing#not-found-404-callback-handler)
- [方法不允许 (405) 回调处理器](/docs/cn/fundamentals/routing#method-not-allowed-405-callback-handler)
- [内部错误处理器](/docs/cn/fundamentals/routing#internal-error-handler)

### [请求处理](/docs/cn/fundamentals/request-handlers)

- [创建请求处理器](/docs/cn/fundamentals/request-handlers#creating-an-request-handler)
- [将请求处理器关联到单一路由](/docs/cn/fundamentals/request-handlers#associating-a-request-handler-with-a-single-route)
- [将请求处理器关联到路由器](/docs/cn/fundamentals/request-handlers#associating-a-request-handler-with-a-router)
- [将请求处理器关联到属性](/docs/cn/fundamentals/request-handlers#associating-a-request-handler-with-an-attribute)
- [绕过全局请求处理器](/docs/cn/fundamentals/request-handlers#bypassing-an-global-request-handler)

### [请求](/docs/cn/fundamentals/requests)

- [获取请求方法](/docs/cn/fundamentals/requests#getting-the-request-method)
- [获取请求 URL 组件](/docs/cn/fundamentals/requests#getting-request-url-components)
- [获取请求体](/docs/cn/fundamentals/requests#getting-the-request-body)
- [获取请求上下文](/docs/cn/fundamentals/requests#getting-the-request-context)
- [获取表单数据](/docs/cn/fundamentals/requests#getting-form-data)
- [获取多部分表单数据](/docs/cn/fundamentals/requests#getting-multipart-form-data)
- [检测客户端断开](/docs/cn/fundamentals/requests#detecting-client-disconnection)
- [服务器发送事件支持](/docs/cn/fundamentals/requests#server-sent-events-support)
- [解析代理的 IP 和主机](/docs/cn/fundamentals/requests#resolving-proxied-ips-and-hosts)
- [头部编码](/docs/cn/fundamentals/requests#headers-encoding)

### [响应](/docs/cn/fundamentals/responses)

- [设置 HTTP 状态码](/docs/cn/fundamentals/responses#setting-an-http-status)
- [正文和内容类型](/docs/cn/fundamentals/responses#body-and-content-type)
- [响应头部](/docs/cn/fundamentals/responses#response-headers)
- [发送 Cookie](/docs/cn/fundamentals/responses#sending-cookies)
- [分块响应](/docs/cn/fundamentals/responses#chunked-responses)
- [响应流](/docs/cn/fundamentals/responses#response-stream)
- [GZip、Deflate 和 Brotli 压缩](/docs/cn/fundamentals/responses#gzip-deflate-and-brotli-compression)
- [自动压缩](/docs/cn/fundamentals/responses#automatic-compression)
- [隐式响应类型](/docs/cn/fundamentals/responses#implicit-response-types)
- [关于可枚举对象和数组的说明](/docs/cn/fundamentals/responses#note-on-enumerable-objects-and-arrays)

## 功能

### [日志记录](/docs/cn/features/logging)

- [基于文件的访问日志](/docs/cn/features/logging#file-based-access-logs)
- [基于流的日志记录](/docs/cn/features/logging#stream-based-logging)
- [访问日志格式化](/docs/cn/features/logging#access-log-formatting)
- [日志轮转](/docs/cn/features/logging#rotating-logs)
- [错误日志记录](/docs/cn/features/logging#error-logging)
- [其他日志实例](/docs/cn/features/logging#other-logging-instances)
- [扩展 LogStream](/docs/cn/features/logging#extending-logstream)

### [服务器发送事件](/docs/cn/features/server-sent-events)

- [创建 SSE 连接](/docs/cn/features/server-sent-events#creating-an-sse-connection)
- [追加头部](/docs/cn/features/server-sent-events#appending-headers)
- [等待失败的连接](/docs/cn/features/server-sent-events#wait-for-fail-connections)
- [设置连接 ping 策略](/docs/cn/features/server-sent-events#setup-connections-ping-policy)
- [查询连接](/docs/cn/features/server-sent-events#querying-connections)

### [WebSocket](/docs/cn/features/websockets)

- [接受消息](/docs/cn/features/websockets#accepting-messages)
- [持久连接](/docs/cn/features/websockets#persistent-connection)
- [Ping 策略](/docs/cn/features/websockets#ping-policy)

### [丢弃语法](/docs/cn/features/discard-syntax)

### [依赖注入](/docs/cn/features/instancing)

### [流式内容](/docs/cn/features/content-streaming)

- [请求内容流](/docs/cn/features/content-streaming#request-content-stream)
- [响应内容流](/docs/cn/features/content-streaming#response-content-stream)

### [在 Sisk 中启用 CORS（跨域资源共享）](/docs/cn/features/cors)

- [相同来源](/docs/cn/features/cors#same-origin)
- [启用 CORS](/docs/cn/features/cors#enabling-cors)
- [应用 CORS 的其他方式](/docs/cn/features/cors#other-ways-to-apply-cors)
- [在特定路由上禁用 CORS](/docs/cn/features/cors#disabling-cors-on-specific-routes)
- [在响应中替换值](/docs/cn/features/cors#replacing-values-in-the-response)
- [预检请求](/docs/cn/features/cors#preflight-requests)
- [全局禁用 CORS](/docs/cn/features/cors#disabling-cors-globally)

### [文件服务器](/docs/cn/features/file-server)

- [提供静态文件](/docs/cn/features/file-server#serving-static-files)
- [HttpFileServerHandler](/docs/cn/features/file-server#httpfileserverhandler)
- [目录列表](/docs/cn/features/file-server#directory-listing)
- [文件转换器](/docs/cn/features/file-server#file-converters)

## 扩展

### [模型上下文协议](/docs/cn/extensions/mcp)

- [MCP 入门](/docs/cn/extensions/mcp#getting-started-with-mcp)
- [为函数创建 JSON 架构](/docs/cn/extensions/mcp#creating-json-schemas-for-functions)
- [处理函数调用](/docs/cn/extensions/mcp#handling-function-calls)
- [函数结果](/docs/cn/extensions/mcp#function-results)
- [继续工作](/docs/cn/extensions/mcp#continuing-work)

### [JSON-RPC 扩展](/docs/cn/extensions/json-rpc)

- [传输接口](/docs/cn/extensions/json-rpc#transport-interface)
- [JSON-RPC 方法](/docs/cn/extensions/json-rpc#json-rpc-methods)
- [自定义序列化器](/docs/cn/extensions/json-rpc#customizing-the-serializer)

### [SSL 代理](/docs/cn/extensions/ssl-proxy)

### [基础认证](/docs/cn/extensions/basic-auth)

- [安装](/docs/cn/extensions/basic-auth#installing)
- [创建你的认证处理器](/docs/cn/extensions/basic-auth#creating-your-auth-handler)
- [备注](/docs/cn/extensions/basic-auth#remarks)

### [服务提供者](/docs/cn/extensions/service-providers)

- [从 JSON 文件读取配置](/docs/cn/extensions/service-providers#reading-configurations-from-a-json-file)
- [配置文件结构](/docs/cn/extensions/service-providers#configuration-file-structure)

### [INI 配置提供者](/docs/cn/extensions/ini-configuration)

- [安装](/docs/cn/extensions/ini-configuration#installing)
- [INI 风格和语法](/docs/cn/extensions/ini-configuration#ini-flavor-and-syntax)
- [配置参数](/docs/cn/extensions/ini-configuration#configuration-parameters)

### [API 文档](/docs/cn/extensions/api-documentation)

- [类型处理器](/docs/cn/extensions/api-documentation#type-handlers)
- [导出器](/docs/cn/extensions/api-documentation#exporters)

## 高级

### [手动（高级）设置](/docs/cn/advanced/manual-setup)

- [路由器](/docs/cn/advanced/manual-setup#routers)
- [监听主机和端口](/docs/cn/advanced/manual-setup#listening-hosts-and-ports)
- [服务器配置](/docs/cn/advanced/manual-setup#server-configuration)

### [请求生命周期](/docs/cn/advanced/request-lifecycle)

### [转发解析器](/docs/cn/advanced/forwarding-resolvers)

- [ForwardingResolver 类](/docs/cn/advanced/forwarding-resolvers#the-forwardingresolver-class)

### [HTTP 服务器处理器](/docs/cn/advanced/http-server-handlers)

### [每个服务器的多个监听主机](/docs/cn/advanced/multi-host-setup)

### [HTTP 服务器引擎](/docs/cn/advanced/server-engines)

- [为 Sisk 实现 HTTP 引擎](/docs/cn/advanced/server-engines#implementing-an-http-engine-for-sisk)
- [选择事件循环](/docs/cn/advanced/server-engines#choosing-an-event-loop)
- [测试](/docs/cn/advanced/server-engines#testing)