# Protocolo de Contexto de Modelo

Es posible construir aplicaciones que proporcionen contexto a modelos de agente usando modelos de lenguaje grande (LLMs) mediante el paquete [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Este paquete expone clases y métodos útiles para construir servidores MCP que funcionan sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Antes de comenzar, tenga en cuenta que este paquete está en desarrollo y puede exhibir comportamientos que no se ajustan a la especificación. Lea los [detalles del paquete](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para conocer lo que está en desarrollo y lo que aún no funciona.

## Empezando con MCP

La clase [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) es el punto de entrada para definir un servidor MCP. Es abstracta y puede definirse en cualquier lugar. Su aplicación Sisk puede tener uno o más proveedores MCP.

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

Si su aplicación solo proporcionará un proveedor MCP, puede usar el singleton del constructor:

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

## Creando Esquemas JSON para Funciones

La biblioteca [Sisk.ModelContextProtocol] utiliza una bifurcación de [LightJson](https://github.com/CypherPotato/LightJson) para la manipulación de JSON y esquemas JSON. Esta implementación proporciona un constructor fluido de esquemas JSON para varios objetos:

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

## Manejo de Llamadas a Funciones

La función definida en el parámetro `executionHandler` de [McpTool](/api/Sisk.ModelContextProtocol.McpTool) proporciona un JsonObject que contiene los argumentos de la llamada y que puede leerse de forma fluida:

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

## Resultados de Funciones

El objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) proporciona tres métodos para crear contenido para una respuesta de herramienta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): crea una respuesta basada en audio para el cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): crea una respuesta basada en imagen para el cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): crea una respuesta basada en texto (la predeterminada) para el cliente MCP.

Además, es posible combinar múltiples contenidos diferentes en una sola respuesta JSON de herramienta:

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

## Continuar el Trabajo

El Protocolo de Contexto de Modelo es un protocolo de comunicación para modelos de agente y aplicaciones que les proporcionan contenido. Es un protocolo nuevo, por lo que es común que su especificación se actualice constantemente con deprecaciones, nuevas características y cambios disruptivos.

Es crucial comprender los problemas que resuelve el [Model Context Protocol](https://modelcontextprotocol.io/docs/es/getting-started/intro) antes de comenzar a construir aplicaciones de agente.

También lea la especificación del paquete [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para comprender su progreso, estado y lo que se puede hacer con él.