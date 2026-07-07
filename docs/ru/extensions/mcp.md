# Протокол контекста модели

Можно создавать приложения, которые предоставляют контекст моделям‑агентам, используя большие языковые модели (LLM), с помощью пакета [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Этот пакет предоставляет полезные классы и методы для построения MCP‑серверов, работающих по протоколу [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http). Текущая реализация поддерживает инструменты версии протокола `2025-06-18`.

> [!NOTE]
> 
> Прежде чем начать, обратите внимание, что этот пакет находится в разработке и может вести себя не в соответствии со спецификацией. Прочитайте [детали пакета](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы узнать, что находится в разработке и что пока не работает.

## Начало работы с MCP

Класс [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) является точкой входа для определения MCP‑сервера. Это запечатлённый объект‑провайдер, который можно настроить при запуске. Ваше приложение Sisk может иметь один или несколько MCP‑провайдеров.

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

Если ваше приложение будет предоставлять только один MCP‑провайдер, можно воспользоваться синглтоном билдера:

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

Точка входа должна принимать как `GET`, так и `POST` запросы, поэтому `MapAny` — самое простое сопоставление маршрута. `HandleMcpRequestAsync` возвращает [HttpResponse](/api/Sisk.Core.Http.HttpResponse), и ваш маршрут должен вернуть его. Если нужны несколько провайдеров в одном приложении, пропустите синглтон и вызывайте [McpProvider.HandleRequestAsync](/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync) напрямую из каждого маршрута:

```csharp
var mathProvider = new McpProvider("math-server", "Mathematics server", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## Создание JSON‑схем для функций

Библиотека [Sisk.ModelContextProtocol] использует форк [LightJson](https://github.com/CypherPotato/LightJson) для работы с JSON и JSON‑схемами. Эта реализация предоставляет удобный построитель JSON‑Schema для различных объектов:

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

Создаёт следующую схему:

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

Функция, определённая в параметре `executionHandler` класса [McpTool](/api/Sisk.ModelContextProtocol.McpTool), получает `JsonObject`, содержащий аргументы вызова, которые можно читать удобно:

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

Аргументы инструмента проверяются по схеме до выполнения вашего обработчика. Если проверка не проходит, провайдер возвращает ошибочный результат клиенту MCP и не вызывает обработчик инструмента.

## Результаты функций

Объект [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) предоставляет три метода для создания содержимого ответа инструмента:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): создаёт аудио‑ответ для клиента MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): создаёт изображение‑ответ для клиента MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): создаёт текстовый ответ (по умолчанию) для клиента MCP.

Кроме того, можно объединять несколько разных содержимых в один JSON‑ответ инструмента:

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

Провайдер в текущей версии обрабатывает инициализацию, `tools/list`, `tools/call`, `ping` и `notifications/*`. Неподдерживаемые методы JSON‑RPC возвращают ошибочный ответ JSON‑RPC.

## Продолжающаяся работа

Протокол контекста модели — это протокол коммуникации для моделей‑агентов и приложений, предоставляющих им контент. Это новый протокол, поэтому его спецификация часто обновляется: появляются устаревания, новые возможности и несовместимые изменения.

Важно понять, какие задачи решает [Model Context Protocol](https://modelcontextprotocol.io/docs/ru/getting-started/intro), прежде чем начинать создавать агентные приложения.

Также ознакомьтесь со спецификацией пакета [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), чтобы понять его прогресс, статус и возможности использования.