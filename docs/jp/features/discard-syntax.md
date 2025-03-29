# Discard syntax

HTTPサーバーは、OAuth認証などのアクションからのコールバック要求を待ち受けるために使用でき、要求を受け取った後には破棄できます。これは、バックグラウンドアクションが必要だが、HTTPアプリケーションを設定したくない場合に便利です。

以下の例は、[CreateListener](/api/Sisk.Core.Http.HttpServer.CreateListener)を使用してポート5555でリスニングHTTPサーバーを作成し、次のコンテキストを待つ方法を示しています。

```csharp
using (var server = HttpServer.CreateListener(5555))
{
    // 次のHTTP要求を待つ
    var context = await server.WaitNextAsync();
    Console.WriteLine($"要求されたパス: {context.Request.Path}");
}
```

[WaitNext](/api/Sisk.Core.Http.HttpServer.WaitNext)関数は、完了した要求処理の次のコンテキストを待ちます。この操作の結果が取得されると、サーバーはすでに要求を完全に処理し、クライアントに応答を送信しています。