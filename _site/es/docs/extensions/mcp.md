# Protocolo de Contexto de Modelo

Source: https://docs.sisk-framework.org/es/docs/extensions/mcp.html

Es posible crear aplicaciones que proporcionen contexto a modelos de agente usando grandes modelos de lenguaje (LLMs) mediante el paquete [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Este paquete expone clases y métodos útiles para construir servidores MCP que funcionan sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http). La implementación actual soporta herramientas sobre la versión de protocolo `2025-06-18`.

> [!NOTE]
> 
> Antes de comenzar, ten en cuenta que este paquete está en desarrollo y puede presentar comportamientos que no se ajusten a la especificación. Lee los [detalles del paquete](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para conocer qué está en desarrollo y qué aún no funciona.

## Comenzando con MCP

La clase [McpProvider](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.md) es el punto de entrada para definir un servidor MCP. Es un objeto proveedor sellado que puede configurarse al iniciar. Tu aplicación Sisk puede tener uno o más proveedores MCP.

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

Si tu aplicación solo proporcionará un proveedor MCP, puedes usar el singleton del constructor:

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

El punto final debe aceptar tanto solicitudes `GET` como `POST`, por lo que `MapAny` es el mapeo de ruta más sencillo. `HandleMcpRequestAsync` devuelve una [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md), y tu ruta debe devolverla. Si necesitas varios proveedores en una sola aplicación, omite el singleton y llama directamente a [McpProvider.HandleRequestAsync](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync.md) desde cada ruta:

```csharp
var mathProvider = new McpProvider("math-server", "Mathematics server", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## Creando esquemas JSON para funciones

La biblioteca [Sisk.ModelContextProtocol] utiliza un fork de [LightJson](https://github.com/CypherPotato/LightJson) para la manipulación de JSON y esquemas JSON. Esta implementación proporciona un generador fluido de esquemas JSON para varios objetos:

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

## Manejando llamadas de función

La función definida en el parámetro `executionHandler` de [McpTool](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpTool.md) proporciona un JsonObject que contiene los argumentos de la llamada y que puede leerse de forma fluida:

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
        // leer el nombre de la acción. lanzará una excepción si es nulo o no es una cadena explícita
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data está definido como no requerido, por lo que puede ser nulo aquí
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Manejar la acción del navegador según actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Performed browser action: {actionName}"));
    }));
```

Los argumentos de la herramienta se validan contra el esquema antes de que tu manejador se ejecute. Si la validación falla, el proveedor devuelve un resultado de error al cliente MCP y no invoca el manejador de la herramienta.

## Resultados de la función

El objeto [McpToolResult](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.md) ofrece tres métodos para crear contenido para una respuesta de herramienta:

- [CreateAudio(ReadOnlySpan<byte>, string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio.md): crea una respuesta basada en audio para el cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage.md): crea una respuesta basada en imagen para el cliente MCP.
- [CreateText(string)](https://docs.sisk-framework.org/api/Sisk.ModelContextProtocol.McpToolResult.CreateText.md): crea una respuesta basada en texto (por defecto) para el cliente MCP.

Además, es posible combinar varios contenidos diferentes en una única respuesta JSON de herramienta:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simular trabajo real

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Heres the screenshot of the browser:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        );
    }));
```

El proveedor actualmente maneja la inicialización, `tools/list`, `tools/call`, `ping` y `notifications/*`. Los métodos JSON-RPC no soportados devuelven una respuesta de error JSON-RPC.

## Trabajo continuo

El Protocolo de Contexto de Modelo es un protocolo de comunicación para modelos de agente y aplicaciones que les proporcionan contenido. Es un protocolo nuevo, por lo que es común que su especificación se actualice constantemente con deprecaciones, nuevas funcionalidades y cambios incompatibles.

Es fundamental comprender los problemas que resuelve el [Model Context Protocol](https://modelcontextprotocol.io/docs/es/getting-started/intro) antes de comenzar a crear aplicaciones de agente.

También lee la especificación del paquete [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para entender su progreso, estado y lo que se puede hacer con él.
