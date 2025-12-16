# Protocolo de Contexto de Modelo

É possível construir aplicações que forneçam contexto a modelos de agentes usando grandes modelos de linguagem (LLMs) usando o pacote [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

    dotnet add package Sisk.ModelContextProtocol

Este pacote expõe classes e métodos úteis para construir servidores MCP que funcionam sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).

> [!NOTE]
>
> Antes de começar, note que este pacote está em desenvolvimento e pode exibir comportamentos que não conformam à especificação. Leia os [detalhes do pacote](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para aprender o que está em desenvolvimento e o que ainda não funciona.

## Introdução ao MCP

A classe [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) é o ponto de entrada para definir um servidor MCP. Ela é abstrata e pode ser definida em qualquer lugar. Sua aplicação Sisk pode ter um ou mais provedores MCP.

```csharp
McpProvider mcp = new McpProvider(
    serverName: "math-server",
    serverTitle: "Servidor de matemática",
    serverVersion: new Version(1, 0));

mcp.Tools.Add(new McpTool(
    name: "math_sum",
    description: "Soma um ou mais números.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "numbers",
                JsonSchema.CreateArraySchema(
                    itemsSchema: JsonSchema.CreateNumberSchema(),
                    minItems: 1,
                    description: "Os números a somar.")
            }
        },
        requiredProperties: ["numbers"]),
    executionHandler: async (McpToolContext context) =>
    {
        var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
        var sum = numbers.Sum();
        return await Task.FromResult(McpToolResult.CreateText($"Resultado da soma: {sum:N4}"));
    }));
```

Se sua aplicação fornecer apenas um provedor MCP, você pode usar o construtor singleton:

```csharp
static void Main(string[] args)
{
    using var host = HttpServer.CreateBuilder()
        .UseMcp(mcp =>
        {
            mcp.ServerName = "math-server";
            mcp.ServerTitle = "Servidor de matemática";

            mcp.Tools.Add(new McpTool(
                name: "math_sum",
                description: "Soma um ou mais números.",
                schema: JsonSchema.CreateObjectSchema(
                    properties: new Dictionary<string, JsonSchema>()
                    {
                        { "numbers",
                            JsonSchema.CreateArraySchema(
                                itemsSchema: JsonSchema.CreateNumberSchema(),
                                minItems: 1,
                                description: "Os números a somar.")
                        }
                    },
                    requiredProperties: ["numbers"]),
                executionHandler: async (McpToolContext context) =>
                {
                    var numbers = context.Arguments["numbers"].GetJsonArray().ToArray<double>();
                    var sum = numbers.Sum();
                    return await Task.FromResult(McpToolResult.CreateText($"Resultado da soma: {sum:N4}"));
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

## Criando Esquemas JSON para Funções

A biblioteca [Sisk.ModelContextProtocol] usa uma bifurcação do [LightJson](https://github.com/CypherPotato/LightJson) para manipulação de JSON e esquemas JSON. Esta implementação fornece um construtor de esquema JSON fluente para vários objetos:

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
                description: "Os números a somar.")
        }
    },
    requiredProperties: ["numbers"]);
```

Produz o seguinte esquema:

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
      "description": "Os números a somar."
    }
  },
  "required": ["numbers"]
}
```

## Manipulando Chamadas de Funções

A função definida no parâmetro `executionHandler` da classe [McpTool](/api/Sisk.ModelContextProtocol.McpTool) fornece um JsonObject que contém os argumentos da chamada que podem ser lidos de forma fluente:

```csharp
mcp.Tools.Add(new McpTool(
    name: "browser_do_action",
    description: "Executa uma ação do navegador, como rolar, recarregar ou navegar.",
    schema: JsonSchema.CreateObjectSchema(
        properties: new Dictionary<string, JsonSchema>()
        {
            { "action_name",
                JsonSchema.CreateStringSchema(
                    enums: ["go_back", "refresh", "scroll_bottom", "scroll_top"],
                    description: "O nome da ação.")
            },
            { "action_data",
                JsonSchema.CreateStringSchema(
                    description: "Parâmetro da ação."
                ) }
        },
        requiredProperties: ["action_name"]),
    executionHandler: async (McpToolContext context) =>
    {
        // ler o nome da ação. lançará uma exceção se for nulo ou não for uma string explícita
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data é definido como não obrigatório, então pode ser nulo aqui
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Manipular a ação do navegador com base no actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Ação do navegador realizada: {actionName}"));
    }));
```

## Resultados de Funções

O objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) fornece três métodos para criar conteúdo para uma resposta de ferramenta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): cria uma resposta baseada em áudio para o cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): cria uma resposta baseada em imagem para o cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): cria uma resposta baseada em texto (padrão) para o cliente MCP.

Além disso, é possível combinar vários conteúdos diferentes em uma única resposta JSON de ferramenta:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simular trabalho real

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Aqui está a captura de tela do navegador:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        )
    }));
```

## Continuando o Trabalho

O Protocolo de Contexto de Modelo é um protocolo de comunicação para modelos de agentes e aplicações que fornecem conteúdo a eles. É um protocolo novo, então é comum que sua especificação seja constantemente atualizada com depreciações, novos recursos e alterações significativas.

É crucial entender os problemas que o [Protocolo de Contexto de Modelo](https://modelcontextprotocol.io/docs/pt-br/getting-started/intro) resolve antes de começar a construir aplicações de agentes.

Também leia a especificação do pacote [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para entender seu progresso, status e o que pode ser feito com ele.