# 模型上下文协议

可以使用大型语言模型（LLM）和 [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) 包来构建为代理模型提供上下文的应用程序：

```bash
dotnet add package Sisk.ModelContextProtocol
```

该包公开了有用的类和方法，用于构建通过 [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 工作的 MCP 服务器。

> [!NOTE]
>
> 在开始之前，请注意该包仍在开发中，可能会出现与规范不一致的行为。阅读 [包的详细信息](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 以了解正在开发的内容以及尚未实现的功能。

## 开始使用 MCP

[McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) 类是定义 MCP 服务器的入口点。它是抽象的，可以在任何地方定义。您的 Sisk 应用程序可以拥有一个或多个 MCP 提供者。

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

如果您的应用程序只提供一个 MCP 提供者，您可以使用构建器的单例：

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

## 创建函数的 JSON 模式

[Sisk.ModelContextProtocol] 库使用 [LightJson](https://github.com/CypherPotato/LightJson) 的一个分支来处理 JSON 和 JSON 模式。该实现为多种对象提供了流畅的 JSON Schema 构建器：

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

示例：

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

生成以下模式：

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

## 处理函数调用

在 [McpTool](/api/Sisk.ModelContextProtocol.McpTool) 的 `executionHandler` 参数中定义的函数提供了一个 JsonObject 对象，其中包含可流畅读取的调用参数：

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

## 函数结果

[McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) 对象提供了三种创建工具响应内容的方法：

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio)：为 MCP 客户端创建基于音频的响应。
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage)：为 MCP 客户端创建基于图像的响应。
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText)：为 MCP 客户端创建基于文本的响应（默认）。

此外，您可以在单个 JSON 工具响应中组合多种不同的内容：

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

## 继续工作

Model Context Protocol 是一种为代理模型和提供内容的应用程序提供通信协议的新协议，因此其规范会不断更新，出现弃用、新功能和破坏性更改是很常见的。

在开始构建代理应用程序之前，务必了解 [Model Context Protocol](https://modelcontextprotocol.io/docs/cn/getting-started/intro) 解决的问题。

阅读 [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 包的规范，以了解其进展、状态以及可做的事情。