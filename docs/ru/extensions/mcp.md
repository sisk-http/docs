# Протокол контекста модели

Возможно построить приложения, которые предоставляют контекст моделям агентов с помощью больших языковых моделей (LLM) с использованием пакета [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

    dotnet add package Sisk.ModelContextProtocol

Этот пакет предоставляет полезные классы и методы для создания серверов MCP, работающих через [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Прежде чем начать, обратите внимание, что этот пакет находится в стадии разработки и может проявлять поведение, не соответствующее спецификации. Прочитайте [подробности пакета](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы узнать, что находится в стадии разработки и что еще не работает.

## Начало работы с MCP

Класс [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) является точкой входа для определения сервера MCP. Он является абстрактным и может быть определен где угодно. Ваше приложение Sisk может иметь один или несколько провайдеров MCP.

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "Математический сервер",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "Суммирует одно или несколько чисел.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "Числа для суммирования.")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"Результат суммы: {sum:N4}"));
    }));
```

Если ваше приложение будет предоставлять только один провайдер MCP, вы можете использовать singleton-построитель:

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "Математический сервер";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "Суммирует одно или несколько чисел.",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "Числа для суммирования.")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"Результат суммы: {sum:N4}"));
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

## Создание JSON-схем для функций

Библиотека [Sisk.ModelContextProtocol] использует форк [LightJson](https://github.com/CypherPotato/LightJson) для манипуляции JSON и JSON-схемами. Это реализация предоставляет флюентный построитель JSON-схем для различных объектов:

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
                description: "Числа для суммирования.")
        }
    },
    requiredProperties: ["numbers"]);
```

Производит следующую схему:

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
      "description": "Числа для суммирования."
    }
  },
  "required": ["numbers"]
}
```

## Обработка вызовов функций

Функция, определенная в параметре `executionHandler` класса [McpTool](/api/Sisk.ModelContextProtocol.McpTool), предоставляет объект JsonObject, содержащий аргументы вызова, которые можно читать флюентно:

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "Выполнить действие браузера, такое как прокрутка, обновление или навигация.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "Имя действия.")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "Параметр действия."
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // прочитать имя действия. будет бросать исключение, если null или не явный строка
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data определен как необязательный, поэтому он может быть null здесь
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // обработать действие браузера на основе actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Выполнено действие браузера: {actionName}"));
    }));
```

## Результаты функций

Объект [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) предоставляет три метода для создания содержимого ответа для инструмента:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): создает аудио-ответ для клиента MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): создает изображение-ответ для клиента MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): создает текстовый ответ (по умолчанию) для клиента MCP.

Кроме того, можно объединить несколько разных содержимостей в один JSON-ответ инструмента:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // симулировать реальную работу

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Вот скриншот браузера:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## Продолжение работы

Протокол контекста модели является протоколом связи для моделей агентов и приложений, которые предоставляют содержимое им. Это новый протокол, поэтому часто его спецификация обновляется с устаревшими версиями, новыми функциями и критическими изменениями.

Важно понять проблемы, которые решает [Протокол контекста модели](https://modelcontextprotocol.io/docs/ru/getting-started/intro), прежде чем начать строить приложения агентов.

Также прочитайте спецификацию пакета [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы понять его прогресс, статус и что можно сделать с ним.