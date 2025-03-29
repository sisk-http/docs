# Web ソケット

Sisk では、Web ソケットもサポートされており、クライアントとの間でメッセージの送受信を行うことができます。

この機能は、ほとんどのブラウザで正常に動作しますが、Sisk ではまだ実験的な段階です。もしバグを見つけた場合は、GitHub で報告してください。

## 非同期でメッセージを受信する

以下の例は、WebSocket の実践的な使用方法を示しており、接続の確立、メッセージの受信、コンソールへの表示を行っています。

WebSocket で受信されるすべてのメッセージは、バイト列として受信されるため、受信時にデコードする必要があります。

デフォルトでは、メッセージはチャンクに分割され、最後のチャンクはメッセージの最終パケットとして送信されます。パケットサイズは、[WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) フラグで設定できます。このバッファリングは、送信と受信の両方で同じです。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        ws.OnReceive += (sender, msg) =>
        {
            string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
            Console.WriteLine("受信メッセージ: " + msgText);

            // 受信メッセージを送信した HttpWebSocket コンテキストを取得
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("応答!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## 同期でメッセージを受信する

以下の例は、同期的な WebSocket の使用方法を示しており、非同期的なコンテキストなしでメッセージを受信し、処理し、ソケットの使用を終了します。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("あなたの名前は何ですか?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("名前を入力してください!");
            goto askName;
        }

    askAge:
        ws.Send("あなたの年齢は?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("有効な数字を入力してください");
            goto askAge;
        }

        ws.Send($"あなたは {name} です、および {age} 歳です.");

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## メッセージの送信

Send メソッドには 3 つのオーバーロードがあり、テキスト、バイト配列、またはバイト スパンを送信できます。すべてのオーバーロードは、サーバーの [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) フラグがペイロードの合計サイズよりも大きい場合にチャンク化されます。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("ハロー、ワールド");     // UTF-8 バイト配列としてエンコードされます
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## WebSocket のクローズを待つ

[WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) メソッドは、クライアントまたはサーバーによって接続が終了されるまで、現在の呼び出しスタックをブロックします。

これにより、リクエストのコールバックの実行がブロックされ、クライアントまたはサーバーが切断するまで待機します。

また、[Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close) メソッドを使用して、接続を手動でクローズすることもできます。このメソッドは、空の [HttpResponse](/api/Sisk.Core.Http.HttpResponse) オブジェクトを返しますが、クライアントには送信されず、HTTP リクエストを受信した関数からの戻り値として機能します。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // クライアントが接続をクローズするまで待機
        ws.WaitForClose();

        // 60 秒間メッセージのやり取りがない場合、またはどちらかが接続をクローズした場合に待機
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## ピング ポリシー

サーバー側イベントのピング ポリシーと同様に、TCP 接続を維持するためにピング ポリシーを設定できます。

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ピング メッセージ";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```