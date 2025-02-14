# 基本身份验证

基本身份验证包添加了一个请求处理程序，能够处理基本身份验证方案，并且只需进行很少的配置和努力即可在您的 Sisk 应用程序中使用。
基本 HTTP 身份验证是一种最小的输入形式，通过用户 ID 和密码对请求进行身份验证，会话完全由客户端控制，并且没有身份验证或访问令牌。

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

更多关于基本身份验证方案的信息，请参阅 [MDN 规范](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication)。

## 安装

要开始使用，请在您的项目中安装 Sisk.BasicAuth 包：

    > dotnet add package Sisk.BasicAuth

您可以在 [Nuget 存储库](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0) 中查看更多关于如何在您的项目中安装它的信息。

## 创建身份验证处理程序

您可以控制整个模块或个别路由的身份验证方案。为此，让我们首先编写第一个基本身份验证处理程序。

在以下示例中，连接到数据库，检查用户是否存在以及密码是否有效，然后将用户存储在上下文包中。

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "要进入此页面，请提供您的凭据。";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // 在这种情况下，我们使用电子邮件作为用户 ID 字段，因此我们将使用电子邮件查找用户。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("抱歉！没有找到此电子邮件的用户。");
        }

        // 验证此用户的凭据密码是否有效。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("无效的凭据。");
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
        return "您好，" + loggedUser.Name + "!";
    }
}
```

或者使用 [RouterModule](/api/Sisk.Core.Routing.RouterModule) 类：

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // 现在此类中的所有路由都将由 UserAuthHandler 处理。
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "您好，" + loggedUser.Name + "!";
    }
}
```

## 备注

基本身份验证的主要责任由客户端承担。存储、缓存控制和加密都在客户端本地处理。服务器只接收凭据并验证是否允许访问。

请注意，此方法不是最安全的，因为它将大量责任放在客户端上，客户端可能难以跟踪和维护其凭据的安全性。另外，密码必须在安全连接上下文（SSL）中传输，因为它们没有内置加密。请求头的简短拦截可能会暴露用户的访问凭据。

对于生产环境中的应用程序，请选择更强大的身份验证解决方案，并避免使用太多现成的组件，因为它们可能无法适应项目的需求，最终会使其暴露于安全风险之中。