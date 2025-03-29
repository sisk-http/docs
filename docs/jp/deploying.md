# アプリケーションのデプロイ

Sisk アプリケーションのデプロイ プロセスは、プロジェクトを本番環境に公開することです。プロセスは比較的単純ですが、デプロイのインフラストラクチャのセキュリティと安定性に致命的な影響を与える可能性のある詳細に注意する価値があります。

理想的には、アプリケーションをテストして準備し、クラウドにデプロイする準備ができているはずです。

## アプリの公開

Sisk アプリケーションまたはサービスを公開するには、生成されたバイナリを本番環境で実行できるように最適化する必要があります。この例では、.NET Runtime がインストールされたマシンで実行するために、バイナリを本番環境用にコンパイルします。

アプリをビルドするには、.NET SDK をインストールし、ターゲット サーバーに .NET Runtime をインストールする必要があります。Linux サーバー、Windows、Mac OS に .NET Runtime をインストールする方法については、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/linux)、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70)、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/macos)を参照してください。

プロジェクトが配置されているフォルダーで、ターミナルを開き、.NET 公開コマンドを使用します。

```shell
$ dotnet publish -r linux-x64 -c Release
```

これにより、`bin/Release/publish/linux-x64` 内にバイナリが生成されます。

> [!NOTE]
> Sisk.ServiceProvider パッケージを使用してアプリを実行している場合、`service-config.json` ファイルをホスト サーバーにコピーし、`dotnet publish` で生成されたすべてのバイナリとともに配置する必要があります。
> ファイルを事前に構成しておくことができます。環境変数、リスニング ポート、ホスト、および追加のサーバー構成が含まれます。

次のステップは、これらのファイルをアプリケーションをホストするサーバーに移動することです。

次に、バイナリ ファイルに実行権限を付与します。この場合、プロジェクト名は "my-app" です。

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

アプリケーションを実行すると、エラー メッセージが表示されない場合は、アプリケーションが実行中であることを意味します。

この時点では、ファイアウォールなどのアクセス ルールが構成されていないため、アプリケーションに外部ネットワークからアクセスすることはできない可能性があります。次のステップでこれを考慮します。

アプリケーションがリスニングしている仮想ホストのアドレスを持っている必要があります。これは、アプリケーション内で手動で設定され、Sisk サービスをインスタンス化する方法によって異なります。

Sisk.ServiceProvider パッケージを使用していない場合、HttpServer インスタンスを定義した場所でこれを見つける必要があります。

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk は http://localhost:5000/ でリスニングする必要があります
```

リスニング ホストを手動で関連付ける:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

または、Sisk.ServiceProvider パッケージを使用している場合、`service-config.json` 内で:

```json
{
  "Server": { },
  "ListeningHost": {
    "Ports": [
      "http://localhost:5000/"
    ]
  }
}
```

これから、サービスをリスニングし、トラフィックをオープン ネットワークで利用できるようにするために、リバース プロキシを作成できます。

## アプリケーションのプロキシ

サービスをプロキシすることは、Sisk サービスを直接外部ネットワークに公開しないことを意味します。この方法は、サーバー デプロイで非常に一般的です。

- アプリケーションに SSL 証明書を関連付けることができます。
- サービスにアクセスする前にアクセス ルールを作成し、過負荷を回避できます。
- バンド幅とリクエストの制限を制御できます。
- アプリケーションの負荷分散を分離できます。
- インフラストラクチャのセキュリティを損なうのを防ぐことができます。

[Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) または [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0) のようなリバース プロキシを使用してアプリケーションを提供するか、[Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/) のような HTTP-over-DNS トンネルを使用することができます。

また、クライアントの情報 (IP アドレスやホストなど) を取得するために、プロキシの転送ヘッダーを正しく解決することを忘れないでください。[転送ヘッダー解決](/docs/jp/advanced/forwarding-resolvers)を参照してください。

トンネルを作成し、ファイアウォールを構成し、アプリケーションを実行した後、サービスを作成する必要があります。

> [!NOTE]
> 非 Windows システムでは、Sisk サービスで直接 SSL 証明書を使用することはできません。これは、Sisk の HTTP キュー管理の中心となるモジュールである HttpListener の実装によるものであり、オペレーティング システムによって異なります。IIS で仮想ホストに証明書を関連付けることで、Sisk サービスで SSL を使用できます。[ここ](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)を参照してください。その他のシステムでは、リバース プロキシを使用することを強くお勧めします。

## サービスの作成

サービスを作成すると、アプリケーションはサーバー インスタンスの再起動やクラッシュ後も常に利用可能になります。

この簡単なチュートリアルでは、前のチュートリアルからのコンテンツを使用して、サービスを常にアクティブに保つ方法を示します。

1. サービス構成ファイルが配置されているフォルダーにアクセスします。

    ```sh
    cd /etc/systemd/system
    ```

2. `my-app.service` ファイルを作成し、次の内容を含めます。
    
    <div class="script-header">
        <span>
            my-app.service
        </span>
        <span>
            INI
        </span>
    </div>
    
    ```ini
    [Unit]
    Description=<アプリの説明>

    [Service]
    # サービスを起動するユーザーを設定
    User=<サービスを起動するユーザー>

    # ExecStart パスは WorkingDirectory に相対的ではありません。
    # 実行可能ファイルへの完全パスとして設定します
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # サービスを常に再起動するように設定
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. サービス マネージャー モジュールを再起動します。

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. ファイル名に基づいて新しく作成したサービスを開始し、実行中であることを確認します。

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. アプリが実行中 ("Active: active") である場合、サービスをシステムの再起動後に実行するように有効にします。
    
    ```sh
    $ sudo systemctl enable my-app
    ```

これで、Sisk アプリケーションを公開する準備ができました。