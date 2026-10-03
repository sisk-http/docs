# Web ソケット

Source: https://docs.sisk-framework.org/ja/docs/features/websockets.html

Sisk は Web ソケットもサポートしており、クライアントとのメッセージの受信・送信が可能です。

この機能はほとんどのブラウザで問題なく動作しますが、Sisk ではまだ実験的な段階です。バグを見つけた場合は、GitHub で報告してください。

## メッセージの受信

WebSocket のメッセージは順番通りに受信され、`ReceiveMessageAsync` によって処理されるまでキューに保持されます。このメソッドは、タイムアウトに達したとき、操作がキャンセルされたとき、またはクライアントが切断されたときにメッセージを返しません。

同時に読み取りと書き込みの操作は一つしか行えないため、`ReceiveMessageAsync` でメッセージを待機している間は、接続されたクライアントへ書き込むことはできません。

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("Received message: " + msgText);

        await ws.SendAsync("Hello!");
    }

    return await ws.CloseAsync();
});
```

## 永続的接続

以下の例は、メッセージを受信し処理した後にソケットを終了する、永続的な WebSocket 接続の使い方を示しています。

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("What is your name?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("Please, insert your name!");
        goto askName;
    }

askAge:
    await ws.SendAsync("And your age?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("Please, insert an valid number");
        goto askAge;
    }

    await ws.SendAsync($"You're {name}, and you are {age} old.");

    return await ws.CloseAsync();
});
```

## Ping ポリシー

Server Side Events の Ping ポリシーと同様に、非アクティブ時に TCP 接続を維持するための Ping ポリシーを設定できます。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```

## 管理された接続

WebSocket を受け入れる際に識別子を指定できます。識別子付きソケットは [HttpServer.WebSockets](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServer.WebSockets.md) に登録され、受け入れたルート以外からでもサーバーがアクティブな接続を検索できるようになります。

```cs
router.MapGet("/connect/<userId>", async (HttpRequest req) =>
{
    string userId = req.RouteParameters["userId"].GetString();

    using var ws = await req.GetWebSocketAsync(identifier: $"user:{userId}");
    ws.State = userId;

    ws.PingPolicy.Start(
        dataMessage: "ping",
        interval: TimeSpan.FromSeconds(10));

    while (await ws.ReceiveMessageAsync(TimeSpan.FromMinutes(5)) is { } message)
    {
        await ws.SendAsync("Received: " + message.GetString());
    }

    return await ws.CloseAsync();
});
```

アプリケーションの別の部分から、識別子または述語でコレクションを検索します。

```cs
HttpWebSocket? socket = server.WebSockets.GetByIdentifier("user:42");
if (socket is { IsClosed: false })
{
    await socket.SendAsync("Your report is ready.");
}

foreach (HttpWebSocket activeSocket in server.WebSockets.Find(id => id.StartsWith("user:")))
{
    await activeSocket.SendAsync("Broadcast message");
}
```

各 `HttpWebSocket` は `Identifier`、`State`、`IsClosed`、`PingPolicy` を公開します。コレクションは `All()`、`Find(...)`、`GetByIdentifier(...)`、`ActiveConnections`、`DropAll()` も提供し、サーバー管理型接続戦略をサポートします。
