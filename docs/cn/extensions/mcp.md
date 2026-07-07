# 模型上下文协议

可以使用 [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) 包构建为使用大型语言模型（LLM）的代理模型提供上下文的应用程序：

```bash
dotnet add package Sisk.ModelContextProtocol
```

该包公开了用于构建在 [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 上运行的 MCP 服务器的实用类和方法。当前实现支持协议版本 `2025-06-18` 的工具。

> [!NOTE]
>
> 在开始之前，请注意此包仍在开发中，可能会出现不符合规范的行为。阅读 [package details](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 以了解正在开发的内容以及哪些功能尚未实现。

## 快速开始使用 MCP

[McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) 类是定义 MCP 服务器的入口点。它是一个密封的提供者对象，可在启动时进行配置。你的 Sisk 应用程序可以拥有一个或多个 MCP 提供者。

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

如果你的应用程序只提供一个 MCP 提供者，可以使用构建器的单例：

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
                return await req.HandleMcpRequestAsync();
            });
        })
        .Build();

    host.Start();
}
```

该端点必须同时接受 `GET` 和 `POST` 请求，因此 `MapAny` 是最简洁的路由映射方式。`HandleMcpRequestAsync` 返回一个 [HttpResponse](/api/Sisk.Core.Http.HttpResponse)，你的路由必须返回它。如果在同一个应用中需要多个提供者，请跳过单例，直接在每个路由中调用 [McpProvider.HandleRequestAsync](/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync)：

```csharp
var mathProvider = new McpProvider("math-server", "Mathematics server", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## 为函数创建 JSON 架构

[Sisk.ModelContextProtocol] 库使用了 [LightJson](https://github.com/CypherPotato/LightJson) 的分支来处理 JSON 和 JSON 架构。此实现为各种对象提供了流式的 JSON Schema 构建器：

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

生成以下架构：

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

在 [McpTool](/api/Sisk.ModelContextProtocol.McpTool) 的 `executionHandler` 参数中定义的函数会提供一个包含调用参数的 JsonObject，可流式读取：

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

工具参数会在你的处理程序运行之前根据架构进行验证。如果验证失败，提供者会向 MCP 客户端返回错误结果，并且不会调用工具处理程序。

## 函数结果

[McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) 对象提供了三种方法来创建工具响应的内容：

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio)：为 MCP 客户端创建基于音频的响应。
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage)：为 MCP 客户端创建基于图像的响应。
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText)：为 MCP 客户端创建基于文本的响应（默认）。

此外，还可以将多种不同的内容组合成单个 JSON 工具响应：

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

当前提供者处理初始化、`tools/list`、`tools/call`、`ping` 和 `notifications/*`。不支持的 JSON-RPC 方法会返回 JSON-RPC 错误响应。

## 持续工作

模型上下文协议是一种用于代理模型和向其提供内容的应用程序的通信协议。它是一个新协议，因此其规范经常会因废弃、添加新特性或破坏性更改而更新。

在开始构建代理应用之前，务必了解 [Model Context Protocol](https://modelcontextprotocol.io/docs/cn/getting-started/intro) 所解决的问题。

同时阅读 [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 包的规范，以了解其进展、状态以及可以实现的功能。