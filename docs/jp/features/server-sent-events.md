# Server Sent Events

Siskは、Server Sent Eventsをサポートしており、簡単に実装できます。クライアントにメッセージを送信するための使い捨て接続や永続接続を作成し、実行時に接続を取得して使用することができます。

この機能には、ブラウザによって課されるいくつかの制限があります。たとえば、テキストメッセージのみを送信でき、接続を永久に閉じることはできません。サーバー側で接続が閉じられた場合、クライアントは5秒ごとに再接続を試みます（一部のブラウザでは3秒ごと）。

これらの接続は、クライアントが情報を要求するたびにサーバーからクライアントにイベントを送信するために役立ちます。

## SSE接続の作成

SSE接続は通常のHTTPリクエストのように動作しますが、レスポンスを送信してすぐに接続を閉じるのではなく、メッセージを送信するために接続が開いたままになります。

[HttpRequest.GetEventSource()](/api/Sisk.Core.Http.HttpRequest.GetEventSource)メソッドを呼び出すと、リクエストは待機状態になり、SSEインスタンスが作成されます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();

 sse.Send("こんにちは、世界!");

 return sse.Close();
});
```

上記のコードでは、SSE接続を作成し、「こんにちは、世界！」というメッセージを送信し、サーバー側からSSE接続を閉じます。

> [!NOTE]
> サーバー側で接続を閉じると、クライアントはデフォルトで再接続を試み、その接続は再開され、メソッドが再度実行されます。
>
> クライアントが再接続しないように、サーバーが接続を閉じたときに終了メッセージを転送することが一般的です。

## ヘッダーの追加

ヘッダーを送信する必要がある場合は、メッセージを送信する前に[HttpRequestEventSource.AppendHeader](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.AppendHeader)メソッドを使用できます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource();
 sse.AppendHeader("ヘッダーキー", "ヘッダー値");

 sse.Send("こんにちは！");

 return sse.Close();
});
```

ヘッダーを送信する前にメッセージを送信しないことが必要です。

## 待機-失敗接続

接続は通常、クライアント側の切断によりメッセージを送信できなくなると終了します。そのため、接続は自動的に終了し、クラスのインスタンスは破棄されます。

再接続しても、クラスのインスタンスは機能しません。以前の接続にリンクしているからです。場合によっては、この接続を後で必要とし、ルートのコールバックメソッドを介して管理したくないことがあります。

このため、識別子でSSE接続を識別し、後でそれを使用して、ルートのコールバック外でも取得できます。さらに、[WaitForFail](/api/Sisk.Core.Http.Streams.HttpRequestEventSource.WaitForFail)で接続をマークして、ルートを終了せず、接続を自動的に終了させません。

KeepAliveのSSE接続は、切断による送信エラーが発生するまでメソッドの実行を待機します。タイムアウトを設定することもできます。一定時間内にメッセージが送信されなかった場合、接続は終了し、実行が再開されます。

```cs
r += new Route(RouteMethod.Get, "/", (req) =>
{
 using var sse = req.GetEventSource("私のインデックス接続");

 sse.WaitForFail(TimeSpan.FromSeconds(15)); // 15秒間メッセージが送信されなかった場合に接続を終了

 return sse.Close();
});
```

上記のメソッドは、接続を作成し、処理し、切断またはエラーを待ちます。

```cs
HttpRequestEventSource? evs = server.EventSources.GetByIdentifier("私のインデックス接続");
if (evs != null)
{
 // 接続はまだアクティブです
 evs.Send("もう一度こんにちは！");
}
```

上記のコードは、新しく作成された接続を探し、存在する場合にメッセージを送信します。

識別されたアクティブなサーバー接続はすべて[HttpServer.EventSources](/api/Sisk.Core.Http.HttpServer.EventSources)コレクションで利用できます。このコレクションには、アクティブで識別された接続のみが保存されます。閉じられた接続はコレクションから削除されます。

> [!NOTE]
> アイドル接続を一定期間後に閉じるコンポーネント（Webプロキシ、HTTPカーネル、ネットワークドライバーなど）によって、キープアライブには制限があることに注意することが重要です。
>
> したがって、定期的なpingを送信するか、接続が閉じられるまでの最大時間を延長して、接続を開いたままにすることが重要です。次のセクションを読んで、定期的なpingの送信について理解を深めてください。

## 接続のpingポリシーの設定

Pingポリシーは、クライアントに定期的なメッセージを送信する自動化された方法です。この機能により、サーバーはクライアントが接続から切断したかどうかを理解できます。

```cs
[RouteGet("/sse")]
public HttpResponse Events(HttpRequest request)
{
 using var sse = request.GetEventSource();
 sse.WithPing(ping =>
 {
 ping.DataMessage = "pingメッセージ";
 ping.Interval = TimeSpan.FromSeconds(5);
 ping.Start();
 });
    
 sse.KeepAlive();
 return sse.Close();
}
```

上記のコードでは、5秒ごとに新しいpingメッセージがクライアントに送信されます。これにより、TCP接続がアクティブなままになり、非アクティブにより接続が閉じられることがなくなります。また、メッセージの送信に失敗した場合、接続は自動的に閉じられ、接続で使用されるリソースが解放されます。

## 接続のクエリ

識別子に基づく述語を使用してアクティブな接続を検索することができます。たとえば、ブロードキャストなどです。

```cs
HttpRequestEventSource[] evs = server.EventSources.Find(es => es.StartsWith("私の接続-"));
foreach (HttpRequestEventSource e in evs)
{
 e.Send("'私の接続-'で始まるすべてのイベントソースへのブロードキャスト");
}
```

[All](/api/Sisk.Core.Http.Streams.HttpEventSourceCollection.All)メソッドを使用して、すべてのアクティブなSSE接続を取得することもできます。