# INI 構成プロバイダー

Sisk には、JSON 以外の起動構成を取得する方法があります。実際には、[IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) を実装する任意のパイプラインを使用して、[PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder) でサーバーの構成を任意のファイル タイプから読み取ることができます。

[Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/) パッケージでは、一般的な構文エラーに対して例外をスローしないストリーム ベースの INI ファイル リーダーと、シンプルな構成構文が提供されます。このパッケージは、Sisk フレームワークの外部で使用でき、効率的な INI ドキュメント リーダーが必要なプロジェクトに柔軟性を提供します。

## インストール

パッケージをインストールするには、次のコマンドから始めることができます。

```bash
$ dotnet add package Sisk.IniConfiguration
```

また、INI [IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader) や Sisk 依存関係を含まないコア パッケージもインストールできます。

```bash
$ dotnet add package Sisk.IniConfiguration.Core
```

メイン パッケージを使用すると、次の例のようにコードで使用できます。

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);
                
                // IniConfigurationReader 構成リーダーを使用
                config.WithConfigurationPipeline<IniConfigurationReader>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();
        
        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hello, {name}!");
    }
}
```

上記のコードは、プロセスの現在のディレクトリ (CurrentDirectory) にある app.ini ファイルを探します。INI ファイルの内容は次のとおりです。

```ini
[Server]
# 複数のリスニング アドレスがサポートされています
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## INI フレーバーと構文

現在の実装フレーバー:

- プロパティとセクション名は **大文字小文字を区別しません**。
- プロパティ名と値は **トリミングされます**、ただし値が引用符で囲まれている場合は除きます。
- 値は単一引用符または二重引用符で囲むことができます。引用符内には改行を含めることができます。
- コメントは `#` と `;` でサポートされます。**末尾のコメントも許可されます**。
- プロパティには複数の値を指定できます。

詳細については、Sisk で使用されている INI パーサーの "フレーバー" のドキュメントが [こちら](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md) にあります。

次の INI コードを例として使用します。

```ini
One = 1
Value = this is an value
Another value = "this value
    has an line break on it"

; 次のコードにはいくつかの色があります
[some section]
Color = Red
Color = Blue
Color = Yellow ; 黄色は使用しないでください
```

これを次のように解析します。

```csharp
// INI テキストを文字列から解析
IniDocument doc = IniDocument.FromString(iniText);

// 1 つの値を取得
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// 複数の値を取得
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## 構成パラメーター

| セクションと名前 | 複数の値を許可 | 説明 |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | はい | サーバーのリスニング アドレス/ポート。 |
| `Server.Encoding` | いいえ | サーバーの既定のエンコード。 |
| `Server.MaximumContentLength` | いいえ | サーバーの最大コンテンツ長 (バイト単位)。 |
| `Server.IncludeRequestIdHeader` | いいえ | HTTP サーバーが X-Request-Id ヘッダーを送信するかどうかを指定します。 |
| `Server.ThrowExceptions` | いいえ | 処理されていない例外をスローするかどうかを指定します。 |
| `Server.AccessLogsStream` | いいえ | アクセス ログの出力ストリームを指定します。 |
| `Server.ErrorsLogsStream` | いいえ | エラー ログの出力ストリームを指定します。 |
| `Cors.AllowMethods` | いいえ | CORS Allow-Methods ヘッダー値を指定します。 |
| `Cors.AllowHeaders` | いいえ | CORS Allow-Headers ヘッダー値を指定します。 |
| `Cors.AllowOrigins` | いいえ | 複数の Allow-Origin ヘッダーを指定します (カンマで区切られます)。[AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) に関する詳細情報。 |
| `Cors.AllowOrigin` | いいえ | 1 つの Allow-Origin ヘッダーを指定します。 |
| `Cors.ExposeHeaders` | いいえ | CORS Expose-Headers ヘッダー値を指定します。 |
| `Cors.AllowCredentials` | いいえ | CORS Allow-Credentials ヘッダー値を指定します。 |
| `Cors.MaxAge` | いいえ | CORS Max-Age ヘッダー値を指定します。 |