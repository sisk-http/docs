# モデルコンテキストプロトコル

大規模言語モデル（LLM）を使用してエージェントモデルにコンテキストを提供するアプリケーションを構築することが可能です。これには [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) パッケージを使用します：

```bash
dotnet add package Sisk.ModelContextProtocol
```

このパッケージは、[Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 上で動作する MCP サーバーを構築するための便利なクラスとメソッドを公開します。

> [!NOTE]
>
> 開発中のパッケージであるため、仕様に準拠しない動作がある場合があります。開発中の内容やまだ動作しない機能については、[パッケージの詳細](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) をご覧ください。

## MCP の開始

[McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) クラスは MCP サーバーを定義するエントリーポイントです。抽象クラスであり、任意の場所で定義できます。Sisk アプリケーションは 1 つ以上の MCP プロバイダーを持つことができます。

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "Mathematics server",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "Sums one or more numbers.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "The numbers to sum.")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"Sum result: {sum:N4}"));
    }));
```

アプリケーションが 1 つの MCP プロバイダーのみを提供する場合は、ビルダーのシングルトンを使用できます：

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "Mathematics server";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "Sums one or more numbers.",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "The numbers to sum.")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"Sum result: {sum:N4}"));
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

## 関数用 JSON スキーマの作成

[Sisk.ModelContextProtocol] ライブラリは、JSON と JSON スキーマ操作のために [LightJson](https://github.com/CypherPotato/LightJson) のフォークを使用しています。この実装は、さまざまなオブジェクト用にフルエントな JSON スキーマビルダーを提供します：

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
                description: "The numbers to sum.")
        }
    },
    requiredProperties: ["numbers"]);
```

以下のスキーマが生成されます：

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
      "description": "The numbers to sum."
    }
  },
  "required": ["numbers"]
}
```

## 関数呼び出しの処理

[McpTool](/api/Sisk.ModelContextProtocol.McpTool) の `executionHandler` パラメータで定義された関数は、呼び出し引数を含む JsonObject を提供し、フルエントに読み取ることができます：

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "Run an browser action, such as scrolling, refreshing or navigating.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "The action name.")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "Action parameter."
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // read action name. will throw if null or not a explicit string
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data is defined as non-required, so it may be null here
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Handle the browser action based on the actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Performed browser action: {actionName}"));
    }));
```

## 関数結果

[McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) オブジェクトは、ツール応答のコンテンツを作成するための 3 つのメソッドを提供します：

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio)：MCP クライアント用の音声ベースの応答を作成します。
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage)：MCP クライアント用の画像ベースの応答を作成します。
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText)：MCP クライアント用のテキストベースの応答（デフォルト）を作成します。

さらに、複数の異なるコンテンツを単一の JSON ツール応答に組み合わせることも可能です：

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simulate real work

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Heres the screenshot of the browser:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## 継続的な作業

モデルコンテキストプロトコルは、エージェントモデルとそれらにコンテンツを提供するアプリケーションのための通信プロトコルです。新しいプロトコルであるため、仕様は deprecation、機能追加、破壊的変更などで継続的に更新されることが一般的です。

エージェントアプリケーションを構築する前に、[Model Context Protocol](https://modelcontextprotocol.io/docs/jp/getting-started/intro) が解決する問題を理解することが重要です。

また、[Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) パッケージの仕様を読んで、進捗状況、ステータス、および何ができるかを把握してください。