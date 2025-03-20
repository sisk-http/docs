# 启用 Sisk 中的 CORS（跨源资源共享）

Sisk 有一个工具，可以用于处理公开服务时的 [跨源资源共享 (CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS)。此功能不是 HTTP 协议的一部分，而是由 W3C 定义的 Web 浏览器的特定功能。这种安全机制可以防止 Web 页面向与提供 Web 页面的域不同的域发送请求。服务提供者可以允许某些域访问其资源，或者只允许一个域。

## 同源

要将资源识别为“同源”，请求必须在其请求中标识 [Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Origin) 标头：

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

并且远程服务器必须用具有与请求的源相同值的 [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 标头响应：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

此验证是 **显式** 的：主机、端口和协议必须与请求的相同。检查以下示例：

- 服务器响应其 `Access-Control-Allow-Origin` 为 `https://example.com`：
  - `https://example.net` - 域不同。
  - `http://example.com` - 方案不同。
  - `http://example.com:5555` - 端口不同。
  - `https://www.example.com` - 主机不同。

在规范中，仅允许请求和响应的标头的语法。URL 路径被忽略。默认端口（HTTP 的 80 和 HTTPS 的 443）被省略。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## 启用 CORS

您可以在 [ListeningHost](/api/Sisk.Core.Http.ListeningHost) 中使用 [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) 对象。

您可以在初始化服务器时配置 CORS：

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

上面的代码将为 **所有响应** 发送以下标头：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

这些标头需要发送给 Web 客户端，包括错误和重定向。

您可能会注意到 [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) 类有两个类似的属性：[AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) 和 [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)。注意，一个是复数，另一个是单数。

- **AllowOrigin** 属性是静态的：仅指定的源将被发送给所有响应。
- **AllowOrigins** 属性是动态的：服务器检查请求的源是否包含在此列表中。如果找到，则它将被发送给该源的响应。

### 源中的通配符

或者，您可以在响应的源中使用通配符 (`*`) 来指定任何源都可以访问资源。然而，此值不允许用于具有凭据（授权标头）的请求，并且此操作 [将导致错误](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)。

您可以通过显式列出将被允许的源来解决这个问题，或者使用 [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) 属性，也可以使用 [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) 常量作为 [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) 的值。此魔术属性将为请求的 `Origin` 标头的相同值定义 `Access-Control-Allow-Origin` 标头。

## 应用 CORS 的其他方式

如果您处理 [服务提供者](/docs/extensions/service-providers)，您可以覆盖配置文件中定义的值：

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // 将覆盖配置文件中定义的源。
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## 在特定路由上禁用 CORS

`UseCors` 属性可用于路由和所有路由属性，并且可以使用以下示例禁用：

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## 替换响应中的值

您可以在路由器操作中显式替换或删除值：

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // 删除 Access-Control-Allow-Credentials 标头
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;

        // 替换 Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## 预检请求

预检请求是客户端在实际请求之前发送的 [OPTIONS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Methods/OPTIONS) 方法请求。

Sisk 服务器将始终用 `200 OK` 和适用的 CORS 标头响应请求，然后客户端可以继续实际请求。这种情况仅在为 `Options` 显式配置路由方法时不适用。

## 全局禁用 CORS

不可能这样做。要不使用 CORS，请不要配置它。