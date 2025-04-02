# Introdução

Bem-vindo à documentação do Sisk!

Finalmente, o que é o Sisk Framework? É uma biblioteca leve de código aberto construída com .NET, projetada para ser minimalista, flexível e abstrata. Ela permite que os desenvolvedores criem serviços de internet rapidamente, com pouca ou nenhuma configuração necessária. O Sisk torna possível que seu aplicativo existente tenha um módulo HTTP gerenciado, completo e descartável.

Os valores do Sisk incluem transparência de código, modularidade, desempenho e escalabilidade, e podem lidar com vários tipos de aplicativos, como Restful, JSON-RPC, Web-sockets e mais.

Seus principais recursos incluem:

| Recurso | Descrição |
| ------- | --------- |
| [Routing](/docs/pt-br/fundamentals/routing) | Um roteador de caminhos que suporta prefixos, métodos personalizados, variáveis de caminho, conversões de resposta e mais. |
| [Request Handlers](/docs/pt-br/fundamentals/request-handlers) | Também conhecido como *middlewares*, fornece uma interface para construir seus próprios manipuladores de solicitação que funcionam antes ou após uma solicitação. |
| [Compression](/docs/pt-br/fundamentals/responses#gzip-deflate-and-brotli-compression) | Comprima suas respostas facilmente com o Sisk. |
| [Web sockets](/docs/pt-br/features/websockets) | Fornece rotas que aceitam web-sockets completos, para leitura e escrita no cliente. |
| [Server-sent events](/docs/pt-br/features/server-sent-events) | Fornece o envio de eventos do servidor para clientes que suportam o protocolo SSE. |
| [Logging](/docs/pt-br/features/logging) | Registro de logs simplificado. Registre erros, acesso, defina logs rotativos por tamanho, múltiplos fluxos de saída para o mesmo log e mais. |
| [Multi-host](/docs/pt-br/advanced/multi-host-setup) | Tenha um servidor HTTP para múltiplos ports, e cada port com seu próprio roteador, e cada roteador com seu próprio aplicativo. |
| [Server handlers](/docs/pt-br/advanced/http-server-handlers) | Estenda sua própria implementação do servidor HTTP. Personalize com extensões, melhorias e novos recursos.

## Primeiros passos

O Sisk pode ser executado em qualquer ambiente .NET. Neste guia, vamos ensinar como criar um aplicativo Sisk usando .NET. Se você ainda não o instalou, por favor, baixe o SDK [aqui](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

Neste tutorial, vamos cobrir como criar uma estrutura de projeto, receber uma solicitação, obter um parâmetro de URL e enviar uma resposta. Este guia se concentrará em construir um servidor simples usando C#. Você também pode usar sua linguagem de programação favorita.

> [!NOTE]
> Você pode estar interessado em um projeto de início rápido. Verifique [este repositório](https://github.com/sisk-http/quickstart) para obter mais informações.

## Criando um Projeto

Vamos nomear nosso projeto "Meu Aplicativo Sisk". Uma vez que você tenha o .NET configurado, você pode criar seu projeto com o seguinte comando:

```bash
dotnet new console -n meu-aplicativo-sisk
```

Em seguida, navegue até o diretório do seu projeto e instale o Sisk usando a ferramenta de utilitário .NET:

```bash
cd meu-aplicativo-sisk
dotnet add package Sisk.HttpServer
```

Você pode encontrar maneiras adicionais de instalar o Sisk em seu projeto [aqui](https://www.nuget.org/packages/Sisk.HttpServer/).

Agora, vamos criar uma instância do nosso servidor HTTP. Para este exemplo, vamos configurá-lo para ouvir na porta 5000.

## Construindo o Servidor HTTP

O Sisk permite que você construa seu aplicativo passo a passo manualmente, pois ele roteia para o objeto HttpServer. No entanto, isso pode não ser muito conveniente para a maioria dos projetos. Portanto, podemos usar o método de construtor, que torna mais fácil colocar nosso aplicativo em execução.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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
                Content = new StringContent("Olá, mundo!")
            };
        });
        
        await app.StartAsync();
    }
}
```

É importante entender cada componente vital do Sisk. Mais tarde, neste documento, você aprenderá mais sobre como o Sisk funciona.

## Configuração manual (avançada)

Você pode aprender como cada mecanismo do Sisk funciona [nesta seção](/docs/pt-br/advanced/manual-setup) da documentação, que explica o comportamento e as relações entre o HttpServer, Router, ListeningPort e outros componentes.