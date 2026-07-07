# JSON-RPC 拡張

Sisk には [JSON-RPC 2.0](https://www.jsonrpc.org/specification) API 用の実験的モジュールがあり、さらにシンプルなアプリケーションを作成できます。この拡張は JSON-RPC 2.0 のトランスポートインターフェースを厳密に実装し、HTTP GET、POST リクエストおよび Sisk の WebSocket によるトランスポートを提供します。

以下のコマンドで NuGet から拡張機能をインストールできます。実験的/ベータ版の場合は、Visual Studio でプレリリース パッケージを検索するオプションを有効にしてください。

```bash
dotnet add package Sisk.JsonRpc
```

## トランスポートインターフェース

JSON-RPC はステートレスで非同期のリモート手続き呼び出し (RPC) プロトコルで、データ通信に JSON を使用します。JSON-RPC のリクエストは通常 ID で識別され、レスポンスはリクエストで送信された同じ ID で返されます。すべてのリクエストがレスポンスを必要とするわけではなく、そういったものは「通知」と呼ばれます。

[JSON-RPC 2.0 仕様](https://www.jsonrpc.org/specification) はトランスポートの動作を詳細に説明しています。このトランスポートは使用場所に依存しません。Sisk は HTTP を介してこのプロトコルを実装し、[JSON-RPC over HTTP](https://www.jsonrpc.org/historical/json-rpc-over-http.html) の規格に従います。GET リクエストは部分的にサポートされ、POST リクエストは完全にサポートされます。WebSocket もサポートされ、非同期メッセージ通信を提供します。

JSON-RPC のリクエストは次のようになります:

```json
{
    "jsonrpc": "2.0",
    "method": "Sum",
    "params": [1, 2, 4],
    "id": 1
}
```

成功したレスポンスは次のようになります:

```json
{
    "jsonrpc": "2.0",
    "result": 7,
    "id": 1
}
```

## JSON-RPC メソッド

以下の例は Sisk を使用して JSON-RPC API を作成する方法を示しています。数学演算クラスがリモート操作を実行し、シリアライズされたレスポンスをクライアントに返します。

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
        // WebMethod 属性が付与されたすべてのメソッドを JSON-RPC ハンドラに追加します
        args.Handler.Methods.AddMethodsFromType(new MathOperations());
        
        // /service ルートをマッピングし、JSON-RPC の POST と GET リクエストを処理します
        args.Router.MapPost("/service", args.Handler.Transport.HttpPost);
        args.Router.MapGet("/service", args.Handler.Transport.HttpGet);
        
        // GET /ws で JSON-RPC WebSocket トランスポートをマッピングします
        args.Router.MapGet("/ws", args.Handler.Transport.WebSocket);
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

上記の例では `Sum` と `Sqrt` メソッドが JSON-RPC ハンドラにマッピングされ、`GET /service`、`POST /service`、`GET /ws` で利用可能になります。メソッド名は大文字小文字を区別しません。

メソッドパラメータは自動的にそれぞれの型へデシリアライズされます。名前付きパラメータを使用したリクエストもサポートされています。JSON のシリアライズは LightJson ライブラリが行います。型が正しくデシリアライズされない場合は、その型用の JSON コンバータを作成し、[JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) に関連付けることができます。

メソッド内で JSON-RPC リクエストの `$.params` 生オブジェクトを直接取得することもできます。

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

これを行うには、`@params` がメソッドの **唯一** のパラメータであり、名前が正確に `params` である必要があります（C# ではこのパラメータ名をエスケープするために `@` が必要です）。

パラメータのデシリアライズは、名前付きオブジェクトでも位置指定配列でも行われます。例えば、以下のメソッドは両方のリクエストでリモート呼び出しできます。

```csharp
[WebMethod]
public float AddUserToStore(string apiKey, User user, UserStore store)
{
    ...
}
```

配列の場合、パラメータの順序を守る必要があります。

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

## シリアライザのカスタマイズ

JSON シリアライザは [JsonRpcHandler.JsonSerializerOptions](/api/Sisk.JsonRPC.JsonRpcHandler.JsonSerializerOptions) プロパティでカスタマイズできます。このプロパティでは、メッセージのデシリアライズに JSON5 の使用を有効にできます。JSON-RPC 2.0 の規格ではありませんが、JSON5 は JSON の拡張で、より人間に読みやすく書きやすくなります。

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

        // サニタイズされた名前比較子を使用します。この比較子は名前中の文字と数字のみを比較し、他の記号は無視します。例:
        // foo_bar10 == FooBar10
        e.Handler.JsonSerializerOptions.PropertyNameComparer = new JsonSanitizedComparer ();

        // JSON インタプリタで JSON5 を有効にします。これを有効にしても、通常の JSON は引き続き使用可能です
        e.Handler.JsonSerializerOptions.SerializationFlags = LightJson.Serialization.JsonSerializationFlags.Json5;

        // POST /service ルートを JSON RPC ハンドラにマッピングします
        e.Router.MapPost ( "/service", e.Handler.Transport.HttpPost );
    } )
    .Build ();

host.Start ();
```