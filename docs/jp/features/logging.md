# ロギング

Siskを設定して、アクセスログとエラーログを自動的に書き込むことができます。ログのローテーション、拡張子、頻度を定義することも可能です。

[LogStream](/api/Sisk.Core.Http.LogStream) クラスは、ログを書き込むための非同期的な方法を提供し、待機可能な書き込みキューを保持します。

この記事では、アプリケーションのロギングを設定する方法を示します。

## ファイルベースのアクセスログ

ログをファイルに書き込むと、ファイルを開き、テキストを書き込み、そしてファイルを閉じます。毎回この手順を実行することで、ログの書き込みを迅速に行うことができます。

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

ログファイルを TextWriter オブジェクトのインスタンス、たとえば `Console.Out` に書き込むことができます。コンストラクタに TextWriter オブジェクトを渡すことで実現できます。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var app = HttpServer.CreateBuilder()
    .UseConfiguration(config => {
        config.AccessLogsStream = new LogStream("logs/access.log");
    })
    .Build();
```

ストリームベースのログでは、`TextWriter.Flush()` メソッドが毎回呼び出されます。

## アクセスログのフォーマット

アクセスログのフォーマットを、事前に定義された変数を使用してカスタマイズすることができます。以下の行を考えてみましょう。

```csharp
config.AccessLogsFormat = "%dd/%dmm/%dy %tH:%ti:%ts %tz %ls %ri %rs://%ra%rz%rq [%sc %sd] %lin -> %lou in %lmsms [%{user-agent}]";
```

これにより、以下のようなメッセージが書き込まれます。

    29/3/2023 15:21:47 -0300 Executed ::1 http://localhost:5555/ [200 OK] 689B -> 707B in 84ms [Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36]

ログファイルをフォーマットするには、以下の表に従ってください。

| 値  | これは何を表します | 例 |
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
| %tz    | 時間帯のオフセット (UTC での合計時間) | +03:00 |
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
| %linr  | リクエストサイズ (バイト) | 1234 |
| %lou   | 人間が読みやすい応答サイズ | 2.5 KB |
| %lour  | 応答サイズ (バイト) | 2560 |
| %lms   | 経過時間 (ミリ秒) | 120 |
| %ls    | 実行ステータス | Executed |

## ログのローテーション

> [!TIP]
> Sisk 0.15 以前では、この機能は Sisk.ServiceProvider パッケージでのみ使用できます。Sisk 0.16 以降では、コアパッケージに実装されています。

ログファイルを特定のサイズに達したときに、圧縮された .gz ファイルにローテーションするように HTTP サーバーを設定できます。サイズは、定義したしきい値で周期的にチェックされます。

```csharp
config.AccessLogsStream = new LogStream("access.log");

var rotater = new RotatingLogPolicy(config.AccessLogsStream);
rotater.Configure(1024 * 1024, TimeSpan.FromHours(6));
```

上記のコードは、6 時間ごとに LogStream のファイルが 1MB の制限に達したかどうかをチェックします。達した場合は、ファイルを圧縮して .gz ファイルに保存し、`access.log` ファイルをクリーンアップします。

このプロセス中、ファイルへの書き込みはロックされます。書き込みキューに追加されたすべての行は、圧縮とクリーンアップが完了するまで待機します。

この機能は、ファイルベースの LogStreams でのみ機能します。

## エラーロギング

サーバーがデバッガーにエラーを投げない場合、エラーはログに書き込まれます。エラーロギングを設定するには、以下のコードを使用します。

```csharp
config.ThrowExceptions = false;
config.ErrorsLogsStream = new LogStream("error.log");
```

このプロパティは、エラーがコールバックまたは [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler) プロパティによってキャプチャされていない場合にのみ、ログに書き込みます。

サーバーによって書き込まれたエラーには、常に日付と時刻、リクエストヘッダー (ボディは除く)、エラートレース、および内部例外トレース (存在する場合) が含まれます。

## その他のロギングインスタンス

アプリケーションには、0 個以上の LogStreams が存在する可能性があります。LogStreams の数に制限はありません。したがって、デフォルトの AccessLog または ErrorLog 以外のファイルにアプリケーションのログを書き込むことができます。

```csharp
LogStream appMessages = new LogStream("messages.log");
appMessages.WriteLine("アプリケーションが {0} に開始されました", DateTime.Now);
```

## LogStream の拡張

LogStream クラスを拡張して、カスタムフォーマットを書き込むことができます。以下の例では、Spectre.Console ライブラリを使用して、コンソールにカラフルなメッセージを書き込みます。

<div class="script-header">
    <span>
        CustomLogStream.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class CustomLogStream : LogStream
{
    protected override void WriteLineInternal(string line)
    {
        base.WriteLineInternal($"[{DateTime.Now:g}] {line}");
    }
}
```

また、[HttpServerHandler](/api/Sisk.Core.Http.Handlers.HttpServerHandler) を作成して、リクエスト/レスポンスごとにカスタムログを自動的に書き込むこともできます。以下の例は、リクエストとレスポンスのボディを JSON でコンソールに出力します。

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

```csharp
class JsonMessageHandler : HttpServerHandler
{
    protected override void OnHttpRequestOpen(HttpRequest request)
    {
        if (request.Method != HttpMethod.Get && request.Headers["Content-Type"]?.Contains("json", StringComparison.InvariantCultureIgnoreCase) == true)
        {
            // この時点で、接続は開かれており、クライアントはヘッダーを送信してコンテンツが JSON であることを示しています。
            // 次の行では、コンテンツを読み取り、リクエストに保存します。
            //
            // リクエストアクションでコンテンツを読み取らない場合、コンテンツはクライアントにレスポンスを送信した後、GC によって収集される可能性があります。
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