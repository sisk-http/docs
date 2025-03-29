# Siskアプリケーションのデプロイ

Siskアプリケーションのデプロイプロセスは、プロジェクトを本番環境に公開することを含みます。プロセスは比較的簡単ですが、デプロイのインフラストラクチャのセキュリティと安定性に致命的な影響を与える可能性のある詳細に注意する価値があります。

理想的には、アプリケーションをテストして準備し、クラウドにデプロイする準備ができているはずです。

## アプリの公開

Siskアプリケーションまたはサービスを公開するには、生成されたバイナリを本番環境で実行するように最適化する必要があります。この例では、.NET Runtimeがインストールされたマシンで実行するために、バイナリを本番環境用にコンパイルします。

アプリをビルドするには、.NET SDKがマシンにインストールされ、ターゲットサーバーに.NET Runtimeがインストールされている必要があります。Linuxサーバー、Windows、Mac OSに.NET Runtimeをインストールする方法については、[ここ](https://learn.microsoft.com/ja-jp/dotnet/core/install/linux)、[ここ](https://learn.microsoft.com/ja-jp/dotnet/core/install/windows?tabs=net70)、[ここ](https://learn.microsoft.com/ja-jp/dotnet/core/install/macos)を参照してください。

プロジェクトが配置されているフォルダーで、ターミナルを開き、.NET公開コマンドを使用します。

```shell
$ dotnet publish -r linux-x64 -c Release
```

これにより、`bin/Release/publish/linux-x64`内にバイナリが生成されます。

> [!NOTE]
> Sisk.ServiceProviderパッケージを使用している場合は、`service-config.json`ファイルをホストサーバーにコピーし、`dotnet publish`によって生成されたすべてのバイナリとともに配置する必要があります。
> ファイルを事前に構成しておくことができます。環境変数、リスニングポート、ホスト、および追加のサーバー構成が含まれます。

次のステップは、これらのファイルをアプリケーションをホストするサーバーに転送することです。

その後、バイナリファイルに実行権限を付与します。この場合、プロジェクト名は「my-app」とします。

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

アプリケーションを実行した後、エラーメッセージが表示されないことを確認します。エラーメッセージが表示されない場合、アプリケーションは実行中です。

この時点では、ファイアウォールなどのアクセス規則が構成されていないため、サーバーの外部ネットワークからアプリケーションにアクセスすることはできないでしょう。次のステップでこれを考慮します。

アプリケーションがリスニングしている仮想ホストのアドレスを持っている必要があります。これは、アプリケーション内で手動で設定され、Siskサービスをインスタンス化する方法に依存します。

Sisk.ServiceProviderパッケージを使用していない場合は、HttpServerインスタンスを定義した場所でこれを見つける必要があります。

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// siskはhttp://localhost:5000/でリスニングする必要があります
```

リスニングホストを手動で関連付ける:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

または、Sisk.ServiceProviderパッケージを使用している場合は、`service-config.json`ファイルで:

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

これから、サービスをリスニングし、トラフィックをオープンネットワークで利用できるようにするためのリバースプロキシを作成できます。

## アプリケーションのプロキシ

サービスをプロキシすることは、Siskサービスを直接外部ネットワークに公開しないことを意味します。この方法は、サーバーのデプロイでは非常に一般的です。

- アプリケーションにSSL証明書を関連付けることができます。
- サービスにアクセスする前にアクセス規則を作成し、過負荷を回避できます。
- 帯域幅とリクエストの制限を制御できます。
- アプリケーションの負荷分散装置を分離できます。
- インフラストラクチャのセキュリティを損なうのを防ぐことができます。

アプリケーションを[Nginx](https://learn.microsoft.com/ja-jp/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx)や[Apache](https://learn.microsoft.com/ja-jp/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0)などのリバースプロキシを介して提供できます。または、[Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/)などのhttp-over-dnsトンネルを使用できます。

また、クライアントの情報 (IPアドレスやホストなど) を取得するために、プロキシの転送ヘッダーを正しく解決することを忘れないでください。[転送解決器](/docs/advanced/forwarding-resolvers)を参照してください。

トンネルを作成し、ファイアウォールの構成を行い、アプリケーションを実行した後、サービスを作成する必要があります。

> [!NOTE]
> 非Windowsシステムでは、Siskサービスで直接SSL証明書を使用することはできません。これは、SiskのHTTPキュー管理を実行するために使用されるHttpListenerの実装によるものであり、オペレーティングシステムによって異なります。IISで仮想ホストに証明書を関連付けることで、SiskサービスでSSLを使用できます。[ここ](https://learn.microsoft.com/ja-jp/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)を参照してください。其他のシステムでは、リバースプロキシを使用することを強くお勧めします。

## サービスの作成

サービスを作成すると、アプリケーションはサーバーインスタンスの再起動やクラッシュ後も常に利用可能になります。

この簡単なチュートリアルでは、前のチュートリアルからのコンテンツを使用して、サービスを常にアクティブに保つ方法を示します。

1. サービス構成ファイルが配置されているフォルダーにアクセスします。

    ```sh
    cd /etc/systemd/system
    ```

2. `my-app.service`ファイルを作成し、次の内容を含めます。
    
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
    Description=<アプリケーションについての説明>

    [Service]
    # サービスを起動するユーザーを設定します
    User=<サービスを起動するユーザー>

    # ExecStartパスはWorkingDirectoryに相対的ではありません。
    # 実行可能ファイルへのフルパスを設定します
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # サービスをクラッシュ時に常に再起動するように設定します
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. サービスマネージャーモジュールを再起動します。

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. サービスファイルの名前でサービスを起動し、実行中であることを確認します。

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. アプリケーションが実行中 ("Active: active") である場合、サービスをシステムの再起動後に実行するように有効にします。
    
    ```sh
    $ sudo systemctl enable my-app
    ```

これで、Siskアプリケーションを公開する準備ができました。