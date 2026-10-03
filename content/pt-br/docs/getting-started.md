---
title: "Começando"
weight: 10
aliases:
  - "/docs/pt-br/getting-started.html"
sourceHash: "92d7e16e172282fe"
---

Bem-vindo à documentação do Sisk!

Sisk é um framework HTTP leve e de código aberto para .NET. Você pode usá-lo para criar um serviço web independente, incorporar um módulo HTTP dentro de uma aplicação existente ou executar um serviço atrás de um proxy reverso com apenas a configuração que você precisa.

Os valores do Sisk incluem transparência de código, modularidade, desempenho e escalabilidade. Ele pode lidar com diferentes estilos de aplicação, incluindo APIs RESTful, serviços JSON‑RPC, WebSockets, Server‑Sent Events e serviço de arquivos estáticos.

Suas principais funcionalidades incluem:

| Recurso | Descrição |
| ------- | --------- |
| [Routing](/docs/fundamentals/routing) | Um roteador de caminhos que suporta prefixos, métodos personalizados, variáveis de caminho, conversores de valores e mais. |
| [Request Handlers](/docs/fundamentals/request-handlers) | Também conhecido como *middlewares*, fornece uma interface para criar seus próprios manipuladores de requisição que atuam antes ou depois de uma ação. |
| [Compression](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression) | Comprima facilmente o conteúdo das respostas com o Sisk. |
| [Web sockets](/docs/features/websockets) | Fornece rotas que aceitam web‑sockets completos, para leitura e escrita no cliente. |
| [Server-sent events](/docs/features/server-sent-events) | Fornece o envio de eventos do servidor para clientes que suportam o protocolo SSE. |
| [Logging](/docs/features/logging) | Log simplificado. Registre erros, acessos, defina rotação de logs por tamanho, múltiplos fluxos de saída para o mesmo log, e mais. |
| [Multi-host](/docs/advanced/multi-host-setup) | Tenha um servidor HTTP para múltiplas portas, e cada porta com seu próprio roteador, e cada roteador com sua própria aplicação. |
| [Server handlers](/docs/advanced/http-server-handlers) | Estenda sua própria implementação do servidor HTTP. Personalize com extensões, melhorias e novos recursos. |

## Primeiros passos

Sisk pode ser executado em qualquer ambiente .NET. Neste guia, ensinaremos como criar uma aplicação Sisk usando .NET. Se ainda não o instalou, por favor baixe o SDK [aqui](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

Neste tutorial, abordaremos como criar uma estrutura de projeto, receber uma requisição, obter um parâmetro de URL e enviar uma resposta. Este guia focará na construção de um servidor simples usando C#. Você também pode usar sua linguagem de programação favorita.

> [!NOTE]
> Você pode estar interessado em um projeto de início rápido. Confira [este repositório](https://github.com/sisk-http/quickstart) para mais informações.

## Criando um Projeto

Vamos chamar nosso projeto de "My Sisk Application". Depois de configurar o .NET, você pode criar seu projeto com o seguinte comando:

```bash
dotnet new console -n my-sisk-application
```

Em seguida, navegue até o diretório do seu projeto e instale o Sisk usando a ferramenta de utilitário do .NET:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Você pode encontrar maneiras adicionais de instalar o Sisk em seu projeto [aqui](https://www.nuget.org/packages/Sisk.HttpServer/).

Agora, vamos criar uma instância do nosso servidor HTTP. Para este exemplo, vamos configurá-lo para escutar na porta 5000.

## Construindo o Servidor HTTP

Sisk permite que você construa sua aplicação passo a passo manualmente, pois ele roteia para o objeto HttpServer. No entanto, isso pode não ser muito conveniente para a maioria dos projetos. Portanto, podemos usar o método builder, que facilita colocar nossa aplicação em funcionamento.

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
            .Build();
        
        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hello, world!")
            };
        });
        
        await app.StartAsync();
    }
}
```

É importante entender cada componente vital do Sisk. Mais adiante neste documento, você aprenderá mais sobre como o Sisk funciona.

## Configuração Manual (avançada)

Você pode aprender como cada mecanismo do Sisk funciona nesta [seção](/docs/advanced/manual-setup) da documentação, que explica o comportamento e as relações entre o HttpServer, Router, ListeningPort e outros componentes.
