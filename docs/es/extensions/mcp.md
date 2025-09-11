# Protocolo de Contexto de Modelo

Es posible construir aplicaciones que proporcionen contexto a modelos agónicos usando modelos de lenguaje grande (LLM) con el paquete [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Este paquete expone clases y métodos útiles para construir servidores MCP que funcionan mediante [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Antes de comenzar, observe que este paquete está en desarrollo y puede presentar comportamientos no conformes con la especificación. Lea los [detalles del paquete](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para saber qué está en desarrollo y qué no funciona todavía.

## Iniciando con MCP

La clase [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) es el punto de entrada para definir un servidor MCP. Es abstracta, puede definirse en cualquier lugar. Su aplicación Sisk puede tener uno o más proveedores MCP.

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

Si su aplicación solo provee un proveedor MCP, puede usar el singleton del builder:

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

## Creando esquemas JSON de funciones

La biblioteca [Sisk.ModelContextProtocol] usa un fork de [LightJson](https://github.com/CypherPotato/LightJson) para manipulación del JSON y del esquema JSON. Esta implementación proporciona un builder de JSON Schema fluido para diversos objetos:

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

Ejemplo:

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

Produce el siguiente esquema:

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

## Manejo de llamadas de función

La función definida en el parámetro `executionHandler` de [McpTool](/api/Sisk.ModelContextProtocol.McpTool) proporciona un objeto JsonObject que contiene los argumentos de llamada que puede leerse de forma fluida:

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

## Resultados de funciones

El objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) proporciona tres métodos de creación de contenido para una respuesta de herramienta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): crea una respuesta basada en un audio para el cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): crea una respuesta basada en una imagen al cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): crea una respuesta basada en un texto (el estándar) al cliente MCP.

Además, es posible combinar varios contenidos diferentes en una única respuesta de una herramienta JSON:

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

## Continuar trabajando

El Model Context Protocol es un protocolo de comunicación de modelos agónicos y aplicaciones que proporcionan contenido a ellos y es un protocolo nuevo, por lo tanto, es común que su especificación se actualice constantemente con deprecaciones, nuevas características y cambios críticos.

Es fundamental entender los problemas que el [Model Context Protocol](https://modelcontextprotocol.io/docs/es/getting-started/intro) resuelve antes de comenzar a crear aplicaciones agónicas.

Lea también la especificación del paquete [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para entender su progreso, avance y lo que es posible hacer con él.