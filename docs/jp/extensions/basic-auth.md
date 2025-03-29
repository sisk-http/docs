# Basic Auth

Basic Auth パッケージは、非常に少ない設定と労力で、Sisk アプリケーションで基本認証スキームを処理できるリクエスト ハンドラーを追加します。
Basic HTTP 認証は、ユーザー ID とパスワードでリクエストを認証する最小限の入力形式であり、セッションはクライアントによって完全に制御され、認証またはアクセス トークンはありません。

<img src="https://developer.mozilla.org/pt-BR/docs/jp/Web/HTTP/Authentication/httpauth.png">

Basic 認証スキームについては、[MDN の仕様](https://developer.mozilla.org/pt-BR/docs/jp/Web/HTTP/Authentication)を参照してください。

## インストール

開始するには、プロジェクトに Sisk.BasicAuth パッケージをインストールします:

    > dotnet add package Sisk.BasicAuth

プロジェクトにインストールする他の方法については、[Nuget リポジトリ](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0)を参照してください。

## 認証ハンドラーの作成

認証スキームをモジュール全体または個々のルートに対して制御できます。まず、基本認証ハンドラーを作成しましょう。

以下の例では、データベースに接続して、ユーザーが存在し、パスワードが有効であるかどうかを確認し、次にユーザーをコンテキスト バッグに保存します。

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "このページにアクセスするには、資格情報を入力してください。";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // この場合、ユーザー ID フィールドとして電子メールを使用しているため、電子メールでユーザーを検索します。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("ユーザーが見つかりませんでした。");
        }

        // 資格情報のパスワードがこのユーザーに対して有効であることを確認します。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("資格情報が無効です。");
        }

        // ログインしたユーザーを HTTP コンテキストに追加し、実行を続行します。
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

これで、このリクエスト ハンドラーをルートまたはクラスに関連付けるだけです。

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "こんにちは、" + loggedUser.Name + "!";
    }
}
```

または、[RouterModule](/api/Sisk.Core.Routing.RouterModule) クラスを使用することもできます:

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // このクラス内のすべてのルートは、UserAuthHandler によって処理されます。
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "こんにちは、" + loggedUser.Name + "!";
    }
}
```

## 備考

基本認証の主な責任はクライアント側で実行されます。ストレージ、キャッシュ制御、暗号化はすべてクライアント側でローカルに処理され、サーバーは資格情報を受け取り、許可されたアクセスかどうかを検証するだけです。

この方法は、クライアントに大きな責任を負わせるため、セキュリティの面で最も安全な方法ではありません。さらに、パスワードは SSL のようなセキュアな接続コンテキストで送信される必要があります。なぜなら、パスワードには固有の暗号化がないからです。リクエストのヘッダーを一時的に傍受するだけで、ユーザーのアクセス資格情報が公開される可能性があります。

本番環境のアプリケーションでは、より堅牢な認証ソリューションを選択し、オフザシェルフのコンポーネントを使用しすぎないようにしてください。そうしないと、プロジェクトがセキュリティ リスクにさらされる可能性があります。