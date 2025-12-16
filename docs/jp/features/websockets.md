# Web ソケット

Sisk では Web ソケットもサポートしており、クライアントへのメッセージの受信と送信が可能です。

この機能はほとんどのブラウザで正常に動作しますが、Sisk ではまだ実験的な段階です。もしバグを見つけた場合は、github に報告してください。

## メッセージの受信

WebSocket メッセージは順番に受信され、`ReceiveMessageAsync` によって処理されるまでキューに保管されます。このメソッドは、タイムアウトが達成されたとき、操作がキャンセルされたとき、またはクライアントが切断されたときにはメッセージを返しません。

同時に読み取りと書き込みの操作が 1 つしか行えないため、`ReceiveMessageAsync` でメッセージを待っている間に、接続されたクライアントに書き込むことはできません。

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    
    while (await ws.ReceiveMessageAsync(timeout: TimeSpan.FromSeconds(30)) is { } receivedMessage)
    {
        string msgText = receivedMessage.GetString();
        Console.WriteLine("メッセージを受信しました: " + msgText);

        await ws.SendAsync("こんにちは!");
    }

    return await ws.CloseAsync();
});
```

## 持続的な接続

以下の例には、メッセージを受信し、処理し、ソケットの使用を終了する方法が含まれています。

```cs
router.MapGet("/connect", async (HttpRequest req) =>
{
    using var ws = await req.GetWebSocketAsync();
    WebSocketMessage? msg;

askName:
    await ws.SendAsync("あなたの名前は何ですか?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    string name = msg.GetString();

    if (string.IsNullOrEmpty(name))
    {
        await ws.SendAsync("名前を入力してください!");
        goto askName;
    }

askAge:
    await ws.SendAsync("あなたの年齢は?");
    msg = await ws.ReceiveMessageAsync();

    if (msg is null)
        return await ws.CloseAsync();

    if (!Int32.TryParse(msg?.GetString(), out int age))
    {
        await ws.SendAsync("有効な数字を入力してください");
        goto askAge;
    }

    await ws.SendAsync($"あなたは {name} さんで、{age} 歳です.");

    return await ws.CloseAsync();
});
```

## Ping ポリシー

サーバー側イベントの Ping ポリシーと同様に、TCP 接続を維持するために Ping ポリシーを設定できます。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-メッセージ",
    interval: TimeSpan.FromSeconds(10));
```