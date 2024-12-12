## 基本身份验证

Basic Auth 包增加了一个请求处理程序，能够处理您的 Sisk 应用程序中的基本身份验证方案，配置和操作非常简单。

基本 HTTP 身份验证是一种最简单的请求身份验证形式，通过用户 ID 和密码来验证请求，会话由客户端完全控制，没有身份验证或访问令牌。

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

在 [MDN 规范](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication) 中了解更多关于基本身份验证方案的信息。

## 安装

要开始使用，请在您的项目中安装 Sisk.BasicAuth 包：

    > dotnet add package Sisk.BasicAuth

您可以在 [Nuget 存储库](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0) 中查看更多安装方法。

## 创建您的身份验证处理程序

您可以控制整个模块或单个路由的身份验证方案。为此，让我们首先编写第一个基本身份验证处理程序。

在下面的示例中，建立数据库连接，检查用户是否存在以及密码是否有效，然后将用户存储在上下文袋中。

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "要进入此页面，请提供您的凭据。 ";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // 在这种情况下，我们使用电子邮件作为用户 ID 字段，因此我们将根据电子邮件搜索用户。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("对不起！未找到此电子邮件的用户。");
        }

        // 验证凭据密码对于此用户有效。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("凭据无效。");
        }

        // 将已登录的用户添加到 HTTP 上下文中
        // 并继续执行
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

因此，只需将此请求处理程序与我们的路由或类关联即可。

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "您好，" + loggedUser.Name + "！";
    }
}
```

或者使用 [RouterModule](/api/Sisk.Core.Routing.RouterModule) 类：

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // 现在，此类中的所有路由都将由 UserAuthHandler 处理。
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "您好，" + loggedUser.Name + "！";
    }
}
```

## 备注

基本身份验证的主要责任由客户端承担。存储、缓存控制和加密都由客户端本地处理。服务器仅接收凭据并验证是否允许访问。

请注意，这种方法不是最安全的，因为它将很大一部分责任放在客户端，这可能难以追踪和维护其凭据的安全性。此外，对于密码，必须在安全的连接上下文中（SSL）传输，因为它们本身没有加密。请求标头中的短暂拦截可能会暴露用户的访问凭据。

对于生产应用程序，请选择更强大的身份验证解决方案，避免使用过多的现成的组件，因为它们可能无法适应您的项目需求，并最终导致暴露安全风险。