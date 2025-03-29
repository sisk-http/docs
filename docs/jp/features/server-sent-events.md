# サーバー送信イベント

Sisk では、サーバー送信イベントを使用してメッセージを送信することができます。使用可能な機能として、使い捨ておよび永続的な接続を作成し、実行時に接続を取得し、使用することができます。

この機能には、ブラウザによって課せられた制限があります。たとえば、テキスト メッセージのみを送信でき、接続を永久に閉じることはできません。サーバー側で接続を閉じると、クライアントは 5 秒ごと (一部のブラウザでは 3 秒ごと) に再接続を試みます。

これらの接続は、クライアントが情報を毎回要求することなく、サーバーからクライアントへのイベントを送信するのに役立ちます。

## SSE 接続の作成

SSE 接続は、通常の HTTP リクエストと同様に機能しますが、レスポンスを送信してすぐに接続を閉じるのではなく、メッセージを送信するために接続を開いたままにします。

[HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) メソッドを呼び出すと、リクエストは待機状態になり、SSE インスタンスが作成されます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

上記のコードでは、SSE 接続を作成し、「Hello, world」メッセージを送信し、次にサーバー側で SSE 接続を閉じます。

> [!NOTE]
> サーバー側で接続を閉じると、クライアントはデフォルトで再接続を試み、接続が再開され、メソッドが再実行されます。
>
> サーバー側で接続を閉じたときに、終了メッセージをクライアントに送信することが一般的です。そうすることで、クライアントが再接続を試みるのを防ぐことができます。

## ヘッダーの追加

ヘッダーを送信する必要がある場合は、[HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) メソッドを使用できます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

ヘッダーを送信する前にメッセージを送信する必要があります。

## Wait-For-Fail 接続

接続は通常、サーバーがメッセージを送信できなくなったときに終了されます。再接続しても、クラスのインスタンスは機能しません。クラスのインスタンスは、前の接続にリンクされているためです。

一部の状況では、後でこの接続が必要になる場合があり、ルートのコールバック メソッドを介して管理することはできません。

このため、SSE 接続に識別子を割り当てて、後でそれを使用して接続を取得することができます。さらに、[WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) を使用して、ルートを終了せずに接続を自動的に終了することができます。

KeepAlive の SSE 接続は、送信エラー (切断によって発生) が発生するまで待機します。タイムアウトを設定することもできます。タイムアウト後、メッセージが送信されていない場合、接続は終了され、実行が再開されます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
    var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // 15 秒間メッセージが送信されない場合、接続を終了する

    return sse.Close();
});
```

上記のメソッドは、接続を作成し、接続を処理し、切断またはエラーを待機します。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 接続はまだアクティブです
    evs.Send("Hello again!");
}
```

上記のコードは、新しく作成された接続を検索し、存在する場合はメッセージを送信します。

すべてのアクティブなサーバー接続は、[HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) コレクションに格納されます。このコレクションには、有効で識別可能な接続のみが格納されます。終了した接続はコレクションから削除されます。

> [!NOTE]
> KeepAlive には、Sisk に接続されている可能性のあるコンポーネント (Web プロキシ、HTTP カーネル、ネットワーク ドライバーなど) によって制限が課せられることがあります。これらのコンポーネントは、アイドル状態の接続を一定期間後に閉じます。
>
> したがって、接続をオープンしたままに保つために、周期的な ping メッセージを送信するか、接続が閉じられるまでの最大時間を延長することが重要です。周期的な ping メッセージの送信については、次のセクションを参照してください。

## 接続の ping ポリシーの設定

ping ポリシーは、クライアントに周期的なメッセージを送信する自動化された方法です。この機能により、サーバーは接続を開いたままに保つことなく、クライアントが切断されたことを検出できます。

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
    var sse = request.GetEventSource();
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });

    sse.KeepAlive();
    return sse.Close();
}
```

上記のコードでは、5 秒ごとに新しい ping メッセージがクライアントに送信され、TCP 接続がアクティブのままになり、アイドル状態によって閉じられるのを防ぎます。さらに、メッセージの送信に失敗すると、接続は自動的に閉じられ、接続で使用されるリソースが解放されます。

## 接続の検索

接続識別子に基づいて、有効な接続を検索できます。たとえば、ブロードキャストを行う場合などに使用できます。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("すべてのイベント ソースにブロードキャストします (my-connection- で始まる)");
}
```

また、[All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) メソッドを使用して、すべてのアクティブな SSE 接続を取得することもできます。