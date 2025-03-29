# ロギング

Sisk を設定して、アクセスログとエラーログを自動的に書き込むことができます。ログのローテーション、拡張子、頻度を定義することもできます。

[LogStream](/api/Sisk.Core.Http.LogStream) クラスは、ログを書き込むための非同期的な方法と、待機可能な書き込みキューを提供します。

この記事では、アプリケーションのロギングを設定する方法について説明します。

## ファイルベースのアクセスログ

ファイルにログを書き込むと、ファイルを開き、テキストを書き込み、そしてファイルを閉じます。ログの書き込みレスポンスを維持するために、この手順が採用されています。

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

上記のコードは、すべての受信リクエストを `logs/access.log` ファイルに書き込みます。ファイルが存在しない場合は自動的に作成されますが、フォルダは自動的に作成されません。`logs/` ディレクトリを作成する必要はありません。LogStream クラスが自動的に作成します。

## ストリームベースのロギング

TextWriter オブジェクトのインスタンス (例: `Console.Out`) をコンストラクタに渡すことで、ログファイルを TextWriter オブジェクトに書き込むことができます。

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
        config.AccessLogsStream = new LogStream("logs/access.log");
    })
    .Build();
```

ストリームベースのログの各メッセージの書き込みで、`TextWriter.Flush()` メソッドが呼び出されます。

## アクセスログのフォーマット

定義済みの変数を使用して、アクセスログのフォーマットをカスタマイズできます。次の行を考えてみましょう。

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

次のようなメッセージが書き込まれます。

    29/mar./2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

次の表に従って、ログファイルをフォーマットできます。

| 値  | これは何を表します | 例 |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | 月の日 (2 桁でフォーマット) | 05 |
| %dmmm  | 月の完全な名前 | July |
| %dmm   | 月の略称 (3 文字) | Jul |
| %dm    | 月の番号 (2 桁でフォーマット) | 07 |
| %dy    | 年 (4 桁でフォーマット) | 2023 |
| %th    | 12 時間形式の時間 | 03 |
| %tH    | 24 時間形式の時間 (HH) | 15 |
| %ti    | 分 (2 桁でフォーマット) | 30 |
| %ts    | 秒 (2 桁でフォーマット) | 45 |
| %tm    | ミリ秒 (3 桁でフォーマット) | 123 |
| %tz    | タイムゾーンのオフセット (UTC での合計時間) | +03:00 |
| %ri    | クライアントのリモート IP アドレス | 192.168.1.100 |
| %rm    | HTTP メソッド (大文字) | GET |
| %rs    | URI スキーム (http/https) | https |
| %ra    | URI の権威 (ドメイン) | example.com |
| %rh    | リクエストのホスト | www.example.com |
| %rp    | リクエストのポート | 443 |
| %rz    | リクエストのパス | /path/to/resource |
| %rq    | クエリ文字列 | ?key=value&another=123 |
| %sc    | HTTP 応答ステータスコード | 200 |
| %sd    | HTTP 応答ステータス説明 | OK |
| %lin   | 人間が読みやすいリクエストサイズ | 1.2 KB |
| %linr  | リクエストの生サイズ (バイト) | 1234 |
| %lou   | 人間が読みやすい応答サイズ | 2.5 KB |
| %lour  | 応答の生サイズ (バイト) | 2560 |
| %lms   | 経過時間 (ミリ秒) | 120 |
| %ls    | 実行ステータス | Executed |

## ログのローテーション

> [!TIP]
> Sisk 0.15 以前では、この機能は Sisk.ServiceProvider パッケージでのみ使用できます。Sisk 0.16 以降では、この機能はコアパッケージに実装されています。

ログファイルを特定のサイズに達したときに、圧縮された .gz ファイルにローテーションするように HTTP サーバーを設定できます。サイズは、定義したしきい値で周期的にチェックされます。

```cs
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

上記のコードは、6 時間ごとに LogStream のファイルが 1MB の制限に達したかどうかをチェックします。達した場合は、ファイルを圧縮して .gz ファイルに保存し、`access.log` ファイルをクリーンアップします。

このプロセス中、ファイルへの書き込みはロックされ、圧縮とクリーンアップが完了するまで待機します。書き込みキューに蓄積されたすべての行は、圧縮とクリーンアップが完了するまで待機します。

この機能は、ファイルベースの LogStreams のみで動作します。

## エラーロギング

サーバーがデバッガーにエラーをスローしない場合、エラーはログに書き込まれます。エラーロギングを設定するには、次のコードを使用します。

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

このプロパティは、エラーがコールバックまたは [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) プロパティによってキャッチされていない場合にのみ、ログに何かを書き込みます。

サーバーによって書き込まれるエラーには、常に日付と時刻、リクエストヘッダー (ボディは除く)、エラートレース、および内部例外トレース (存在する場合) が含まれます。

## その他のロギングインスタンス

アプリケーションには、0 個以上の LogStreams が存在できます。LogStreams の数に制限はありません。したがって、デフォルトのアクセスログまたはエラーログ以外のファイルにアプリケーションのログを送信することができます。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("Application started at {0}", DateTime.Now);
```

## LogStream の拡張

LogStream クラスを拡張して、カスタムフォーマットを書き込むことができます。Sisk の現在のログエンジンと互換性があります。以下の例では、Spectre.Console ライブラリを使用して、コンソールにカラフルなメッセージを書き込みます。

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

リクエスト/レスポンスごとにカスタムログを自動的に書き込む別の方法は、[HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) を作成することです。以下の例は、ContextBag と HttpServerHandler を使用して、リクエストとレスポンスのボディを JSON でコンソールに書き込む方法を示しています。

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
            // この時点で、接続は開かれており、クライアントはヘッダーを送信してコンテンツが JSON であることを指定しています。
            // 次の行では、コンテンツを読み取り、リクエストに保存します。
            //
            // リクエストアクションでコンテンツを読み取らない場合、クライアントにレスポンスを送信した後、コンテンツは GC によって収集される可能性があります。
            // したがって、レスポンスを閉じた後、コンテンツは使用できなくなる可能性があります。
            //
            _ = request.RawBody;

            // リクエストにヒントを追加して、JSON ボディが含まれていることを示します。
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
            // CypherPotato.LightJson ライブラリを使用して JSON を整形します。
            var content = result.Request.Body;
            requestJson = JsonValue.Deserialize(content, new JsonOptions() { WriteIndented = true }).ToString();
        }
        
        if (result.Response is { } response)
        {
            var content = response.Content;
            responseMessage = $"{(int)response.Status} {HttpStatusInformation.GetStatusCodeDescription(response.Status)}";
            
            if (content is HttpContent httpContent &&
                // 応答が JSON であることを確認します。
                httpContent.Headers.ContentType?.MediaType?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
            {
                string json = await httpContent.ReadAsStringAsync();
                responseJson = JsonValue.Deserialize(json, new JsonOptions() { WriteIndented = true }).ToString();
            }
        }
        else
        {
            // 内部サーバーハンドリングステータスを取得します。
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