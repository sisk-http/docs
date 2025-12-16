# モデルコンテキストプロトコル

大規模な言語モデル（LLM）を使用してエージェントモデルにコンテキストを提供するアプリケーションを構築することが可能です。[Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) パッケージを使用することで、MCP サーバーを構築できます。

    dotnet add package Sisk.ModelContextProtocol

このパッケージでは、[Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 上で動作する MCP サーバーを構築するための便利なクラスとメソッドが公開されています。

> [!NOTE]
>
> 開始する前に、このパッケージは開発中であり、仕様に準拠していない動作を示す可能性があることを注意してください。[パッケージの詳細](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) を読んで、開発中の機能と未実装の機能を確認してください。

## MCP の開始

[McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) クラスは、MCP サーバーを定義するためのエントリーポイントです。抽象クラスであり、どこにでも定義できます。Sisk アプリケーションには、1 つ以上の MCP プロバイダーを含めることができます。

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "数学サーバー",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "1 つ以上の数字の合計を計算します。",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "合計する数字。")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"合計結果: {sum:N4}"));
    }));
```

アプリケーションが 1 つの MCP プロバイダーだけを提供する場合は、ビルダーのシングルトンを使用できます。

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "数学サーバー";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "1 つ以上の数字の合計を計算します。",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "合計する数字。")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"合計結果: {sum:N4}"));
                }));
        })
        .UseRouter(router =>
        {
            router.MapAny("/mcp", async (HttpRequest req) =>
            {
                await req.HandleMcpRequestAsync();
            });
        })
        .Build();

    host.Start();
}
```

## JSON スキーマの作成

[Sisk.ModelContextProtocol] ライブラリでは、JSON と JSON スキーマの操作に [LightJson](https://github.com/CypherPotato/LightJson) のフォークが使用されています。この実装では、さまざまなオブジェクトのためのフルー JSON スキーマ ビルダーが提供されます。

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

例：

```csharp
JsonSchema.CreateObjectSchema(
    properties: new Dictionary<string, JsonSchema>()
    {
        { "numbers",
            JsonSchema.CreateArraySchema(
                itemsSchema: JsonSchema.CreateNumberSchema(),
                minItems: 1,
                description: "合計する数字。")
        }
    },
    requiredProperties: ["numbers"]);
```

以下のスキーマを生成します。

```json
{
  "type": "object",
  "properties": {
    "numbers": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "minItems": 1,
      "description": "合計する数字。"
    }
  },
  "required": ["numbers"]
}
```

## 関数呼び出しの処理

[McpTool](/api/Sisk.ModelContextProtocol.McpTool) の `executionHandler` パラメーターで定義された関数では、呼び出し引数を含む JsonObject が提供されます。この JsonObject はフルーに読み取ることができます。

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "ブラウザのアクションを実行します。スクロール、リフレッシュ、ナビゲーションなど。",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "アクション名。")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "アクションのパラメーター。")
            }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // アクション名を読み取ります。null または明示的な文字列でない場合は例外がスローされます。
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data は必須ではありません。したがって、ここでは null になる可能性があります。
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // アクション名に基づいてブラウザのアクションを処理します。
        return await Task.FromResult(
            McpToolResult.CreateText($"ブラウザのアクションを実行しました: {actionName}"));
    }));
```

## 関数の結果

[McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) オブジェクトでは、MCP クライアントへのツール応答の内容を作成するための 3 つのメソッドが提供されます。

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): オーディオベースの応答を作成します。
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): 画像ベースの応答を作成します。
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): テキストベースの応答 (デフォルト) を作成します。

さらに、複数の異なる内容を 1 つの JSON ツール応答に結合することもできます。

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // 実際の作業をシミュレート

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("ブラウザのスクリーンショットです:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## 作業の継続

モデルコンテキストプロトコルは、エージェントモデルとコンテンツを提供するアプリケーションとの間の通信プロトコルです。このプロトコルは新しく、仕様が頻繁に更新されるため、非推奨、新機能、破壊的な変更が発生することがあります。

[MCP](https://modelcontextprotocol.io/docs/jp/getting-started/intro) が解決する問題を理解することが、エージェントアプリケーションの構築を開始する前に重要です。

また、[Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) パッケージの仕様を読んで、進捗状況、ステータス、および使用可能な機能を理解する必要があります。