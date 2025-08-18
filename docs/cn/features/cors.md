# 在 Sisk 中启用 CORS（跨域资源共享）

Sisk 有一个工具，在公开服务时处理 [跨域资源共享（CORS）](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Guides/CORS) 非常有用。此功能不是 HTTP 协议的一部分，而是由 W3C 定义的 Web 浏览器的特定功能。此安全机制阻止网页向与提供网页的域不同的域发起请求。服务提供者可以允许某些域访问其资源，或者仅允许一个域。

## 同源

要将资源识别为“同源”，请求必须在其请求中标识 [Origin](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Reference/Headers/Origin) 头：

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

远程服务器必须以与请求的 origin 相同的值返回一个 [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Headers/Access-Control-Allow-Origin) 头：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

此验证是 **显式** 的：主机、端口和协议必须与请求的完全相同。查看示例：

- 服务器响应其 `Access-Control-Allow-Origin` 为 `https://example.com`：
    - `https://example.net` - 域不同。
    - `http://example.com` - 协议不同。
    - `http://example.com:5555` - 端口不同。
    - `https://www.example.com` - 主机不同。

在规范中，只有语法被允许用于请求和响应的两个头。URL 路径被忽略。如果是默认端口（HTTP 为 80，HTTPS 为 443），则端口也会被省略。

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## 启用 CORS

本机上，你可以在 [ListeningHost](/api/Sisk.Core.Http.ListeningHost) 中使用 [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) 对象。

你可以在初始化服务器时配置 CORS：

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

上述代码将为 **所有响应** 发送以下头：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

这些头需要为所有响应发送给 Web 客户端，包括错误和重定向。

你可能会注意到 [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) 类有两个类似的属性： [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) 和 [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins)。请注意，一个是复数，另一个是单数。

- **AllowOrigin** 属性是静态的：仅你指定的 origin 将被发送给所有响应。
- **AllowOrigins** 属性是动态的：服务器检查请求的 origin 是否包含在此列表中。如果找到，则将其发送给该 origin 的响应。

### 通配符和自动头

或者，你可以在响应的 origin 中使用通配符（`*`）来指定允许任何 origin 访问资源。然而，此值不允许用于具有凭据（授权头）的请求，并且此操作将导致错误（[CORSNotSupportingCredentials](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials)）。

你可以通过在 [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) 属性中显式列出允许的 origin，或在 [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) 的值中使用 [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) 常量来解决此问题。此魔法属性将为 `Origin` 头的相同值定义 `Access-Control-Allow-Origin` 头。

你还可以使用 [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) 和 [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) 来实现类似 `AllowOrigin` 的行为，自动根据发送的头进行响应。

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // 根据请求的 Origin 头进行响应
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // 根据 Access-Control-Request-Method 头或请求方法进行响应
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // 根据 Access-Control-Request-Headers 头或发送的头进行响应
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## 其他应用 CORS 的方式

如果你正在处理 [service providers](/docs/cn/extensions/service-providers)，可以覆盖配置文件中定义的值：

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // 将覆盖配置文件中定义的 origin
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## 在特定路由上禁用 CORS

`UseCors` 属性可用于所有路由和所有路由属性，并可通过以下示例禁用：

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

## 在响应中替换值

你可以在路由器操作中显式替换或删除值：

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // 删除 Access-Control-Allow-Credentials 头
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // 替换 Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## 预检请求

预检请求是客户端在实际请求之前发送的 [OPTIONS](https://developer.mozilla.org/en-US/docs/cn/Web/HTTP/Reference/Methods/OPTIONS) 方法请求。

Sisk 服务器将始终以 `200 OK` 和适用的 CORS 头响应请求，然后客户端可以继续实际请求。此条件仅在请求存在路由且 [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) 明确配置为 `Options` 时不适用。

## 全局禁用 CORS

无法做到这一点。若不使用 CORS，请不要配置它。