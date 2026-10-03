---
title: "Múltiplos hosts de escuta por servidor"
linkTitle: "Configuração multi-host"
weight: 50
aliases:
  - "/docs/pt-br/advanced/multi-host-setup.html"
sourceHash: "a22de6cfeb6a02de"
---

O Sisk Framework sempre suportou o uso de mais de um host por servidor, ou seja, um único servidor HTTP pode escutar em várias portas e cada porta tem seu próprio roteador e seu próprio serviço em execução.

Dessa forma, é fácil separar responsabilidades e gerenciar serviços em um único servidor HTTP com o Sisk. O exemplo abaixo mostra a criação de dois ListeningHosts, cada um escutando em uma porta diferente, com roteadores e ações distintas.

Leia [manually creating your app](/docs/advanced/manual-setup) para entender os detalhes sobre essa abstração.

```cs
static void Main(string[] args)
{
    // cria dois hosts de escuta, cada um com seu próprio roteador e
    // escuta em sua própria porta
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host B!"));
 
    // cria uma configuração de servidor e adiciona ambos
    // os hosts de escuta nela
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // cria um servidor HTTP que usa a
    // configuração especificada
    //
    HttpServer server = new HttpServer(configuration);

    // inicia o servidor
    server.Start();

    Console.WriteLine("Try to reach host A in {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Try to reach host B in {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```
