# サービス プロバイダー

サービス プロバイダーは、Sisk アプリケーションをさまざまな環境に移植するための方法です。ポータブルな構成ファイルを使用して、サーバーのポート、パラメーター、他のオプションを変更できます。アプリケーション コードを変更することなく、環境ごとに異なる設定を使用できます。このモジュールは、Sisk の構築構文に依存しており、`UsePortableConfiguration` メソッドを使用して構成できます。

構成プロバイダーは、`IConfigurationProvider` を実装することで実現され、構成リーダーを提供し、任意の実装を受け取ることができます。デフォルトでは、Sisk では JSON 構成リーダーが提供されていますが、INI ファイル用のパッケージもあります。独自の構成プロバイダーを作成し、次のように登録することもできます。

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

前述のように、デフォルトのプロバイダーは JSON ファイルです。デフォルトでは、`service-config.json` という名前のファイルが検索され、実行中のプロセスのカレント ディレクトリで検索されます。

ファイル名と構成ファイルの検索場所を変更するには、次のようにします。

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

上記のコードは、実行中のプロセスのカレント ディレクトリで `config.toml` ファイルを検索します。如果見つからない場合は、実行可能ファイルのディレクトリで検索します。如果ファイルが存在しない場合は、`createIfDontExists` パラメーターが尊重され、最後にテストされたパス（`lookupDirectories` に基づく）にファイルが作成され、エラーがコンソールに出力され、アプリケーションの初期化が阻止されます。

> [!TIP]
> 
> INI 構成リーダーと JSON 構成リーダーのソース コードを参照して、`IConfigurationProvider` がどのように実装されているかを理解することができます。

## JSON ファイルからの構成の読み取り

デフォルトでは、Sisk では JSON ファイルからの構成の読み取りを提供します。このファイルは固定構造を持ち、次のパラメーターで構成されます:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "My sisk application",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // 構成ファイルでもコメントがサポートされています
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // 0.14 で新しく追加されました
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

構成ファイルから作成されたパラメーターは、サーバーのコンストラクターでアクセスできます:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

各構成リーダーは、サーバーの初期化パラメーターを読み取る方法を提供します。プロセス環境で定義されるべきプロパティ (機密性の高い API データ、API キーなど) がある一方で、構成ファイルで定義されるプロパティもあります。

## 構成ファイルの構造

JSON 構成ファイルは、次のプロパティで構成されます:

<table>
    <thead>
        <tr>
            <th>プロパティ</th>
            <th>必須</th>
            <th>説明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>必須</td>
            <td>サーバー自身とその設定を表します。</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>省略可能</td>
            <td>デフォルトは <code>console</code>。アクセス ログの出力ストリームを指定します。ファイル名、<code>null</code>、または <code>console</code> のいずれかになります。
            </td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。エラー ログの出力ストリームを指定します。ファイル名、<code>null</code>、または <code>console</code> のいずれかになります。
            </td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>省略可能</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>省略可能</td>
            <td>デフォルトは <code>0</code>。コンテンツの最大長をバイト単位で指定します。0 は無制限を意味します。</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>省略可能</td>
            <td>デフォルトは <code>false</code>。HTTP サーバーが <code>X-Request-Id</code> ヘッダーを送信するかどうかを指定します。</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>省略可能</td>
            <td>デフォルトは <code>true</code>。未処理の例外をスローするかどうかを指定します。プロダクション環境では <code>false</code>、デバッグ環境では <code>true</code> に設定します。</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>必須</td>
            <td>サーバーのリスニング ホストを表します。</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>省略可能</td>
            <td>アプリケーションのラベルを表します。</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>必須</td>
            <td><a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> 構文に一致する文字列の配列を表します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>省略可能</td>
            <td>アプリケーションの CORS ヘッダーを設定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>省略可能</td>
            <td>デフォルトは <code>false</code>。<code>Allow-Credentials</code> ヘッダーを指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。文字列の配列を期待します。<code>Expose-Headers</code> ヘッダーを指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。文字列を期待します。<code>Allow-Origin</code> ヘッダーを指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。文字列の配列を期待します。複数の <code>Allow-Origin</code> ヘッダーを指定します。詳細については、<a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> を参照してください。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。文字列の配列を期待します。<code>Allow-Methods</code> ヘッダーを指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。文字列の配列を期待します。<code>Allow-Headers</code> ヘッダーを指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>省略可能</td>
            <td>デフォルトは <code>null</code>。整数を期待します。<code>Max-Age</code> ヘッダーを秒単位で指定します。</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>省略可能</td>
            <td>アプリケーションの設定メソッドに提供されるプロパティを指定します。</td>
        </tr>
    </tbody>
</table>