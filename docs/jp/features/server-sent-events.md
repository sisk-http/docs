# サーバー送信イベント

Sisk は、Server Sent Events を使用したメッセージ送信を標準でサポートしています。使い捨ておよび永続的な接続を作成でき、実行時に接続を取得して使用することができます。

この機能には、ブラウザーが課すいくつかの制限があります。たとえば、テキストメッセージのみ送信でき、接続を永続的に閉じることができません。サーバー側で接続が閉じられた場合、クライアントは 5 秒ごと（ブラウザーによっては 3 秒ごと）に再接続を試みます。

これらの接続は、クライアントが毎回情報を要求することなく、サーバーからクライアントへイベントを送信するのに便利です。

## SSE 接続の作成

SSE 接続は通常の HTTP リクエストと同様に動作しますが、レスポンスを送信してすぐに接続を閉じるのではなく、メッセージを送信できるように接続を開いたままにします。

[HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource) メソッドを呼び出すと、SSE インスタンスが作成される間、リクエストは待機状態になります。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();

    sse.Send("Hello, world!");

    return sse.Close();
});
```

上記のコードでは、SSE 接続を作成し、"Hello, world" メッセージを送信し、サーバー側から SSE 接続を閉じています。

> [!NOTE]
> サーバー側の接続を閉じると、デフォルトではクライアントは再度接続しようとし、接続が再開されてメソッドが永遠に再実行されます。
>
> 接続がサーバー側で閉じられた際に、クライアントが再接続しようとしないように、サーバーから終了メッセージを転送するのが一般的です。

## ヘッダーの追加

ヘッダーを送信する必要がある場合は、メッセージを送信する前に [HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader) メソッドを使用できます。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource();
    sse.AppendHeader("Header-Key", "Header-value");

    sse.Send("Hello!");

    return sse.Close();
});
```

ヘッダーはメッセージを送信する前に送信する必要があることに注意してください。

## Wait-For-Fail 接続

接続は、クライアント側の切断が原因でサーバーがメッセージを送信できなくなると通常は終了します。この場合、接続は自動的に終了し、クラスのインスタンスは破棄されます。

再接続が行われても、クラスのインスタンスは前の接続に紐付いているため機能しません。状況によっては、後でこの接続が必要になることがあり、ルートのコールバックメソッドで管理したくない場合があります。

そのため、SSE 接続に識別子を付けて後で取得できるようにし、ルートのコールバック外でも使用できます。また、接続を [WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail) でマークすることで、ルートを終了させずに接続を自動的に終了させません。

`WaitForFail` 状態の SSE 接続は、切断による送信エラーまたは設定されたアイドル許容時間が経過するのを待ち、ルートが再開されて接続が閉じられます。

```cs
r.MapGet("/", (req) =>
{
    using var sse = req.GetEventSource("my-index-connection");

    sse.WaitForFail(TimeSpan.FromSeconds(15)); // メッセージが無い状態で 15 秒待機し、接続を終了する前に待ちます

    return sse.Close();
});
```

上記のメソッドは接続を作成し、処理を行い、切断またはエラーを待ちます。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("my-index-connection");
if (evs != null)
{
    // 接続はまだ生きています
    evs.Send("Hello again!");
}
```

上記のスニペットは新しく作成された接続を探し、存在すればメッセージを送信します。

識別されたすべてのアクティブなサーバー接続はコレクション [HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources) で利用可能です。このコレクションはアクティブで識別された接続のみを保持し、閉じられた接続はコレクションから削除されます。

> [!NOTE]
> keep-alive には、Web プロキシや HTTP カーネル、ネットワークドライバーなど、制御できない形で Sisk に接続するコンポーネントが設定する制限があり、一定時間アイドル状態が続くと接続が閉じられることに注意が必要です。
>
> したがって、定期的に ping を送信するか、接続が閉じられるまでの最大時間を延長して接続を開いたままにすることが重要です。次のセクションで定期的な ping の送信について詳しく説明します。

## 接続 ping ポリシーの設定

Ping ポリシーは、クライアントに定期的なメッセージを自動的に送信する方法です。この機能により、サーバーは接続を無期限に開いたままにせず、クライアントが切断したことを検知できます。

```cs
[RouteGet("/sse")]
public async Task<HttpResponse> Events(HttpRequest request)
{
    using var sse = await request.GetEventSourceAsync("user-events");
    sse.WithPing(ping =>
    {
        ping.DataMessage = "ping-message";
        ping.Interval = TimeSpan.FromSeconds(5);
        ping.Start();
    });
    
    await sse.WaitForFailAsync(TimeSpan.FromMinutes(10));
    return await sse.CloseAsync();
}
```

上記のコードでは、5 秒ごとに新しい ping メッセージがクライアントに送信されます。これにより TCP 接続が維持され、アイドル状態による切断を防止します。また、メッセージの送信に失敗した場合、接続は自動的に閉じられ、接続で使用されていたリソースが解放されます。

非同期ルートでは [SendAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.SendAsync) と [CloseAsync](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.CloseAsync) を使用してください。閉じる前にキューに入ったイベントを破棄する必要がある場合は [Cancel](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.Cancel) を呼び出します。

## 接続のクエリ

たとえばブロードキャストを行うために、接続識別子に対する述語を使用してアクティブな接続を検索できます。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("my-connection-"));
foreach (HttpRequestEventSource e in evs)
{
    e.Send("Broadcasting to all event sources that starts with 'my-connection-'");
}
```

また、[All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All) メソッドを使用して、すべてのアクティブな SSE 接続を取得することもできます。