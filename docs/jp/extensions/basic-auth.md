# Basic Auth

Basic Authパッケージは、非常に少ない設定と労力で、Siskアプリケーションに基本認証スキームを処理できるリクエストハンドラーを追加します。
Basic HTTP認証は、ユーザーIDとパスワードでリクエストを認証する最小限の入力形式であり、セッションはクライアントによって独占的に制御され、認証またはアクセストークンはありません。

![Basic Auth](/assets/img/basic-auth.svg)

Basic認証スキームについては、[MDNの仕様](https://developer.mozilla.org/pt-BR/docs/jp/Web/HTTP/Authentication)を参照してください。

## インストール

開始するには、プロジェクトにSisk.BasicAuthパッケージをインストールします:

    > dotnet add package Sisk.BasicAuth

プロジェクトにインストールする他の方法については、[Nugetリポジトリ](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0)を参照してください。

## 認証ハンドラーの作成

認証スキームを全モジュールまたは個々のルートに対して制御できます。まず、基本認証ハンドラーを書きましょう。

以下の例では、データベースに接続し、ユーザーが存在するかどうかとパスワードが有効かどうかを確認し、次にユーザーをコンテキストバッグに保存します。

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

        // この場合、ユーザーIDフィールドとしてメールアドレスを使用しているため、メールアドレスでユーザーを検索します。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Sorry! No user was found by this email.");
        }

        // ユーザーのパスワードが有効かどうかを確認します。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Invalid credentials.");
        }

        // ログインしたユーザーをHTTPコンテキストに追加し、実行を続行します。
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

このリクエストハンドラーをルートまたはクラスに紐付けるだけです。

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

または、[RouterModule](/api/Sisk.Core.Routing.RouterModule)クラスを使用します:

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // このクラス内のすべてのルートは、UserAuthHandlerによって処理されます。
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

## 備考

基本認証の主な責任はクライアント側で実行されます。ストレージ、キャッシュ制御、暗号化はすべてクライアント側でローカルに処理され、サーバーは資格情報を受け取り、アクセスが許可されるかどうかを検証するだけです。

この方法は、クライアントに大きな責任を負わせるため、セキュリティの面で最も安全な方法ではありません。さらに、パスワードはSSLなどのセキュアな接続コンテキストで送信される必要があります。リクエストのヘッダーを一時的に傍受するだけで、ユーザーのアクセス資格情報が公開される可能性があります。

本番環境のアプリケーションには、より堅牢な認証ソリューションを選択し、オフザシェルフのコンポーネントを使用しすぎないようにしてください。そうしないと、プロジェクトのニーズに適応できず、セキュリティリスクにさらされる可能性があります。