---
title: "Protocolo de Contexto de Modelo"
linkTitle: "Protocolo de Contexto de Modelo (MCP)"
weight: 10
aliases:
  - "/docs/pt-br/extensions/mcp.html"
sourceHash: "2d6e0f56db05778d"
---

É possível criar aplicações que fornecem contexto a modelos de agente usando grandes modelos de linguagem (LLMs) com o pacote [Sisk.ModelContextProtocol](https://www.nuget.org/packages/Sisk.ModelContextProtocol/):

```bash
dotnet add package Sisk.ModelContextProtocol
```

Este pacote expõe classes e métodos úteis para construir servidores MCP que operam sobre [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http). A implementação atual oferece ferramentas na versão de protocolo `2025-06-18`.

> [!NOTE]
>
> Antes de começar, observe que este pacote está em desenvolvimento e pode apresentar comportamentos que não estão em conformidade com a especificação. Leia os [detalhes do pacote](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para saber o que está em desenvolvimento e o que ainda não funciona.

## Começando com MCP

A classe [McpProvider](/api/Sisk.ModelContextProtocol.McpProvider) é o ponto de entrada para definir um servidor MCP. É um objeto provedor selado que pode ser configurado na inicialização. Sua aplicação Sisk pode ter um ou mais provedores MCP.

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
                return await req.HandleMcpRequestAsync();
            });
        })
        .Build();

    host.Start();
}
```

O endpoint deve aceitar requisições `GET` e `POST`, portanto `MapAny` é o mapeamento de rota mais simples. `HandleMcpRequestAsync` devolve um [HttpResponse](/api/Sisk.Core.Http.HttpResponse), e sua rota deve retorná‑lo. Se precisar de múltiplos provedores em um único app, ignore o singleton e chame [McpProvider.HandleRequestAsync](/api/Sisk.ModelContextProtocol.McpProvider.HandleRequestAsync) diretamente em cada rota:

```csharp
var mathProvider = new McpProvider("math-server", "Mathematics server", new Version(1, 0));

router.MapAny("/mcp/math", async request =>
{
    return await mathProvider.HandleRequestAsync(request);
});
```

## Criando Schemas JSON para Funções

A biblioteca [Sisk.ModelContextProtocol] usa um fork do [LightJson](https://github.com/CypherPotato/LightJson) para manipulação de JSON e schemas JSON. Esta implementação fornece um construtor fluente de Schemas JSON para diversos objetos:

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

## Manipulando Chamadas de Função

A função definida no parâmetro `executionHandler` de [McpTool](/api/Sisk.ModelContextProtocol.McpTool) fornece um JsonObject contendo os argumentos da chamada, que podem ser lidos de forma fluente:

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
        // ler o nome da ação. lançará exceção se for nulo ou não for uma string explícita
        string actionName = context.Arguments["action_name"].GetString();
        
        // action_data é definido como não obrigatório, portanto pode ser nulo aqui
        string? actionData = context.Arguments["action_data"].MaybeNull()?.GetString();
        
        // Manipular a ação do navegador com base no actionName
        return await Task.FromResult(
            McpToolResult.CreateText($"Performed browser action: {actionName}"));
    }));
```

Os argumentos da ferramenta são validados contra o schema antes que seu manipulador seja executado. Se a validação falhar, o provedor devolve um resultado de erro ao cliente MCP e não invoca o manipulador da ferramenta.

## Resultados de Função

O objeto [McpToolResult](/api/Sisk.ModelContextProtocol.McpToolResult) oferece três métodos para criar conteúdo para a resposta de uma ferramenta:

- [CreateAudio(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateAudio): cria uma resposta baseada em áudio para o cliente MCP.
- [CreateImage(ReadOnlySpan<byte>, string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateImage): cria uma resposta baseada em imagem para o cliente MCP.
- [CreateText(string)](/api/Sisk.ModelContextProtocol.McpToolResult.CreateText): cria uma resposta baseada em texto (padrão) para o cliente MCP.

Além disso, é possível combinar múltiplos conteúdos diferentes em uma única resposta JSON de ferramenta:

```csharp
mcp.Tools.Add(new McpTool(
    ...
    executionHandler: async (McpToolContext context) =>
    {
        // simular trabalho real

        byte[] browserScreenshot = await browser.ScreenshotAsync();
        
        return McpToolResult.Combine(
            McpToolResult.CreateText("Heres the screenshot of the browser:"),
            McpToolResult.CreateImage(browserScreenshot, "image/png")
        );
    }));
```

O provedor atualmente lida com inicialização, `tools/list`, `tools/call`, `ping` e `notifications/*`. Métodos JSON‑RPC não suportados retornam uma resposta de erro JSON‑RPC.

## Trabalho Contínuo

O Protocolo de Contexto de Modelo é um protocolo de comunicação para modelos de agente e aplicações que fornecem conteúdo a eles. É um protocolo novo, portanto é comum que sua especificação seja constantemente atualizada com descontinuações, novos recursos e mudanças incompatíveis.

É crucial entender os problemas que o [Model Context Protocol](https://modelcontextprotocol.io/docs/pt-br/getting-started/intro) resolve antes de começar a construir aplicações de agente.

Também leia a especificação do pacote [Sisk.ModelContextProtocol](https://github.com/sisk-http/core/tree/main/extensions/Sisk.ModelContextProtocol) para compreender seu progresso, status e o que pode ser feito com ele.
