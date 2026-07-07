# ロギング

Sisk を構成して、アクセスログとエラーログを自動的に書き込むことができます。ログのローテーション、拡張子、頻度を定義することが可能です。

[LogStream](/api/Sisk.Core.Http.LogStream) クラスは、非同期的にログを書き込み、await 可能な書き込みキューに保持する方法を提供します。`LogStream` クラスは `IAsyncDisposable` を実装しており、ストリームが閉じられる前に保留中のすべてのログが書き込まれることを保証します。

この記事では、アプリケーションのロギングを構成する方法を示します。

## ファイルベースのアクセスログ

ファイルへのログは、ファイルを開き、行テキストを書き込み、書き込まれた各行ごとにファイルを閉じます。この手順は、ログの書き込み応答性を維持するために採用されました。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseConfiguration(config => {
                config.AccessLogsStream = new LogStream("logs/access.log");
            })
            .Build();
        
        ...
        
        await app.StartAsync();
    }
}
```

上記のコードは、すべての受信リクエストを `logs/access.log` ファイルに書き込みます。ファイルが存在しない場合は自動的に作成されますが、フォルダーは作成されません。`LogStream` クラスが自動的にフォルダーを作成するため、`logs/` ディレクトリを手動で作成する必要はありません。

## ストリームベースのロギング

コンストラクターに `TextWriter` オブジェクトを渡すことで、`Console.Out` などの `TextWriter` インスタンスにログファイルを書き込むことができます。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream(Console.Out);
    })
    .Build();
```

ストリームベースのログに書き込まれる各メッセージについて、`TextWriter.Flush()` メソッドが呼び出されます。

## アクセスログのフォーマット

事前定義された変数でアクセスログのフォーマットをカスタマイズできます。次の行を考えてみてください。

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

次のようなメッセージが書き込まれます。

```
    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]
```

以下の表に記載されたフォーマットでログファイルを整形できます。

| Value  | What it represents                                            | Example                               |
|--------|---------------------------------------------------------------|---------------------------------------|
| %dd    | 月の日（2桁でフォーマット）                                    | 05                                    |
| %dmmm  | 月のフルネーム                                                | July                                  |
| %dmm   | 月の省略名（3文字）                                            | Jul                                   |
| %dm    | 月番号（2桁でフォーマット）                                    | 07                                    |
| %dy    | 年（4桁でフォーマット）                                        | 2023                                  |
| %th    | 12時間制の時間                                                | 03                                    |
| %tH    | 24時間制の時間（HH）                                          | 15                                    |
| %ti    | 分（2桁でフォーマット）                                        | 30                                    |
| %ts    | 秒（2桁でフォーマット）                                        | 45                                    |
| %tm    | ミリ秒（3桁でフォーマット）                                    | 123                                   |
| %tz    | タイムゾーンオフセット（UTCの合計時間）                        | +03:00                                |
| %ri    | クライアントのリモートIPアドレス                               | 192.168.1.100                         |
| %rm    | HTTPメソッド（大文字）                                        | GET                                   |
| %rs    | URIスキーム（http/https）                                    | https                                 |
| %ra    | URIオーソリティ（ドメイン）                                   | example.com                           |
| %rh    | リクエストのホスト                                            | www.example.com                       |
| %rp    | リクエストのポート                                            | 443                                   |
| %rz    | リクエストのパス                                              | /path/to/resource                     |
| %rq    | クエリ文字列                                                  | ?key=value&another=123                |
| %sc    | HTTPレスポンスステータスコード                                 | 200                                   |
| %sd    | HTTPレスポンスステータスの説明                               | OK                                    |
| %lin   | リクエストの人間可読サイズ                                    | 1.2 KB                                |
| %linr  | リクエストの生サイズ（バイト）                                 | 1234                                  |
| %lou   | レスポンスの人間可読サイズ                                    | 2.5 KB                                |
| %lour  | レスポンスの生サイズ（バイト）                                 | 2560                                  |
| %lms   | 経過時間（ミリ秒）                                            | 120                                   |
| %ls    | 実行ステータス                                                | Executed                              |
| %{header-name}    | リクエストの `header-name` ヘッダーを表す。                     | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:header-name}    | レスポンスの `header-name` ヘッダーを表す。                     | `application/json`                    |

`HttpServerConfiguration.DefaultAccessLogFormat` を使用して、デフォルトのアクセスログフォーマットを利用することもできます。

## ログのローテーション

HTTP サーバーを構成して、ログファイルが一定サイズに達したときに圧縮された .gz ファイルにローテーションさせることができます。サイズは、定義したしきい値で定期的にチェックされます。

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

上記のコードは、6 時間ごとに LogStream のファイルが 64 MB の上限に達しているかをチェックします。上限に達していれば、ファイルは .gz に圧縮され、その後 `access.log` が削除されます。

この処理中は、ファイルが圧縮・削除されるまで書き込みがロックされます。この期間に書き込まれようとしたすべての行は、圧縮完了を待つキューに入れられます。

この機能はファイルベースの LogStream のみで動作します。

## エラーロギング

サーバーがデバッガーにエラーを送出しない場合、エラーが存在すればログ書き込みに転送されます。エラー書き込みは次のように構成できます。

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

このプロパティは、エラーがコールバックまたは [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) プロパティで捕捉されていない場合にのみ、ログに何かを書き込みます。

サーバーが書き込むエラーは常に日時、リクエストヘッダー（ボディは除く）、エラートレース、そして内部例外トレース（存在する場合）を記録します。

## その他のロギングインスタンス

アプリケーションはゼロ個または複数の LogStream を持つことができ、ログチャンネルの数に制限はありません。したがって、デフォルトの AccessLog や ErrorLog 以外のファイルにアプリケーションのログを出力することも可能です。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## LogStream の拡張

`LogStream` クラスを拡張して、現在の Sisk ログエンジンと互換性のあるカスタムフォーマットを書き込むことができます。以下の例は、Spectre.Console ライブラリを通じてコンソールにカラフルなメッセージを書き込む方法を示しています。

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

各リクエスト/レスポンスごとにカスタムログを自動的に書き込む別の方法は、[HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) を作成することです。以下の例はやや完全な形です。リクエストとレスポンスの本文を JSON 形式でコンソールに書き込みます。リクエスト全体のデバッグに役立ちます。この例は ContextBag と HttpServerHandler を使用しています。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class Program
{
    static async Task Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host =>
        {
            host.UseListeningPort(5555);
            host.UseHandler<JsonMessageHandler>();
        });

        app.Router.MapAny("/json", request =>
        {
            return new HttpResponse()
                .WithContent(JsonContent.Create(new
                {
                    method = request.Method.Method,
                    path = request.Path,
                    specialMessage = "Hello, world!!"
                }));
        });

        await app.StartAsync();
    }
}
```

<div class="script-header">
    <span>
        JsonMessageHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // この時点で接続はオープンしており、クライアントはコンテンツが JSON であることを示すヘッダーを送信しています。
            // 以下の行はコンテンツを読み取り、リクエストに保持させます。
            //
            // リクエスト処理でコンテンツが読み取られない場合、GC がレスポンス送信後にコンテンツを回収する可能性があり、
            // レスポンスが閉じられた後にコンテンツが利用できなくなることがあります。
            //
            _ = request.RawBody;

            // コンテキストにヒントを追加し、このリクエストが JSON ボディを持つことを示します
            request.Bag.Add("IsJsonRequest", true);
        }
    }

    protected override async void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        string? requestJson = null,
                responseJson = null,
                responseMessage;

        if (result.Request.Bag.ContainsKey("IsJsonRequest"))
        {
            // CypherPotato.LightJson ライブラリを使用して JSON を整形します
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // レスポンスが JSON かどうかをチェック
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // 内部サーバー処理ステータスを取得
            responseMessage = result.Status.ToString();
        }
        
        StringBuilder outputMessage = new StringBuilder();

        if (requestJson != null)
        {
            outputMessage.AppendLine("-----");
            outputMessage.AppendLine($">>> {result.Request.Method} {result.Request.Path}");

            if (requestJson is not null)
                outputMessage.AppendLine(requestJson);
        }

        outputMessage.AppendLine($"<<< {responseMessage}");

        if (responseJson is not null)
            outputMessage.AppendLine(responseJson);

        outputMessage.AppendLine("-----");

        await Console.Out.WriteLineAsync(outputMessage.ToString());
    }
}
```