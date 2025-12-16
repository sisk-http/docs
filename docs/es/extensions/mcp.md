# Protocolo de Contexto de Modelo

Es posible construir aplicaciones que proporcionen contexto a modelos de agentes utilizando modelos de lenguaje grande (LLM) utilizando el paquete [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

    dotnet add package Sisk.ModelContextProtocol

Este paquete expone clases y métodos útiles para construir servidores MCP que funcionan sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Antes de empezar, tenga en cuenta que este paquete está en desarrollo y puede exhibir comportamientos que no se ajustan a la especificación. Lea los [detalles del paquete](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para aprender qué está en desarrollo y qué no funciona aún.

## Introducción al MCP

La clase [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) es el punto de entrada para definir un servidor MCP. Es abstracta y se puede definir en cualquier lugar. Su aplicación Sisk puede tener uno o más proveedores MCP.

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "Servidor de matemáticas",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "Suma uno o más números.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "Los números a sumar.")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"Resultado de la suma: {sum:N4}"));
    }));
```

Si su aplicación proporcionará solo un proveedor MCP, puede utilizar el singleton del constructor:

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "Servidor de matemáticas";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "Suma uno o más números.",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "Los números a sumar.")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"Resultado de la suma: {sum:N4}"));
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

## Creación de esquemas JSON para funciones

La biblioteca [Sisk.ModelContextProtocol] utiliza una bifurcación de [LightJson](https://github.com/CypherPotato/LightJson) para la manipulación de JSON y esquemas JSON. Esta implementación proporciona un constructor de esquemas JSON fluido para varios objetos:

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
                description: "Los números a sumar.")
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
      "description": "Los números a sumar."
    }
  },
  "required": ["numbers"]
}
```

## Manejo de llamadas a funciones

La función definida en el parámetro `executionHandler` de [McpTool](/api/Sisk.ModelContextProtocol.McpTool) proporciona un objeto JsonObject que contiene los argumentos de la llamada que se pueden leer de manera fluida:

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "Ejecuta una acción del navegador, como desplazarse, refrescar o navegar.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "El nombre de la acción.")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "Parámetro de la acción."
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // leer el nombre de la acción. lanzará una excepción si es null o no es una cadena explícita
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data está definido como no requerido, por lo que puede ser null aquí
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // manejar la acción del navegador en función del actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Se realizó la acción del navegador: {actionName}"));
    }));
```

## Resultados de funciones

El objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) proporciona tres métodos para crear contenido para una respuesta de herramienta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): crea una respuesta de audio para el cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): crea una respuesta de imagen para el cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): crea una respuesta de texto (predeterminada) para el cliente MCP.

Además, es posible combinar varios contenidos diferentes en una sola respuesta JSON de herramienta:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simular trabajo real

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Aquí está la captura de pantalla del navegador:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## Continuación del trabajo

El Protocolo de Contexto de Modelo es un protocolo de comunicación para modelos de agentes y aplicaciones que proporcionan contenido a ellos. Es un protocolo nuevo, por lo que es común que su especificación se actualice constantemente con deprecaciones, nuevas características y cambios importantes.

Es crucial entender los problemas que el [Protocolo de Contexto de Modelo](https://modelcontextprotocol.io/docs/es/getting-started/intro) resuelve antes de empezar a construir aplicaciones de agentes.

También lea la especificación del paquete [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para entender su progreso, estado y qué se puede hacer con él.