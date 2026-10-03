# Configuração manual (avançada)

Source: https://docs.sisk-framework.org/pt-br/docs/advanced/manual-setup.html

Use a configuração manual quando precisar montar os componentes do servidor por conta própria, como quando um processo deve expor vários hosts, portas, roteadores ou configuração personalizada do servidor. Para a maioria das aplicações, a API de construtor é mais curta e deve ser preferida. A configuração manual é útil quando você deseja controle direto sobre as quatro peças principais: um `Router`, um ou mais objetos `ListeningHost`, um `HttpServerConfiguration` e o `HttpServer` final.

Primeiro, precisamos entender o conceito de requisição/resposta. É bastante simples: para cada requisição, deve haver uma resposta. O Sisk segue esse princípio também. Vamos criar um método que responde com a mensagem "Hello, World!" em HTML, especificando o código de status e os cabeçalhos.

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
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

O próximo passo é associar este método a uma rota HTTP.

## Roteadores

Roteadores são abstrações de rotas de requisição e servem como ponte entre requisições e respostas para o serviço. Roteadores gerenciam rotas do serviço, funções e erros.

Um roteador pode ter várias rotas, e cada rota pode executar diferentes operações naquele caminho, como executar uma função, servir uma página ou fornecer um recurso do servidor.

Vamos criar nosso primeiro roteador e associar o método `IndexPage` ao caminho de índice.

```csharp
Router mainRouter = new Router();

mainRouter.MapGet("/", IndexPage);
```

Agora nosso roteador pode receber requisições e enviar respostas. Contudo, `mainRouter` não está vinculado a um host ou a um servidor, portanto não funcionará por conta própria. O próximo passo é criar nosso ListeningHost.

## Hosts de escuta e portas

Um [ListeningHost](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningHost.md) pode hospedar um roteador e múltiplas portas de escuta para o mesmo roteador. Um [ListeningPort](https://docs.sisk-framework.org/api/Sisk.Core.Http.ListeningPort.md) é um prefixo onde o servidor HTTP escutará.

Aqui, podemos criar um `ListeningHost` que aponta para dois endpoints para o nosso roteador:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Agora nosso servidor HTTP escutará os endpoints especificados e redirecionará suas requisições para o nosso roteador.

## Configuração do servidor

A configuração do servidor é responsável pela maior parte do comportamento do próprio servidor HTTP. Nesta configuração, podemos associar `ListeningHosts` ao nosso servidor.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Adiciona nosso ListeningHost a esta configuração de servidor
```

Opções comuns de configuração do servidor:

| Propriedade | Padrão | Quando usar | Observações |
| --- | --- | --- | --- |
| [RemoteRequestsAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction.md) | `RequestListenAction.Accept` | O serviço deve rejeitar requisições não locais, a menos que venham através de um proxy reverso confiável. | Defina como `Drop` somente quando a topologia de implantação estiver clara. |
| [IncludeRequestIdHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader.md) | `false` | Clientes ou proxies precisam do ID de requisição do Sisk no cabeçalho de resposta `X-Request-Id`. | Combine com logs que incluam `HttpRequest.RequestId`. |
| [IdleConnectionTimeout](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout.md) | `120` segundos | Conexões keep-alive ociosas devem ser fechadas mais cedo ou mais tarde. | Isso é aplicado pelo mecanismo HTTP. |
| [NormalizeHeadersEncodings](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings.md) | `false` | Você recebe cabeçalhos com incompatibilidade de codificação. | Isso tem um custo de processamento; deixe desativado a menos que seja necessário. |
| [SendSiskHeader](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader.md) | `true` | Você deseja ocultar ou expor o cabeçalho `X-Powered-By` do Sisk. | Desative-o para políticas de cabeçalho de produção mais rigorosas. |
| [OptionsLogMode](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode.md) | `LogOutput.Both` | Você deseja reduzir ou redirecionar logs gerados pelo tratamento automático de `OPTIONS`. | Usa os mesmos valores de modo de log que as rotas. |
| [AsyncRequestProcessing](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing.md) | `true` | Você precisa de processamento determinístico de requisição única para diagnóstico. | Desativá-lo limita a taxa de transferência. |
| [DisposeDisposableContextValues](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues.md) | `true` | Valores do bag de requisição que implementam `IDisposable` devem ser descartados automaticamente. | Mantenha habilitado a menos que a propriedade seja gerenciada em outro lugar. |
| [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) | `true` | Manipuladores de valor devem receber enumeráveis assíncronos como valores enumeráveis bloqueantes. | Desative quando você implementar seu próprio tratamento de fluxo assíncrono. |
| [KeepAlive](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive.md) | `true` | Conexões devem permanecer reutilizáveis após respostas. | Desative para clientes ou intermediários que não lidam bem com conexões persistentes. |
| [ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md) | `false` | Rotas GET devem redirecionar para uma URL com barra final. | Aplica-se apenas a rotas não regex. |
| [MaximumContentLength](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength.md) | `0` | Corpos de requisição precisam de um limite de tamanho. | `0` significa ilimitado até que limites do framework ou de memória sejam atingidos. |
| [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md) | `false` | Respostas devem ser comprimidas automaticamente quando o cliente as suporta. | Respostas `CompressedContent` existentes não são comprimidas novamente. |

Em seguida, podemos criar nosso servidor HTTP:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Inicia o servidor
Console.ReadKey(); // Impede que a aplicação saia
```

Agora podemos compilar nosso executável e executar nosso servidor HTTP com o comando:

```bash
dotnet watch
```

Em tempo de execução, abra seu navegador e navegue até o caminho do servidor, e você deverá ver:

<img src="/assets/img/localhost.png" >
