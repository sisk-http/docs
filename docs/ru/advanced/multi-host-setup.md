# Несколько прослушивающих хостов на сервере

Фреймворк Sisk всегда поддерживал использование более одного хоста на сервер, то есть один HTTP-сервер может прослушивать несколько портов, и каждый порт имеет свой собственный маршрутизатор и свою службу, работающую на нем.

Таким образом, легко разделить обязанности и управлять службами на одном HTTP-сервере с помощью Sisk. Пример ниже показывает создание двух прослушивающих хостов, каждый из которых прослушивает разный порт, с разными маршрутизаторами и действиями.

Прочитайте [создание приложения вручную](/v1/getting-started.md#manually-creating-your-app), чтобы понять детали об этом абстрактном классе.

```cs
static void Main(string[] args)
{
    // создаем два прослушивающих хоста, каждый из которых имеет свой собственный маршрутизатор и
    // прослушивает свой собственный порт
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста А!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста Б!"));

    // создаем конфигурацию сервера и добавляем оба
    // прослушивающих хоста в нее
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // создаем HTTP-сервер, который использует указанную
    // конфигурацию
    //
    HttpServer server = new HttpServer(configuration);

    // запускаем сервер
    server.Start();

    Console.WriteLine("Попробуйте обратиться к хосту А по адресу {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Попробуйте обратиться к хосту Б по адресу {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```