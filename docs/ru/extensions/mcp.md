# Протокол контекста модели

Возможно построить приложения, которые предоставляют контекст для моделей агентов, используя большие языковые модели (LLM) с пакетом [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Этот пакет предоставляет полезные классы и методы для создания серверов MCP, работающих по протоколу [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Перед началом обратите внимание, что данный пакет находится в разработке и может демонстрировать поведение, не соответствующее спецификации. Прочитайте [детали пакета](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы узнать, что находится в разработке и что пока не работает.

## Начало работы с MCP

Класс [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) является точкой входа для определения сервера MCP. Он абстрактный и может быть определён в любом месте. В вашем приложении Sisk может быть один или несколько провайдеров MCP.

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

Если ваше приложение будет предоставлять только один провайдер MCP, вы можете использовать singleton‑конструктор:

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

## Создание JSON‑схем для функций

Библиотека [Sisk.ModelContextProtocol] использует форк [LightJson](https://github.com/CypherPotato/LightJson) для работы с JSON и JSON‑схемами. Эта реализация предоставляет удобный конструктор JSON‑схемы для различных объектов:

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

Пример:

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

Получается следующая схема:

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

## Обработка вызовов функций

Функция, определённая в параметре `executionHandler` класса [McpTool](/api/Sisk.ModelContextProtocol.McpTool), предоставляет `JsonObject`, содержащий аргументы вызова, которые можно читать плавно:

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

## Результаты функций

Объект [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) предоставляет три метода для создания контента ответа инструмента:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): создаёт аудио‑ответ для клиента MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): создаёт изображение‑ответ для клиента MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): создаёт текстовый ответ (по умолчанию) для клиента MCP.

Кроме того, можно объединить несколько разных контентов в один JSON‑ответ инструмента:

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

## Продолжение работы

Протокол контекста модели — это протокол коммуникации для моделей агентов и приложений, которые предоставляют им контент. Это новый протокол, поэтому его спецификация постоянно обновляется с удалением устаревших элементов, добавлением новых возможностей и изменениями, которые могут ломать совместимость.

Важно понять, какие проблемы решает [Model Context Protocol](https://modelcontextprotocol.io/docs/ru/getting-started/intro), прежде чем начинать строить приложения агентов.

Также прочитайте спецификацию пакета [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы понять его прогресс, статус и возможности.