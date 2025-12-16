# ロギング

Sisk を構成して、アクセスおよびエラー ログを自動的に書き込むことができます。ログのローテーション、拡張子、および頻度を定義することができます。

[LogStream](/api/Sisk.Core.Http.LogStream) クラスは、ログを書き込むための非同期方式を提供し、待機可能な書き込みキューにログを保持します。`LogStream` クラスは `IAsyncDisposable` を実装しており、ストリームを閉じる前にすべての保留中のログを書き込むことを保証します。

この記事では、アプリケーション用のロギングを構成する方法を示します。

## ファイルベースのアクセスログ

ログはファイルを開き、テキスト行を書き込み、そして各行の書き込みごとにファイルを閉じます。この手順は、ログの書き込みレスポンスを維持するために採用されました。

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

上記のコードは、すべての受信リクエストを `logs/access.log` ファイルに書き込みます。ファイルが存在しない場合は自動的に作成されますが、ファイルの前のフォルダーは作成されません。`logs/` ディレクトリを作成する必要はありません。`LogStream` クラスが自動的に作成します。

## ストリームベースのロギング

`TextWriter` オブジェクトのインスタンス (例: `Console.Out`) をコンストラクターに渡すことで、ログ ファイルを `TextWriter` オブジェクトに書き込むことができます。

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

ストリームベースのログの各メッセージについて、`TextWriter.Flush()` メソッドが呼び出されます。

## アクセスログのフォーマット

事前に定義された変数を使用して、アクセス ログのフォーマットをカスタマイズできます。次の行を考えてみましょう。

```cs
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

これにより、次のようなメッセージが書き込まれます。

    29/3/2023 15:21:47 -0300 実行 ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

次の表に従って、ログ ファイルのフォーマットを指定できます。

| 値  | 什么を表す | 例 |
|--------|-----------------------------------------------------------------------------------|---------------------------------------|
| %dd    | 月の日 (2 桁で表記) | 05 |
| %dmmm  | 月の完全な名前 | 7月 |
| %dmm   | 月の略称 (3 文字) | 7月 |
| %dm    | 月 (2 桁で表記) | 07 |
| %dy    | 年 (4 桁で表記) | 2023 |
| %th    | 時間 (12 時間制) | 03 |
| %tH    | 時間 (24 時間制) | 15 |
| %ti    | 分 (2 桁で表記) | 30 |
| %ts    | 秒 (2 桁で表記) | 45 |
| %tm    | ミリ秒 (3 桁で表記) | 123 |
| %tz    | 時間帯オフセット (UTC との差) | +03:00 |
| %ri    | クライアントのリモート IP アドレス | 192.168.1.100 |
| %rm    | HTTP メソッド (大文字) | GET |
| %rs    | URI スキーム (http/https) | https |
| %ra    | URI の権威 (ドメイン) | example.com |
| %rh    | リクエストのホスト | www.example.com |
| %rp    | リクエストのポート | 443 |
| %rz    | リクエストのパス | /path/to/resource |
| %rq    | クエリ文字列 | ?key=value&another=123 |
| %sc    | HTTP 応答ステータス コード | 200 |
| %sd    | HTTP 応答ステータス説明 | OK |
| %lin   | リクエストのサイズ (人間が読みやすい形式) | 1.2 KB |
| %linr  | リクエストのサイズ (バイト) | 1234 |
| %lou   | 応答のサイズ (人間が読みやすい形式) | 2.5 KB |
| %lour  | 応答のサイズ (バイト) | 2560 |
| %lms   | 経過時間 (ミリ秒) | 120 |
| %ls    | 実行ステータス | 実行 |
| %{header-name} | リクエストのヘッダー `header-name` | `Mozilla/5.0 (platform; rv:gecko [...` |
| %{:header-name} | 応答のヘッダー `header-name` | `application/json` |

また、`HttpServerConfiguration.DefaultAccessLogFormat` を使用して、デフォルトのアクセス ログ フォーマットを使用することもできます。

## ログのローテーション

HTTP サーバーを構成して、ログ ファイルを特定のサイズに達したときに圧縮された .gz ファイルにローテーションすることができます。サイズは、定義したしきい値ごとに周期的にチェックされます。

```cs
LogStream errorLog = new LogStream("logs/error.log")
    .ConfigureRotatingPolicy(
        maximumSize: 64 * SizeHelper.UnitMb,
        dueTime: TimeSpan.FromHours(6));
```

上記のコードは、6 時間ごとに LogStream のファイルが 64MB の制限に達したかどうかをチェックします。制限に達した場合、ファイルは圧縮された .gz ファイルに変換され、`access.log` はクリーンアップされます。

このプロセス中、ファイルへの書き込みはロックされ、圧縮とクリーンアップが完了するまで待機します。書き込みキューに蓄積されたすべての行は、圧縮とクリーンアップが完了するまで待機します。

この機能は、ファイルベースの LogStreams でのみ機能します。

## エラーロギング

サーバーがデバッガーにエラーをスローしない場合、エラーはログに書き込まれます。エラーの書き込みを構成するには、次のようになります。

```cs
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

このプロパティは、エラーがコールバックまたは [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) プロパティによってキャッチされていない場合にのみ、ログに書き込みます。

サーバーによって書き込まれたエラーには、常に日付と時刻、リクエスト ヘッダー (本文は除く)、エラー トレース、および内部例外トレース (存在する場合) が含まれます。

## その他のログ インスタンス

アプリケーションには、0 個または複数の LogStreams が存在できます。LogStreams の数に制限はありません。したがって、アプリケーションのログをデフォルトのアクセス ログまたはエラー ログ以外のファイルにリダイレクトすることができます。

```cs
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("アプリケーションが {0} に開始されました", DateTime.Now);
```

## LogStream の拡張

`LogStream` クラスを拡張して、カスタム フォーマットを書き込むことができます。Sisk のログ エンジンと互換性があります。以下の例では、Spectre.Console ライブラリを使用して、コンソールにカラフルなメッセージを書き込みます。

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

また、`HttpServerHandler` を作成することで、各リクエスト/応答についてカスタム ログを自動的に書き込むことができます。以下の例は、リクエストと応答の本文を JSON でコンソールに書き込みます。ContextBag と HttpServerHandler を使用します。

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
            // リクエスト アクションでコンテンツを読み取らない場合、コンテンツはクライアントに応答を送信した後、ガベージ コレクションによって収集される可能性があります。
            // したがって、応答を閉じた後にはコンテンツが利用できない可能性があります。
            //
            _ = request.RawBody;

            // このリクエストには JSON 本文があることを示すヒントをコンテキストに追加します。
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
            // 内部サーバー処理のステータスを取得します。
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