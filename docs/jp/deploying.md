# アプリケーションのデプロイ

Sisk アプリケーションのデプロイ プロセスは、プロジェクトを本番環境に公開することです。プロセスは比較的簡単ですが、セキュリティと安定性のために重要な詳細があります。

理想的には、アプリケーションをテストして準備し、クラウドにデプロイする準備ができているはずです。

## アプリの公開

Sisk アプリケーションまたはサービスを公開するには、生成されたバイナリを本番環境で実行できるようにします。この例では、.NET Runtime がインストールされたマシンで実行するために、バイナリを本番環境用にコンパイルします。

アプリをビルドするには、.NET SDK がインストールされている必要があります。また、ターゲット サーバーに .NET Runtime がインストールされている必要があります。Linux、Windows、Mac OS の .NET Runtime のインストール方法については、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/linux) 、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70) 、[ここ](https://learn.microsoft.com/en-us/dotnet/core/install/macos) を参照してください。

プロジェクトが配置されているフォルダーで、ターミナルを開き、.NET 公開コマンドを使用します。

```shell
$ dotnet publish -r linux-x64 -c Release
```

これにより、`bin/Release/publish/linux-x64` 内にバイナリが生成されます。

> [!NOTE]
> Sisk.ServiceProvider パッケージを使用している場合は、`service-config.json` ファイルをホスト サーバーにコピーする必要があります。環境変数、リスニング ポート、ホスト、および追加のサーバー構成を含むファイルを事前に構成しておくことができます。

次のステップは、これらのファイルをアプリケーションをホストするサーバーに転送することです。

その後、バイナリ ファイルに実行権限を付与します。この場合、プロジェクト名は "my-app" です。

```shell
$ cd /home/htdocs
$ chmod +x my-app
$ ./my-app
```

アプリケーションを実行すると、エラー メッセージが表示されない場合は、アプリケーションが実行中であることを確認できます。

この時点では、ファイアウォールなどのアクセス ルールが構成されていないため、アプリケーションに外部ネットワークからアクセスすることはできないでしょう。次のステップでこれを考慮します。

アプリケーションがリスニングしている仮想ホストのアドレスを持っている必要があります。これは、アプリケーションで Sisk サービスをインスタンス化する方法によって異なります。

Sisk.ServiceProvider パッケージを使用していない場合は、HttpServer インスタンスを定義した場所でこれを見つけることができます。

```cs
HttpServer server = HttpServer.Emit(5000, out HttpServerConfiguration config, out var host, out var router);
// sisk は http://localhost:5000/ でリスニングする必要があります
```

リスニング ホストを手動で関連付ける:

```cs
config.ListeningHosts.Add(new ListeningHost("https://localhost:5000/", router));
```

または、Sisk.ServiceProvider パッケージを使用している場合は、`service-config.json` 内で:

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

サービスをプロキシすることは、Sisk サービスを直接外部ネットワークに公開しないことを意味します。この方法は、サーバーのデプロイでは非常に一般的です。

- アプリケーションに SSL 証明書を関連付けることができます。
- サービスにアクセスする前にアクセス ルールを作成し、過負荷を回避できます。
- バンド幅とリクエストの制限を制御できます。
- アプリケーションの負荷分散装置を分離できます。
- インフラストラクチャのセキュリティを損なうことを防ぐことができます。

アプリケーションをリバース プロキシを使用して提供できます。たとえば、[Nginx](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-7.0&tabs=linux-ubuntu#install-nginx) または [Apache](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-7.0) を使用できます。または、[Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/) などの HTTP-over-DNS トンネルを使用することもできます。

また、プロキシの転送ヘッダーを正しく解決して、クライアントの情報 (IP アドレスやホストなど) を取得するために、[転送解決器](/docs/jp/advanced/forwarding-resolvers) を使用することを忘れないでください。

トンネルを作成し、ファイアウォールを構成し、アプリケーションを実行した後、サービスを作成する必要があります。

> [!NOTE]
> 非 Windows システムでは、Sisk サービスで直接 SSL 証明書を使用することはできません。これは、Sisk で HTTP キュー管理を行う中央モジュールである HttpListener の実装によるものであり、オペレーティング システムによって異なります。IIS で仮想ホストに証明書を関連付けることで、Sisk サービスで SSL を使用できます。詳細については、[ここ](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) を参照してください。その他のシステムでは、リバース プロキシを使用することを強くお勧めします。

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
    Description=<アプリケーションについての説明>

    [Service]
    # サービスを起動するユーザーを設定します。
    User=<サービスを起動するユーザー>

    # ExecStart パスは、WorkingDirectory に相対ではありません。
    # 実行可能ファイルへの完全パスを設定します。
    WorkingDirectory=/home/htdocs
    ExecStart=/home/htdocs/my-app

    # サービスを常に再起動するように設定します。
    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target
    ```

3. サービス マネージャー モジュールを再起動します。

    ```sh
    $ sudo systemctl daemon-reload
    ```

4. 作成したサービスを名前で起動し、実行中であることを確認します。

    ```sh
    $ sudo systemctl start my-app
    $ sudo systemctl status my-app
    ```

5. アプリケーションが実行中 ("Active: active") であることを確認したら、サービスをシステムの再起動後に実行するように有効にします。
    
    ```sh
    $ sudo systemctl enable my-app
    ```

これで、Sisk アプリケーションを公開する準備ができました。