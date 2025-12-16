# Modell-Kontext-Protokoll

Es ist möglich, Anwendungen zu erstellen, die Kontext für Agenten-Modelle mit großen Sprachmodellen (LLMs) bereitstellen, indem das [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) Paket verwendet wird:

    dotnet add package Sisk.ModelContextProtocol

Dieses Paket enthält nützliche Klassen und Methoden zum Erstellen von MCP-Servern, die über [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) funktionieren.

> [!NOTE]
>
> Bevor Sie beginnen, beachten Sie, dass dieses Paket in Entwicklung ist und Verhaltensweisen aufweisen kann, die nicht der Spezifikation entsprechen. Lesen Sie die [Paketdetails](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), um zu erfahren, was in Entwicklung ist und was noch nicht funktioniert.

## Erste Schritte mit MCP

Die [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) Klasse ist der Einstiegspunkt für die Definition eines MCP-Servers. Sie ist abstrakt und kann überall definiert werden. Ihre Sisk-Anwendung kann einen oder mehrere MCP-Anbieter haben.

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "Mathematik-Server",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "Summiert eine oder mehrere Zahlen.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "Die Zahlen zur Summierung.")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"Summiertes Ergebnis: {sum:N4}"));
    }));
```

Wenn Ihre Anwendung nur einen MCP-Anbieter bereitstellt, können Sie den Singleton des Erstellers verwenden:

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "Mathematik-Server";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "Summiert eine oder mehrere Zahlen.",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "Die Zahlen zur Summierung.")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"Summiertes Ergebnis: {sum:N4}"));
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

## Erstellen von JSON-Schemata für Funktionen

Die [Sisk.ModelContextProtocol] Bibliothek verwendet eine Fork von [LightJson](https://github.com/CypherPotato/LightJson) für JSON- und JSON-Schema-Manipulation. Diese Implementierung bietet einen flüssigen JSON-Schema-Builder für verschiedene Objekte:

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
                description: "Die Zahlen zur Summierung.")
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
      "description": "Die Zahlen zur Summierung."
    }
  },
  "required": ["numbers"]
}
```

## Behandlung von Funktionsaufrufen

Die Funktion, die im `executionHandler`-Parameter von [McpTool](/api/Sisk.ModelContextProtocol.McpTool) definiert ist, bietet ein JsonObject, das die Aufrufargumente enthält, das flüssig gelesen werden kann:

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "Führt eine Browser-Aktion aus, wie z.B. Scrollen, Aktualisieren oder Navigieren.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "Der Name der Aktion.")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "Aktionsparameter."
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // liest den Aktionennamen. Wirft eine Ausnahme, wenn null oder kein expliziter String
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data ist als nicht erforderlich definiert, daher kann es hier null sein
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Behandelt die Browser-Aktion basierend auf dem Aktionennamen
        return await Task.FromResult(
            McpToolResult.CreateText($"Führte Browser-Aktion aus: {actionName}"));
    }));
```

## Funktionsergebnisse

Das [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) Objekt bietet drei Methoden zum Erstellen von Inhalten für eine Tool-Antwort:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): Erstellt eine audio-basierte Antwort für den MCP-Client.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): Erstellt eine bild-basierte Antwort für den MCP-Client.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): Erstellt eine text-basierte Antwort (Standard) für den MCP-Client.

Es ist auch möglich, mehrere verschiedene Inhalte in eine einzelne JSON-Tool-Antwort zu kombinieren:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simuliert reale Arbeit

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Hier ist das Screenshot des Browsers:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## Fortsetzung der Arbeit

Das Modell-Kontext-Protokoll ist ein Kommunikationsprotokoll für Agenten-Modelle und Anwendungen, die Inhalte für sie bereitstellen. Es ist ein neues Protokoll, daher ist es üblich, dass seine Spezifikation ständig aktualisiert wird mit Veraltungen, neuen Funktionen und breaking changes.

Es ist wichtig, die Probleme zu verstehen, die das [Modell-Kontext-Protokoll](https://modelcontextprotocol.io/docs/de/getting-started/intro) löst, bevor Sie beginnen, Agenten-Anwendungen zu erstellen.

Lesen Sie auch die Spezifikation des [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) Pakets, um seinen Fortschritt, Status und was damit gemacht werden kann, zu verstehen.