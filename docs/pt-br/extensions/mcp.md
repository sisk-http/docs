# Protocolo de Contexto de Modelo

É possível construir aplicações que fornecem contexto a modelos de agente usando grandes modelos de linguagem (LLMs) com o pacote [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Este pacote expõe classes e métodos úteis para construir servidores MCP que funcionam sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Antes de começar, observe que este pacote está em desenvolvimento e pode apresentar comportamentos que não estão em conformidade com a especificação. Leia os [detalhes do pacote](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para saber o que está em desenvolvimento e o que ainda não funciona.

## Começando com MCP

A classe [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) é o ponto de entrada para definir um servidor MCP. Ela é abstrata e pode ser definida em qualquer lugar. Sua aplicação Sisk pode ter um ou mais provedores MCP.

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

Se sua aplicação fornecer apenas um provedor MCP, você pode usar o singleton do builder:

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

## Criando Schemas JSON para Funções

A biblioteca [Sisk.ModelContextProtocol] usa um fork do [LightJson](https://github.com/CypherPotato/LightJson) para manipulação de JSON e schemas JSON. Esta implementação fornece um construtor fluente de schemas JSON para vários objetos:

- JsonSchema.CreateObjectSchema
- JsonSchema.CreateArraySchema
- JsonSchema.CreateBooleanSchema
- JsonSchema.CreateNumberSchema
- JsonSchema.CreateStringSchema
- JsonSchema.Empty

Exemplo:

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

Produz o seguinte schema:

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

## Lidando com Chamadas de Função

A função definida no parâmetro `executionHandler` de [McpTool](/api/Sisk.ModelContextProtocol.McpTool) fornece um JsonObject contendo os argumentos da chamada que podem ser lidos fluentemente:

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

## Resultados de Função

O objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) fornece três métodos para criar conteúdo para uma resposta de ferramenta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): cria uma resposta baseada em áudio para o cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): cria uma resposta baseada em imagem para o cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): cria uma resposta baseada em texto (padrão) para o cliente MCP.

Além disso, é possível combinar múltiplos conteúdos diferentes em uma única resposta JSON de ferramenta:

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

## Continuando o Trabalho

O Protocolo de Contexto de Modelo é um protocolo de comunicação para modelos de agente e aplicações que fornecem conteúdo a eles. É um protocolo novo, então é comum que sua especificação seja atualizada constantemente com descontinuações, novos recursos e mudanças que quebram compatibilidade.

É crucial entender os problemas que o [Model Context Protocol](https://modelcontextprotocol.io/docs/pt-br/getting-started/intro) resolve antes de começar a construir aplicações de agente.

Leia também a especificação do pacote [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para entender seu progresso, status e o que pode ser feito com ele.