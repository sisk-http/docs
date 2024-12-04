# Множественные прослушивающие хосты на сервере

Фреймворк Sisk всегда поддерживал использование более одного хоста на сервере, то есть одинокий HTTP-сервер может прослушивать несколько портов, и каждый порт имеет свой собственный роутер и свою собственную службу.

Таким образом, легко разделять обязанности и управлять службами на одиночном HTTP-сервере с помощью Sisk. Пример ниже демонстрирует создание двух прослушивающих хостов, каждый из которых прослушивает другой порт, с разными роутерами и действиями.

Подробнее об этой абстракции можно узнать в разделе [ручное создание вашего приложения](/v1/getting-started.md#manually-creating-your-app).

```cs
static void Main(string[] args)
{
    // создаем два прослушивающих хоста, каждый из которых имеет свой роутер и
    // прослушивает свой собственный порт
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.SetRoute(RouteMethod.Get, "/", request => new HttpResponse().WithContent("Привет от хоста B!"));

    // создаем конфигурацию сервера и добавляем оба
    // прослушивающих хоста на него
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

    Console.WriteLine("Попробуйте обратиться к хосту A по адресу {0}", server.ListeningPrefixes[0]);
    Console.WriteLine("Попробуйте обратиться к хосту B по адресу {0}", server.ListeningPrefixes[1]);

    Thread.Sleep(-1);
}
```