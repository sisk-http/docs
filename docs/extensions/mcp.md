# Model Context Protocol

It is possible to build applications that provide context to agent models using large language models (LLMs) using the [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) package:

    dotnet add package Sisk.ModelContextProtocol

This package exposes useful classes and methods for building MCP servers that work over [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Before you start, note that this package is under development and may exhibit behaviors that do not conform to the specification. Read the [package details](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) to learn what is under development and what does not work yet.

## Getting Started with MCP

The [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) class is the entry point for defining an MCP server. It is abstract and can be defined anywhere. Your Sisk application can have one or more MCP providers.

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

If your application will provide only one MCP provider, you can use the builder's singleton:

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

## Creating JSON Schemas for Functions

The [Sisk.ModelContextProtocol] library uses a fork of [LightJson](https://github.com/CypherPotato/LightJson) for JSON and JSON schema manipulation. This implementation provides a fluent JSON Schema builder for various objects:

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

Example:

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

Produces the following schema:

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

## Handling Function Calls

The function defined in the `executionHandler` parameter of [McpTool](/api/Sisk.ModelContextProtocol.McpTool) provides a JsonObject containing the call arguments that can be read fluently:

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

## Function Results

The [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) object provides three methods for creating content for a tool response:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): creates an audio-based response for the MCP client.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): creates an image-based response for the MCP client.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): creates a text-based response (the default) for the MCP client.

Additionally, it is possible to combine multiple different contents into a single JSON tool response:

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

## Continuing Work

The Model Context Protocol is a communication protocol for agent models and applications that provide content to them. It is a new protocol, so it is common for its specification to be constantly updated with deprecations, new features, and breaking changes.

It is crucial to understand the problems that the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) solves before starting to build agent applications.

Also read the specification of the [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) package to understand its progress, status, and what can be done with it.
