# Web Sockets

Sisk は WebSocket もサポートしており、クライアントへのメッセージの送受信が可能です。

この機能はほとんどのブラウザで正常に動作しますが、Sisk ではまだ実験段階です。バグを発見した場合は GitHub で報告してください。

## 非同期でメッセージを受信する

WebSocket のメッセージは順序通りに受信され、`ReceiveMessageAsync` で処理されるまでキューに入れられます。このメソッドは、タイムアウトに達したとき、操作がキャンセルされたとき、またはクライアントが切断されたときにメッセージを返しません。

読み取りと書き込みは同時に 1 つしか実行できないため、`ReceiveMessageAsync` でメッセージを待っている間は、接続されたクライアントに書き込むことはできません。

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

## 同期でメッセージを受信する

以下の例では、非同期コンテキストを使わずに同期的に WebSocket を使用し、メッセージを受信し、処理し、ソケットの使用を終了する方法を示しています。

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

Server Side Events の ping ポリシーと同様に、TCP 接続に不活動がある場合に接続を維持するために ping ポリシーを設定できます。

```cs
ws.PingPolicy.Start(
    dataMessage: "ping-message",
    interval: TimeSpan.FromSeconds(10));
```
