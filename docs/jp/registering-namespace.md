# Windowsでの名前空間予約の設定

Siskは、HttpListenerネットワークインターフェイスを使用して、仮想ホストをシステムにバインドし、リクエストを待ち受けます。

Windowsでは、このバインドは少し制限的で、localhostのみが有効なホストとしてバインドされます。他のホストを待ち受けようとすると、サーバーでアクセス拒否エラーが発生します。このチュートリアルでは、システムで任意のホストを待ち受けられるようにするための認可を付与する方法について説明します。

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
@echo off

:: ここにプレフィックスを入力してください (スペースや引用符なし)
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

ここで、`PREFIX`は、サーバーが待ち受けするプレフィックス ("リスニングホスト->ポート") です。URLスキーム、ホスト、ポート、末尾のスラッシュで構成される必要があります。例:

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://my-application.example.test/
```

これにより、アプリケーションを介して待ち受けできるようになります:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://my-application.example.test/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hello, world!")
            };
        });

        await app.StartAsync();
    }
}
```