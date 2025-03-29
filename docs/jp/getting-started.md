# Sisk の開始方法

Sisk は、任意の .NET 環境で実行できます。このガイドでは、.NET を使用して Sisk アプリケーションを作成する方法を説明します。まだインストールしていない場合は、SDK を [こちら](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) からダウンロードしてください。

このチュートリアルでは、プロジェクト構造の作成、リクエストの受信、URL パラメータの取得、レスポンスの送信について説明します。このガイドでは、C# を使用してシンプルなサーバーを構築することに焦点を当てています。他のプログラミング言語も使用できます。

> [!NOTE]
> クイックスタート プロジェクトに興味がある場合は、[このリポジトリ](https://github.com/sisk-http/quickstart) を参照してください。

## プロジェクトの作成

プロジェクト名を "My Sisk Application" とします。.NET を設定したら、次のコマンドを使用してプロジェクトを作成できます。

```bash
dotnet new console -n my-sisk-application
```

次に、プロジェクト ディレクトリに移動して、.NET ユーティリティ ツールを使用して Sisk をインストールします。

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Sisk をプロジェクトにインストールするその他の方法については、[こちら](https://www.nuget.org/packages/Sisk.HttpServer/) を参照してください。

さて、HTTP サーバーのインスタンスを作成しましょう。この例では、ポート 5000 でリッスンするように構成します。

## HTTP サーバーの構築

Sisk では、アプリケーションを手動で段階的に構築できます。ただし、これは大多数のプロジェクトにとって便利ではありません。したがって、ビルダー メソッドを使用して、アプリケーションを簡単に起動できます。

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
            .UseListeningPort("http://localhost:5000/")
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

Sisk の各重要なコンポーネントを理解することが重要です。このドキュメントの後半では、Sisk のしくみについてさらに学習します。

## 手動 (高度な) 設定

Sisk のメカニズムの詳細については、[このセクション](/docs/advanced/manual-setup) のドキュメントを参照してください。ここでは、HttpServer、Router、ListeningPort、他のコンポーネントの動作と関係について説明します。