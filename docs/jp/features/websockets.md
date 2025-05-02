# Web Sockets

SiskはWebソケットをサポートしており、クライアントへのメッセージの受信と送信が可能です。

この機能はほとんどのブラウザで正常に動作しますが、Siskではまだ実験的な段階です。バグを見つけた場合は、githubに報告してください。

## 非同期メッセージの受信と受け取り

以下の例は、WebSocketが実際にどのように動作するかを示しています。接続の開始、メッセージの受信、コンソールへの表示の例です。

WebSocketで受信されたすべてのメッセージはバイトとして受信されるため、受信時にデコードする必要があります。

デフォルトでは、メッセージはチャンクに分割され、最後の部分はメッセージの最終パケットとして送信されます。パケットサイズは、 [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)フラグで構成できます。このバッファリングは、メッセージの送信と受信の両方で同じです。

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
    
    ws.OnReceive += (sender, msg) =>
    {
        string msgText = Encoding.UTF8.GetString(msg.MessageBytes);
        Console.WriteLine("Received message: " + msgText);

        // メッセージを受信したHttpWebSocketコンテキストを取得します
        HttpWebSocket senderWebSocket = (HttpWebSocket)sender!;
        senderWebSocket.Send("Response!");
    };

    ws.WaitForClose();
    
    return ws.Close();
});
```

> [!NOTE]
>
> このように非同期イベントを使用しないでください。HTTPサーバーのドメイン外で例外がスローされ、アプリケーションがクラッシュする可能性があります。

複数のメッセージを同時に処理し、非同期コードを処理する必要がある場合は、メッセージループを使用できます。

```csharp
router.MapGet("/", async delegate (HttpRequest request)
{
    using var ws = await request.GetWebSocketAsync();
    
    WebSocketMessage? message;
    while ((message = ws.WaitNext(timeout: TimeSpan.FromSeconds(30))) != null)
    {
        var messageText = message.GetString();
        Console.WriteLine($"Received message: {messageText}");

        await ws.SendAsync("Hello from server!");
    }

    return ws.Close();
});
```

## 同期メッセージの受信と受け取り

以下の例は、同期的なWebSocketの使用方法を示しています。非同期コンテキストを使用せずに、メッセージを受信し、処理し、ソケットの使用を終了します。

```cs
router.MapGet("/connect", req =>
{
    using var ws = req.GetWebSocket();
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
```

## メッセージの送信

Sendメソッドには、テキスト、バイト配列、またはバイトスパンを送信できる3つのオーバーロードがあります。サーバーの [WebSocketBufferSize](/api/Sisk.Core.Http.HttpServerFlags.WebSocketBufferSize)フラグが総ペイロードサイズより大きい場合、すべてがチャンク化されます。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        byte[] myByteArrayContent = ...;

        ws.Send("Hello, world"); // UTF-8バイト配列としてエンコードされます
        ws.Send(myByteArrayContent);

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## WebSocketのクローズを待つ

メソッド [WaitForClose()](/api/Sisk.Core.Http.Streams.HttpWebSocket.WaitForClose) は、クライアントまたはサーバーによって接続が終了するまで、現在の呼び出しスタックをブロックします。

これにより、リクエストのコールバックの実行は、クライアントまたはサーバーが切断するまでブロックされます。

また、 [Close()](/api/Sisk.Core.Http.Streams.HttpWebSocket.Close)メソッドを使用して接続を手動で閉じることもできます。このメソッドは、クライアントに送信されない空の [HttpResponse](/api/Sisk.Core.Http.HttpResponse)オブジェクトを返しますが、HTTPリクエストを受信した関数の戻り値として機能します。

```cs
static ListeningHost BuildLhA()
{
    Router r = new Router();

    r += new Route(RouteMethod.Get, "/", (req) =>
    {
        var ws = req.GetWebSocket();

        // クライアントが接続を閉じるのを待つ
        ws.WaitForClose();

        // 60秒間メッセージが交換されないか、またはいずれかのパーティが接続を閉じるまで待つ
        ws.WaitForClose(TimeSpan.FromSeconds(60));

        return ws.Close();
    });

    return new ListeningHost("localhost",5551, r);
}
```

## Pingポリシー

サーバ側イベントのpingポリシーのように、TCP接続をアクティブに保つために、pingポリシーを構成することもできます。

```cs
ws.WithPing(ping =>
{
    ping.DataMessage = "ping-message";
    ping.Interval = TimeSpan.FromSeconds(5);
    ping.Start();
});
```