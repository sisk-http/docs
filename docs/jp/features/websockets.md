# Web ソケット

Sisk では、クライアントへのメッセージの送受信もサポートしています。

この機能は、ほとんどのブラウザで正常に動作しますが、Sisk ではまだ実験的な段階です。もしバグを見つけた場合は、github で報告してください。

## 非同期でメッセージを受信する

以下の例は、実践的な Web ソケットの使用方法を示しており、接続の確立、メッセージの受信、コンソールへの表示を示しています。

Web ソケットで受信されるすべてのメッセージは、バイト列として受信されるため、受信時にデコードする必要があります。

デフォルトでは、メッセージはチャンクに分割され、最後のチャンクはメッセージの最終パケットとして送信されます。パケットのサイズは、[WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize) フラグで設定できます。このバッファリングは、送信と受信の両方のメッセージに同じです。

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
            Console.WriteLine("Received message: " + msgText);

            // gets the HttpWebSocket context which received the message
            HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
            senderWebSocket.Send("Response!");
        };

        ws.WaitForClose();

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## 同期でメッセージを受信する

以下の例は、同期的な Web ソケットの使用方法を示しており、メッセージを受信し、処理し、ソケットの使用を終了します。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/connect", (req) =>
    {
        var ws = req.GetWebSocket();
        WebSocketMessage? msg;

    askName:
        ws.Send("What is your name?");
        msg = ws.WaitNext();

        string? name = msg?.GetString();

        if (string.IsNullOrEmpty(name))
        {
            ws.Send("Please, insert your name!");
            goto askName;
        }

    askAge:
        ws.Send("And your age?");
        msg = ws.WaitNext();

        if (!Int32.TryParse(msg?.GetString(), out int age))
        {
            ws.Send("Please, insert an valid number");
            goto askAge;
        }

        ws.Send($"You're {name}, and you are {age} old.");

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

        ws.Send("Hello, world");     // will be encoded as an UTF-8 byte array
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## Web ソケットのクローズを待つ

[WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) メソッドは、クライアントまたはサーバーが接続を終了するまで、現在の呼び出しスタックをブロックします。

これにより、リクエストのコールバックの実行が、クライアントまたはサーバーが切断するまでブロックされます。

また、[Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close) メソッドを使用して、接続を手動でクローズすることもできます。このメソッドは、空の [HttpResponse](/api/Sisk.Core.Http.HttpResponse) オブジェクトを返しますが、クライアントには送信されず、HTTP リクエストを受信した関数からの戻り値として機能します。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // クライアントが接続をクローズするまで待つ
        ws.WaitForClose();

        // 60 秒間メッセージのやり取りがない場合、またはどちらかが接続をクローズするまで待つ
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost", 5551, r);
}
```

## ピング ポリシー

サーバー側イベントのピング ポリシーと同様に、TCP 接続を維持するために、ピング ポリシーを設定できます。

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```