---
title: "Modellkontextprotokoll"
linkTitle: "Model Context Protocol (MCP)"
weight: 10
aliases:
  - "/docs/de/extensions/mcp.html"
sourceHash: "2d6e0f56db05778d"
---

Es ist möglich, Anwendungen zu erstellen, die Agentenmodellen Kontext bereitstellen, indem große Sprachmodelle (LLMs) verwendet werden, mithilfe des Pakets [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/) :

```bash
dotnet add package Sisk.ModelContextProtocol
```

Dieses Paket stellt nützliche Klassen und Methoden zum Erstellen von MCP‑Servern bereit, die über [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) funktionieren. Die aktuelle Implementierung unterstützt Werkzeuge über die Protokollversion `2025-06-18`.

> [!NOTE]
>
> Bevor Sie beginnen, beachten Sie, dass sich dieses Paket noch in der Entwicklung befindet und Verhaltensweisen aufweisen kann, die nicht der Spezifikation entsprechen. Lesen Sie die [Paketdetails](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol), um zu erfahren, was sich noch in Entwicklung befindet und was noch nicht funktioniert.

## Erste Schritte mit MCP

Die Klasse [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) ist der Einstiegspunkt zum Definieren eines MCP‑Servers. Es handelt sich um ein versiegeltes Provider‑Objekt, das beim Start konfiguriert werden kann. Ihre Sisk‑Anwendung kann einen oder mehrere MCP‑Provider besitzen.

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

Wenn Ihre Anwendung nur einen MCP‑Provider bereitstellt, können Sie das Singleton des Builders verwenden:

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

Der Endpunkt muss sowohl `GET`‑ als auch `POST`‑Anfragen akzeptieren, daher ist `MapAny` die einfachste Routen‑Zuordnung. `HandleMcpRequestAsync` gibt ein [HttpResponse](/api/Sisk.Core.Http.HttpResponse) zurück, und Ihre Route muss dieses zurückgeben. Wenn Sie mehrere Provider in einer Anwendung benötigen, verzichten Sie auf das Singleton und rufen Sie [McpProvider.HandleRequestAsync](/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync) direkt aus jeder Route auf:

```csharp
var mathProvider = new McpProvider("math-server", "Mathematics server", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## Erstellen von JSON‑Schemas für Funktionen

Die Bibliothek [Sisk.ModelContextProtocol] verwendet einen Fork von [LightJson](https://github.com/CypherPotato/LightJson) für die Manipulation von JSON und JSON‑Schemas. Diese Implementierung bietet einen fluenten JSON‑Schema‑Builder für verschiedene Objekte:

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

Die im Parameter `executionHandler` von [McpTool](/api/Sisk.ModelContextProtocol.McpTool) definierte Funktion liefert ein JsonObject, das die Aufrufargumente enthält und fluently gelesen werden kann:

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
        // Lese den Aktionsnamen. Wirft eine Ausnahme, wenn null oder kein expliziter String
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data ist nicht zwingend erforderlich, daher kann es hier null sein
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Verarbeite die Browser‑Aktion basierend auf dem Aktionsnamen
        return await Task.FromResult(
            McpToolResult.CreateText($"Performed browser action: {actionName}"));
    }));
```

Werkzeug‑Argumente werden vor dem Aufruf des Handlers anhand des Schemas validiert. Bei einem Validierungsfehler gibt der Provider ein Fehl­ergebnis an den MCP‑Client zurück und ruft den Werkzeug‑Handler nicht auf.

## Funktions‑Ergebnisse

Das Objekt [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) bietet drei Methoden zum Erstellen von Inhalten für eine Werkzeug‑Antwort:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): erstellt eine audio‑basierte Antwort für den MCP‑Client.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): erstellt eine bild‑basierte Antwort für den MCP‑Client.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): erstellt eine text‑basierte Antwort (Standard) für den MCP‑Client.

Zusätzlich ist es möglich, mehrere unterschiedliche Inhalte zu einer einzigen JSON‑Werkzeug‑Antwort zu kombinieren:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simuliert reale Arbeit

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Heres the screenshot of the browser:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

Der Provider verarbeitet derzeit die Initialisierung, `tools/list`, `tools/call`, `ping` und `notifications/*`. Nicht unterstützte JSON‑RPC‑Methoden geben eine JSON‑RPC‑Fehlerantwort zurück.

## Fortlaufende Arbeit

Das Modellkontextprotokoll ist ein Kommunikationsprotokoll für Agentenmodelle und Anwendungen, die Inhalte für diese bereitstellen. Es ist ein neues Protokoll, sodass seine Spezifikation häufig mit Deprecations, neuen Features und Breaking Changes aktualisiert wird.

Es ist entscheidend, die Probleme zu verstehen, die das [Model Context Protocol](https://modelcontextprotocol.io/docs/de/getting-started/intro) löst, bevor Sie mit dem Bau von Agenten‑Anwendungen beginnen.

Lesen Sie außerdem die Spezifikation des [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) Pakets, um dessen Fortschritt, Status und mögliche Anwendungsfälle zu verstehen.
