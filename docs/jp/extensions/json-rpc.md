# JSON-RPC 拡張

Sisk には、よりシンプルなアプリケーションを作成できる実験的な JSON-RPC 2.0 API 用のモジュールがあります。この拡張機能は、JSON-RPC 2.0 トランスポート インターフェイスを厳密に実装し、HTTP GET、POST リクエスト、以及 Sisk での Web ソケットを介したトランスポートを提供します。

以下のコマンドを使用して、Nuget を介して拡張機能をインストールできます。実験/ベータ バージョンの場合は、Visual Studio でプレリリース パッケージの検索を有効にする必要があります。

```bash
dotnet add package Sisk.JsonRpc
```

## トランスポート インターフェイス

JSON-RPC は、状態を保持しない非同期リモート手続き呼び出し (RDP) プロトコルで、JSON を使用して一方向のデータ通信を行います。JSON-RPC リクエストは、通常、ID で識別され、レスポンスはリクエストで送信された同じ ID で配信されます。すべてのリクエストがレスポンスを必要とするわけではありません。これらは「通知」と呼ばれます。

[JSON-RPC 2.0仕様](https://www.jsonrpc.org/specification) では、トランスポートの詳細について説明しています。このトランスポートは、使用される場所に依存しません。Sisk は、このプロトコルを HTTP を介して実装し、[JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html) に準拠しています。これは、GET リクエストを部分的にサポートし、POST リクエストを完全にサポートします。Web ソケットもサポートされており、非同期メッセージ通信を提供します。

JSON-RPC リクエストは次のようになります。

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

そして、成功したレスポンスは次のようになります:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC メソッド

以下の例は、Sisk を使用して JSON-RPC API を作成する方法を示しています。数学演算クラスはリモート演算を実行し、シリアライズされたレスポンスをクライアントに配信します。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseJsonRPC((sender, args) =>
    {
        // WebMethod 属性が付いたすべてのメソッドを JSON-RPC ハンドラーに追加します
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // /service ルートを JSON-RPC の POST および GET リクエストのハンドラーにマップします
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // GET /ws に WebSocket ハンドラーを作成します
        args.Router.MapGet("/ws", request =>
        {
            var ws = request.GetWebSocket();
            ws.OnReceive += args.Handler.Transport.WebSocket;

            ws.WaitForClose(timeout: TimeSpan.FromSeconds(30));
            return ws.Close();
        });
    })
    .Build();

await app.StartAsync();
```

<div class="script-header">
    <span>
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class MathOperations
{
    [WebMethod]
    public float Sum(float a, float b)
    {
        return a + b;
    }
    
    [WebMethod]
    public double Sqrt(float a)
    {
        return Math.Sqrt(a);
    }
}
```

上記の例では、`Sum` と `Sqrt` メソッドを JSON-RPC ハンドラーにマップし、これらのメソッドは `GET /service`、`POST /service`、および `GET /ws` で利用可能になります。メソッド名は大文字と小文字を区別しません。

メソッドのパラメーターは自動的に特定の型にデシリアライズされます。名前付きパラメーターを使用したリクエストもサポートされています。JSON シリアライズは、[LightJson](https://github.com/CypherPotato/LightJson) ライブラリによって実行されます。型が正しくデシリアライズされない場合は、その型用に特定の [JSON コンバーター](https://github.com/CypherPotato/LightJson?tab=readme-ov-file#json-converters) を作成し、後でそれを [JsonSerializerOptions](?) に関連付けることができます。

また、JSON-RPC リクエストから直接 `$.params` の生のオブジェクトをメソッドで取得することもできます。

<div class="script-header">
    <span>
        MathOperations.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[WebMethod]
public float Sum(JsonArray|JsonObject @params)
{
    ...
}
```

これが発生するには、`@params` がメソッドの唯一のパラメーターで、正確に `params` (C# では `@` でエスケープする必要があります) という名前でなければなりません。

パラメーターのデシリアライズは、名前付きオブジェクトまたは位置指定配列の両方で発生します。たとえば、次のメソッドは、両方のリクエストでリモートで呼び出されることができます。

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

配列の場合、パラメーターの順序に従う必要があります。

```json
{
    "jsonrpc": "2.0",
    "method": "AddUserToStore",
    "params": [
        "1234567890",
        {
            "name": "John Doe",
            "email": "john@example.com"
        },
        {
            "name": "My Store"
        }
    ],
    "id": 1

}
```

## シリアライザーのカスタマイズ

[JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) プロパティで JSON シリアライザーをカスタマイズできます。このプロパティでは、メッセージのデシリアライズに [JSON5](https://json5.org/) を使用できるようにすることができます。JSON-RPC 2.0 との準拠ではありませんが、JSON5 は、人間が読み書きしやすい JSON の拡張です。

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder ( 5556 )
    .UseJsonRPC ( ( o, e ) => {

        // 名前比較子を使用して、名前の比較を実行します。
        // この比較子では、名前の文字と数字のみを比較し、他のシンボルは無視されます。
        // 例:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // JSON5 を JSON インタープリターで有効にします。
        // これを有効にした場合でも、プレーン JSON はまだ許可されます。
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // POST /service ルートを JSON-RPC ハンドラーにマップします
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```