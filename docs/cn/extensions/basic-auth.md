# Basic Auth

Basic Auth 包提供了一个请求处理器，能够在你的 Sisk 应用中以极少的配置和工作量处理基本身份验证方案。
基本 HTTP 身份验证是一种最小化的身份验证请求方式，使用用户 ID 和密码进行身份验证，整个会话由客户端完全控制，没有身份验证或访问令牌。

![Basic Auth](/assets/img/basic-auth.svg)

阅读更多关于基本身份验证方案的信息，请参阅 [MDN 规范](https://developer.mozilla.org/pt-BR/docs/cn/Web/HTTP/Authentication)。

## Installing

要开始使用，请在你的项目中安装 Sisk.BasicAuth 包：

    > dotnet add package Sisk.BasicAuth

你可以在 [Nuget 仓库](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0) 查看更多安装方式。

## Creating your auth handler

你可以为整个模块或单独路由控制身份验证方案。首先，让我们编写第一个基本身份验证处理器。

在下面的示例中，连接到数据库，检查用户是否存在以及密码是否有效，然后将用户存储在上下文包中。

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "To enter this page, please, inform your credentials.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // 在此示例中，我们使用电子邮件作为用户 ID 字段，因此
        // 将使用其电子邮件搜索用户。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Sorry! No user was found by this email.");
        }

        // 验证凭据密码是否对该用户有效。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Invalid credentials.");
        }

        // 将已登录用户添加到 http 上下文
        // 并继续执行
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

然后，只需将此请求处理器与我们的路由或类关联。

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

或使用 [RouterModule](/api/Sisk.Core.Routing.RouterModule) 类：

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // 该类中的所有路由将由
        // UserAuthHandler 处理。
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"Hello, {loggedUser.Name}!";
    }
}
```

## Remarks

基本身份验证的主要责任由客户端承担。存储、缓存控制和加密均在客户端本地处理。服务器仅接收凭据并验证是否允许访问。

请注意，这种方法并不是最安全的，因为它将大量责任放在客户端，可能难以追踪和维护凭据的安全性。此外，密码必须在安全连接上下文（SSL）中传输，因为它们本身没有任何加密。请求头部的简短拦截可能会泄露用户的访问凭据。

对于生产环境中的应用，建议选择更稳健的身份验证方案，并避免使用过多即插即用组件，因为它们可能无法满足项目需求，最终导致安全风险。