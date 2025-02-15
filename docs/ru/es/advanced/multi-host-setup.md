# Несколько хостов для прослушивания на сервере

Фреймворк Sisk всегда поддерживал использование нескольких хостов на сервере, то есть один сервер HTTP может прослушивать на нескольких портах, и каждый порт имеет свой собственный маршрутизатор и свой собственный сервис в исполнении.

Таким образом, легко разделить обязанности и управлять сервисами на одном сервере HTTP с помощью Sisk. Пример ниже показывает создание двух ListeningHosts, каждый из которых прослушивает на разных портах, с разными маршрутизаторами и действиями.

Прочитайте [создание приложения вручную](/v1/getting-started.md#manually-creating-your-app), чтобы понять детали об этой абстракции.

```cs
static void Main(string[] args)
{
    // создает два хоста для прослушивания, каждый со своим собственным маршрутизатором и
    // прослушивающий на своем собственном порту
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста А!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста Б!"));

    // создает конфигурацию сервера и добавляет оба хоста для прослушивания
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // создает сервер HTTP, который использует указанную конфигурацию
    //
    HttpServer server = new HttpServer(configuration);

    // запускает сервер
    server.Start();

    Console.WriteLine("Попробуйте обратиться к хосту А по {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Попробуйте обратиться к хосту Б по {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```