# Basic Auth

Basic Auth パッケージは、Sisk アプリケーションで基本認証スキームを処理できるリクエストハンドラを、ほとんど設定や労力なしで追加します。  
基本 HTTP 認証は、ユーザー ID とパスワードによってリクエストを認証する最小限の入力フォームで、セッションはクライアント側でのみ制御され、認証トークンやアクセス トークンは存在しません。

![Basic Auth](/assets/img/basic-auth.svg)

基本認証スキームの詳細は、[MDN specification](https://developer.mozilla.org/pt-BR/docs/jp/Web/HTTP/Authentication) をご覧ください。

## Installing

始めるには、プロジェクトに Sisk.BasicAuth パッケージをインストールします：

```bash
> dotnet add package Sisk.BasicAuth
```

Nuget リポジトリの [Nuget repository](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0) で、インストール方法の詳細を確認できます。

## Creating your auth handler

モジュール全体または個々のルートに対して認証スキームを制御できます。まず、最初の基本認証ハンドラを書いてみましょう。

以下の例では、データベースに接続し、ユーザーが存在し、パスワードが有効かどうかを確認し、その後ユーザーをコンテキストバッグに保存します。

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

        // この例では、メールアドレスをユーザー ID フィールドとして使用しているため、
        // メールアドレスでユーザーを検索します。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Sorry! No user was found by this email.");
        }

        // ユーザーに対してパスワードが有効かどうかを検証します。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Invalid credentials.");
        }

        // ログインしたユーザーを HTTP コンテキストに追加し、実行を継続します。
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

このリクエストハンドラをルートまたはクラスに関連付けるだけです。

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

または、[RouterModule](/api/Sisk.Core.Routing.RouterModule) クラスを使用して：

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // このクラス内のすべてのルートは UserAuthHandler によって処理されます。
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

基本認証の主な責任はクライアント側で行われます。ストレージ、キャッシュ制御、暗号化はすべてクライアント側でローカルに処理されます。サーバーは認証情報を受け取り、アクセスが許可されるかどうかを検証するだけです。

この方法は、クライアントに大きな責任を負わせるため、最も安全な方法ではありません。クライアント側で認証情報を追跡・管理するのは難しく、セキュリティを維持するのが困難です。さらに、パスワードは SSL などの安全な接続コンテキストで送信される必要があります。リクエストヘッダーの簡単な傍受で、ユーザーのアクセス認証情報が漏れる可能性があります。

本番環境のアプリケーションでは、より堅牢な認証ソリューションを選択し、オフ・ザ・シェルフのコンポーネントを多用しないようにしてください。そうしないと、プロジェクトのニーズに適合せず、セキュリティリスクを招く恐れがあります。