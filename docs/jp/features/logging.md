# ロギング

Sisk を設定してアクセスログとエラーログを書き込むように自動で構成できます。ログローテーション、拡張子、頻度を定義することも可能です。

[LogStream](/api/Sisk.Core.Http.LogStream) クラスは、ログを書き込む非同期方法を提供し、待機可能な書き込みキューに保持します。

この記事では、アプリケーションのロギングを構成する方法を示します。

## ファイルベースのアクセスログ

ファイルにログを書き込む際は、ファイルを開き、行テキストを書き込み、書き込みごとにファイルを閉じます。この手順は、ログの書き込み応答性を維持するために採用されました。

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
        
        …
        
        await app.StartAsync();
    }
}
```

上記のコードは、すべての受信リクエストを `logs/access.log` ファイルに書き込みます。ファイルが存在しない場合は自動的に作成されますが、フォルダーは作成されません。`logs/` ディレクトリを作成する必要はありません。LogStream クラスが自動的に作成します。

## ストリームベースのロギング

TextWriter オブジェクト（例：`Console.Out`）にログファイルを書き込むには、コンストラクタに TextWriter オブジェクトを渡します。

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

ストリームベースのログに書き込まれるすべてのメッセージで、`TextWriter.Flush()` メソッドが呼び出されます。

## アクセスログのフォーマット

アクセスログのフォーマットは、事前定義された変数でカスタマイズできます。次の行を考えてみてください。

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

これにより、次のようなメッセージが書き込まれます。

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

フォーマットは次の表で説明される形式でログファイルを整形できます。

| Value  | 何を表すか                                                                 | 例 |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | 月の日（2桁）                                                                    | 05 |
| %dmmm  | 月のフルネーム                                                                    | July |
| %dmm   | 月の省略名（3文字）                                                                | Jul |
| %dm    | 月番号（2桁）                                                                      | 07 |
| %dy    | 年（4桁）                                                                            | 2023 |
| %th    | 12時間表記の時間                                                                    | 03 |
| %tH    | 24時間表記の時間（HH）                                                              | 15 |
| %ti    | 分（2桁）                                                                            | 30 |
| %ts    | 秒（2桁）                                                                            | 45 |
| %tm    | ミリ秒（3桁）                                                                          | 123 |
| %tz    | タイムゾーンオフセット（UTC 時間）                                                    | +03:00 |
| %ri    | クライアントのリモート IP アドレス                                                    | 192.168.1.100 |
| %rm    | HTTP メソッド（大文字）                                                              | GET |
| %rs    | URI スキーム（http/https）                                                            | https |
| %ra    | URI 権限（ドメイン）                                                                | example.com |
| %rh    | リクエストのホスト                                                                    | www.example.com |
| %rp    | リクエストのポート                                                                    | 443 |
| %rz    | リクエストのパス                                                                    | /path/to/resource |
| %rq    | クエリ文字列                                                                          | ?key=value&another=123 |
| %sc    | HTTP 応答ステータスコード                                                              | 200 |
| %sd    | HTTP 応答ステータス説明                                                                | OK |
| %lin   | リクエストの人間が読めるサイズ                                                          | 1.2 KB |
| %linr  | リクエストの生サイズ（バイト）                                                          | 1234 |
| %lou   | 応答の人間が読めるサイズ                                                                | 2.5 KB |
| %lour  | 応答の生サイズ（バイト）                                                                | 2560 |
| %lms   | ミリ秒単位の経過時間                                                                    | 120 |
| %ls    | 実行ステータス                                                                          | Executed |
| %{header-name} | リクエストの `header-name` ヘッダーを表す。                                                | `Mozilla/5.0 (platform; rv:gecko [...]` |
| %{:res-name} | 応答の `res-name` ヘッダーを表す。 | |

## ローテーションログ

HTTP サーバーを構成して、ログファイルが一定サイズに達したら圧縮された .gz ファイルにローテーションすることができます。サイズは、定義した閾値で定期的にチェックされます。

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

上記のコードは、6 時間ごとに LogStream のファイルが 64MB に達したかどうかを確認します。達した場合、ファイルは .gz ファイルに圧縮され、`access.log` がクリアされます。

このプロセス中、ファイルへの書き込みはファイルが圧縮されクリアされるまでロックされます。この期間に書き込まれるすべての行は、圧縮が終了するまでキューに入れられます。

この機能はファイルベースの LogStream でのみ動作します。

## エラーロギング

サーバーがデバッガーにエラーをスローしない場合、エラーがあるときにログ書き込みに転送されます。エラー書き込みを構成するには次のようにします。

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

このプロパティは、エラーがコールバックまたは [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) によってキャプチャされない場合にのみログに書き込みます。

サーバーが書き込むエラーは、常に日付と時刻、リクエストヘッダー（本文は除く）、エラートレース、および内部例外トレース（あれば）を書き込みます。

## その他のロギングインスタンス

アプリケーションはゼロまたは複数の LogStream を持つことができ、ログチャネルの数に制限はありません。したがって、デフォルトの AccessLog または ErrorLog 以外のファイルにアプリケーションのログを送ることが可能です。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## LogStream の拡張

`LogStream` クラスを拡張して、現在の Sisk ログエンジンと互換性のあるカスタムフォーマットを書き込むことができます。以下の例では、Spectre.Console ライブラリを使用してコンソールにカラフルなメッセージを書き込みます。

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

各リクエスト/レスポンスに対して自動的にカスタムログを書き込むもう一つの方法は、[HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) を作成することです。以下の例は少し完成度が高く、リクエストとレスポンスの本文を JSON でコンソールに書き込みます。これは一般的なリクエストのデバッグに役立ちます。この例では ContextBag と HttpServerHandler を使用しています。

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

        app.Router += new Route(RouteMethod.Any, "/json", request =>
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
            // ここで接続が開かれ、クライアントが JSON コンテンツであることを指定するヘッダーを送信した状態です。
            // 以下の行はコンテンツを読み取り、リクエストに保持します。
            //
            // コンテンツがリクエストアクションで読み取られない場合、GC はレスポンス送信後にコンテンツを収集する可能性があるため、レスポンスが閉じられた後にコンテンツが利用できない場合があります。
            //
            _ = request.RawBody;

            // このリクエストに JSON 本文があることを示すヒントをコンテキストに追加
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
            // CypherPotato.LightJson ライブラリを使用して JSON を再フォーマット
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // レスポンスが JSON かどうか確認
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