# 模型上下文协议

可以使用 [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) 包来构建提供大型语言模型（LLM）上下文的应用程序：

    dotnet add package Sisk.ModelContextProtocol

此包公开了用于构建使用 [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) 的MCP服务器的有用类和方法。

> [!NOTE]
>
> 开始之前，请注意此包处于开发中，可能会表现出不符合规范的行为。请阅读 [包详细信息](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 以了解哪些功能正在开发中，哪些功能尚不工作。

## 开始使用MCP

[McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) 类是定义MCP服务器的入口点。它是抽象的，可以在任何地方定义。您的Sisk应用程序可以有一个或多个MCP提供程序。

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "数学服务器",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "求一或多个数字的和。",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "要求和的数字。")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"求和结果：{sum:N4}"));
    }));
```

如果您的应用程序只提供一个MCP提供程序，可以使用构建器的单例：

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "数学服务器";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "求一或多个数字的和。",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "要求和的数字。")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"求和结果：{sum:N4}"));
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

## 为函数创建JSON模式

[Sisk.ModelContextProtocol] 库使用 [LightJson](https://github.com/CypherPotato/LightJson) 的分支来处理JSON和JSON模式。该实现为各种对象提供了流畅的JSON模式构建器：

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
                description: "要求和的数字。")
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
      "description": "要求和的数字。"
    }
  },
  "required": ["numbers"]
}
```

## 处理函数调用

[McpTool](/api/Sisk.ModelContextProtocol.McpTool) 的 `executionHandler` 参数中定义的函数提供了一个包含调用参数的JsonObject，可以流畅地读取：

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "运行浏览器操作，例如滚动、刷新或导航。",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "操作名称。")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "操作参数。")
            }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // 读取操作名称。如果为null或不是显式字符串，则会抛出异常
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data被定义为非必需的，因此它可能为null
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // 根据actionName处理浏览器操作
        return await Task.FromResult(
            McpToolResult.CreateText($"执行浏览器操作：{actionName}"));
    }));
```

## 函数结果

[McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) 对象提供了三种方法来创建工具响应的内容：

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio)：为MCP客户端创建基于音频的响应。
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage)：为MCP客户端创建基于图像的响应。
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText)：为MCP客户端创建基于文本的响应（默认）。

另外，可以将多个不同内容组合成一个JSON工具响应：

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // 模拟实际工作

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("这是浏览器的截图："),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## 继续工作

模型上下文协议是代理模型和为其提供内容的应用程序之间的通信协议。它是一个新协议，因此其规范经常更新，包括弃用、新功能和破坏性更改。

在开始构建代理应用程序之前，了解 [模型上下文协议](https://modelcontextprotocol.io/docs/cn/getting-started/intro) 解决的问题至关重要。

还应阅读 [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) 包的规范，以了解其进度、状态和可以使用它做什么。