# Model Context Protocol

Es ist möglich, Anwendungen zu erstellen, die Kontext für Agentenmodelle mithilfe von großen Sprachmodellen (LLMs) über das Paket [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) bereitstellen:

```bash
dotnet add package Sisk.ModelContextProtocol
```

Dieses Paket stellt nützliche Klassen und Methoden zur Verfügung, um MCP-Server zu erstellen, die über [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) funktionieren.

> [!NOTE]
>
> Bevor Sie beginnen, beachten Sie, dass dieses Paket in der Entwicklung ist und Verhaltensweisen aufweisen kann, die nicht der Spezifikation entsprechen. Lesen Sie die [Paketdetails](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), um zu erfahren, was sich in der Entwicklung befindet und was noch nicht funktioniert.

## Einstieg mit MCP

Die Klasse [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) ist der Einstiegspunkt zur Definition eines MCP-Servers. Sie ist abstrakt und kann überall definiert werden. Ihre Sisk-Anwendung kann einen oder mehrere MCP-Provider haben.

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

Wenn Ihre Anwendung nur einen MCP-Provider bereitstellen soll, können Sie den Singleton des Builders verwenden:

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

## Erstellen von JSON-Schemas für Funktionen

Die Bibliothek [Sisk.ModelContextProtocol] verwendet einen Fork von [LightJson](https://github.com/CypherPotato/LightJson) für JSON- und JSON-Schema-Manipulation. Diese Implementierung bietet einen flüssigen JSON-Schema-Builder für verschiedene Objekte:

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

Beispiel:

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

Erzeugt das folgende Schema:

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

## Behandlung von Funktionsaufrufen

Die in der `executionHandler`-Parameter von [McpTool](/api/Sisk.ModelContextProtocol.McpTool) definierte Funktion liefert ein JsonObject, das die Aufrufargumente enthält und flüssig gelesen werden kann:

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

## Funktionsresultate

Das Objekt [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) bietet drei Methoden zur Erstellung von Inhalten für eine Tool-Antwort:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): erstellt eine audio-basierte Antwort für den MCP-Client.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): erstellt eine bildbasierte Antwort für den MCP-Client.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): erstellt eine textbasierte Antwort (Standard) für den MCP-Client.

Zusätzlich ist es möglich, mehrere verschiedene Inhalte zu einer einzigen JSON-Tool-Antwort zu kombinieren:

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

## Weiterarbeit

Das Model Context Protocol ist ein Kommunikationsprotokoll für Agentenmodelle und Anwendungen, die ihnen Inhalte bereitstellen. Es ist ein neues Protokoll, daher ist es üblich, dass seine Spezifikation ständig mit Deprecations, neuen Features und Breaking Changes aktualisiert wird.

Es ist entscheidend, die Probleme zu verstehen, die das [Model Context Protocol](https://modelcontextprotocol.io/docs/de/getting-started/intro) löst, bevor man mit dem Aufbau von Agentenanwendungen beginnt.

Lesen Sie auch die Spezifikation des Pakets [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), um dessen Fortschritt, Status und mögliche Einsatzmöglichkeiten zu verstehen.