# Basic Auth

Basic Auth パッケージは、非常に少ない設定と労力で、Sisk アプリケーションに基本認証スキームを処理できるリクエスト ハンドラーを追加します。
Basic HTTP 認証は、ユーザー ID とパスワードでリクエストを認証する最小限の入力形式であり、セッションはクライアントによって完全に制御され、認証またはアクセス トークンはありません。

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

Basic 認証スキームについては、[MDN の仕様](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication)を参照してください。

## インストール

開始するには、プロジェクトに Sisk.BasicAuth パッケージをインストールします:

    > dotnet add package Sisk.BasicAuth

インストール方法については、[Nuget リポジトリ](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0)を参照してください。

## 認証ハンドラーの作成

認証スキームをモジュール全体または個々のルートに対して制御できます。まず、基本認証ハンドラーを作成しましょう。

以下の例では、データベースに接続して、ユーザーが存在するかどうかとパスワードが有効かどうかを確認し、次にユーザーをコンテキスト バッグに保存します。

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

        // この場合、ユーザー ID フィールドとしてメールアドレスを使用しているため、メールアドレスでユーザーを検索します。
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("ユーザーが見つかりませんでした。");
        }

        // 資格情報のパスワードがこのユーザーに対して有効かどうかを確認します。
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("無効な資格情報です。");
        }

        // ログインしたユーザーを HTTP コンテキストに追加し、実行を続行します。
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

このリクエスト ハンドラーをルートまたはクラスに関連付けます。

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

または、[RouterModule](/api/Sisk.Core.Routing.RouterModule) クラスを使用します:

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

基本認証の主な責任は、クライアント側で実行されます。ストレージ、キャッシュ制御、暗号化はすべて、クライアント側でローカルに処理されます。サーバーは、資格情報を受け取り、許可されているかどうかを検証するだけです。

この方法は、クライアントに重大な責任を負わせるため、最も安全な方法ではありません。さらに、クライアントの資格情報のセキュリティを維持することは困難です。また、パスワードは、固有の暗号化がないため、セキュアな接続コンテキスト (SSL) で送信される必要があります。リクエストのヘッダーを一時的に傍受すると、ユーザーのアクセス資格情報が公開される可能性があります。

本番環境のアプリケーションでは、より堅牢な認証ソリューションを選択し、オフザシェルフ コンポーネントの使用を避けてください。そうしないと、セキュリティ リスクにさらされる可能性があります。