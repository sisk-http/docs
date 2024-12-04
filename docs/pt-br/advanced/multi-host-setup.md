# Configuração de vários hosts

O Sisk Framework sempre suportou o uso de mais de um host por servidor, ou seja, um único servidor HTTP pode escutar em múltiplos portas e cada porta possui seu próprio roteador e seu próprio serviço em execução nela.

Isso facilita a separação de responsabilidades e a gestão de serviços em um único servidor HTTP com o Sisk. O exemplo abaixo mostra a criação de dois ListeningHosts, cada um escutando em uma porta diferente, com roteadores e ações diferentes.

Leia [criação manual do seu aplicativo](/v1/getting-started.md#manually-creating-your-app) para entender os detalhes sobre essa abstração.

```cs
static void Main(string[] args)
{
    // criar dois hosts de escuta, cada um com seu próprio roteador e
    // escutando em sua própria porta
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Olá do host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Olá do host B!"));

    // criar uma configuração do servidor e adicionar ambos
    // os hosts de escuta nela
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // cria um servidor HTTP que usa a configuração especificada
    //
    HttpServer server = new HttpServer(configuration);

    // inicia o servidor
    server.Start();

    Console.WriteLine("Tente acessar o host A em {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Tente acessar o host B em {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```