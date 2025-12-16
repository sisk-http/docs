# Windows での名前空間予約の構成

> [!NOTE]
> この構成はオプションであり、Windows で HttpListener エンジンを使用して「localhost」以外のホストで Sisk をリッスンさせたい場合にのみ必要です。

Sisk は HttpListener ネットワークインターフェイスと連携し、仮想ホストをシステムにバインドしてリクエストを待ち受けます。

Windows では、このバインドはやや制限が厳しく、localhost のみが有効なホストとしてバインドできます。他のホストでリッスンしようとすると、サーバー側でアクセス拒否エラーが発生します。このチュートリアルでは、システム上で任意のホストをリッスンできるように権限を付与する方法を説明します。

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

:: プレフィックスをここに挿入してください（スペースや引用符なし）
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

`PREFIX` には、サーバーがリッスンするプレフィックス（「Listening Host->Port」）を指定します。URL スキーム、ホスト、ポート、そして末尾のスラッシュを含む形式で記述する必要があります。例:

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

これにより、アプリケーション側で次のようにリッスンできるようになります:

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