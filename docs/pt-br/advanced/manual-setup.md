# Configuração manual (avançada)

Nesta seção, criaremos nosso servidor HTTP sem nenhum padrão pré-definido, de forma completamente abstrata. Aqui, você pode construir manualmente como seu servidor HTTP funcionará. Cada ListeningHost tem um roteador e um servidor HTTP pode ter vários ListeningHosts, cada um apontando para um host diferente em uma porta diferente.

Primeiro, precisamos entender o conceito de solicitação/resposta. É bastante simples: para cada solicitação, deve haver uma resposta. O Sisk segue esse princípio também. Vamos criar um método que responde com uma mensagem "Olá, Mundo!" em HTML, especificando o código de status e cabeçalhos.

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Olá, mundo!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

A próxima etapa é associar esse método a uma rota HTTP.

## Roteadores

Roteadores são abstrações de rotas de solicitação e servem como ponte entre solicitações e respostas para o serviço. Roteadores gerenciam rotas de serviço, funções e erros.

Um roteador pode ter várias rotas e cada rota pode realizar operações diferentes nesse caminho, como executar uma função, servir uma página ou fornecer um recurso do servidor.

Vamos criar nosso primeiro roteador e associar nosso método `IndexPage` ao caminho de índice.

```csharp
Router mainRouter = new Router();

// SetRoute associará todas as rotas de índice com nosso método.
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

Agora nosso roteador pode receber solicitações e enviar respostas. No entanto, `mainRouter` não está vinculado a um host ou servidor, então não funcionará sozinho. A próxima etapa é criar nosso ListeningHost.

## Hosts de Escuta e Portas

Um [ListeningHost](/api/Sisk.Core.Http.ListeningHost) pode hospedar um roteador e várias portas de escuta para o mesmo roteador. Uma [ListeningPort](/api/Sisk.Core.Http.ListeningPort) é um prefixo onde o servidor HTTP escutará.

Aqui, podemos criar um `ListeningHost` que aponta para dois endpoints para nosso roteador:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Agora nosso servidor HTTP escutará os endpoints especificados e redirecionará suas solicitações para nosso roteador.

## Configuração do Servidor

A configuração do servidor é responsável pela maior parte do comportamento do servidor HTTP em si. Nessa configuração, podemos associar `ListeningHosts` com nosso servidor.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Adicione nosso ListeningHost a essa configuração do servidor
```

Em seguida, podemos criar nosso servidor HTTP:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Inicia o servidor
Console.ReadKey(); // Impede que o aplicativo saia
```

Agora podemos compilar nosso executável e executar nosso servidor HTTP com o comando:

```bash
dotnet watch
```

Em tempo de execução, abra seu navegador e navegue até o caminho do servidor, e você deve ver:

<img src="/assets/img/localhost.png" >