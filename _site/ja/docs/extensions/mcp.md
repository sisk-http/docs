# モデルコンテキストプロトコル

Source: https://docs.sisk-framework.org/ja/docs/extensions/mcp.html

大規模言語モデル（LLM）を使用してエージェントモデルにコンテキストを提供するアプリケーションを、[Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) パッケージで構築できます。

```bash
dotnet add package Sisk.ModelContextProtocol
```

このパッケージは、[Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 上で動作する MCP サーバーを構築するための便利なクラスとメソッドを公開します。現在の実装はプロトコルバージョン `2025-06-18` のツールをサポートしています。

> [!NOTE]
>
> 開始する前に、このパッケージは開発中であり、仕様に準拠しない動作を示す可能性があることに注意してください。開発中の内容やまだ動作しない部分については、[パッケージの詳細](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) を参照してください。

## MCP の開始

`[McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md)` クラスは MCP サーバーを定義するエントリーポイントです。シールドされたプロバイダーオブジェクトで、起動時に構成できます。Sisk アプリケーションは 1 つまたは複数の MCP プロバイダーを持つことができます。

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "数学サーバー",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "1 つ以上の数値を合計します。",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "合計する数値。")
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
                description: "1 つ以上の数値を合計します。",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "合計する数値。")
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
                return await req.HandleMcpRequestAsync();
            });
        })
        .Build();

    host.Start();
}
```

エンドポイントは `GET` と `POST` の両方のリクエストを受け付ける必要があるため、`MapAny` が最もシンプルなルートマッピングです。`HandleMcpRequestAsync` は [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) を返し、ルートはそれを返す必要があります。アプリ内で複数のプロバイダーが必要な場合は、シングルトンをスキップし、各ルートから直接 [McpProvider.HandleRequestAsync](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync.md) を呼び出してください。

```csharp
var mathProvider = new McpProvider("math-server", "数学サーバー", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## 関数用 JSON スキーマの作成

`[Sisk.ModelContextProtocol]` ライブラリは JSON と JSON スキーマ操作のために [LightJson](https://github.com/CypherPotato/LightJson) のフォークを使用しています。この実装はさまざまなオブジェクト向けに流暢な JSON Schema ビルダーを提供します。

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

例:

```csharp
JsonSchema.CreateObjectSchema(
    properties: new Dictionary<string, JsonSchema>()
    {
        { "numbers",
            JsonSchema.CreateArraySchema(
                itemsSchema: JsonSchema.CreateNumberSchema(),
                minItems: 1,
                description: "合計する数値。")
        }
    },
    requiredProperties: ["numbers"]);
```

次のスキーマが生成されます:

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

`[McpTool](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.md)` の `executionHandler` パラメーターで定義された関数は、呼び出し引数を含む `JsonObject` を提供し、流暢に読み取ることができます。

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "スクロール、リフレッシュ、ナビゲーションなどのブラウザーアクションを実行します。",
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
                    description: "アクションパラメーター。"
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // アクション名を読み取ります。null または明示的な文字列でない場合は例外がスローされます
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data は必須ではないため、ここで null になる可能性があります
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // actionName に基づいてブラウザーアクションを処理します
        return await Task.FromResult(
            McpToolResult.CreateText($"実行されたブラウザーアクション: {actionName}"));
    }));
```

ツール引数はハンドラが実行される前にスキーマに対して検証されます。検証に失敗した場合、プロバイダーはエラー結果を MCP クライアントに返し、ツールハンドラは呼び出されません。

## 関数の結果

`[McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md)` オブジェクトは、ツールレスポンス用のコンテンツを作成するための 3 つのメソッドを提供します。

- `[CreateAudio(ReadOnlySpan<byte>, string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio.md)`: MCP クライアント向けの音声ベースのレスポンスを作成します。
- `[CreateImage(ReadOnlySpan<byte>, string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage.md)`: MCP クライアント向けの画像ベースのレスポンスを作成します。
- `[CreateText(string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateText.md)`: テキストベースのレスポンス（デフォルト）を作成します。

さらに、複数の異なるコンテンツを単一の JSON ツールレスポンスに結合することも可能です。

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // 実際の作業をシミュレート

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("ブラウザーのスクリーンショットです:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        );
    }));
```

プロバイダーは現在、初期化、`tools/list`、`tools/call`、`ping`、および `notifications/*` を処理します。サポートされていない JSON-RPC メソッドは JSON-RPC エラー応答を返します。

## 今後の作業

モデルコンテキストプロトコルは、エージェントモデルとそれらにコンテンツを提供するアプリケーション間の通信プロトコルです。新しいプロトコルであるため、仕様は非推奨項目や新機能、破壊的変更を伴って頻繁に更新されます。

エージェントアプリケーションの構築を開始する前に、[Model Context Protocol](https://modelcontextprotocol.io/docs/jp/getting-started/intro) が解決する課題を理解することが重要です。

また、[Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) パッケージの仕様を読んで、進捗、ステータス、そして何ができるかを把握してください。
