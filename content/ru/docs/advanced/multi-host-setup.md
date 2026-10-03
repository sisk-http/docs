---
title: "Несколько прослушивающих хостов на сервере"
linkTitle: "Настройка мультихостинга"
weight: 50
aliases:
  - "/docs/ru/advanced/multi-host-setup.html"
sourceHash: "a22de6cfeb6a02de"
---

Фреймворк Sisk всегда поддерживал использование более одного хоста на сервере, то есть один HTTP‑сервер может прослушивать несколько портов, и каждый порт имеет свой собственный роутер и собственный сервис, работающий на нём.

Таким образом, легко разделять обязанности и управлять сервисами на одном HTTP‑сервере с помощью Sisk. Пример ниже показывает создание двух ListeningHost, каждый из которых прослушивает свой порт, имеет отдельный роутер и действия.

Читайте [manually creating your app](/docs/advanced/manual-setup), чтобы понять детали этой абстракции.

```cs
static void Main(string[] args)
{
    // создаём два прослушивающих хоста, каждый из которых имеет свой роутер
    // и прослушивает свой порт
    //
    ListeningHost hostA = new ListeningHost();
    hostA.Ports = [new ListeningPort(12000)];
    hostA.Router = new Router();
    hostA.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host A!"));

    ListeningHost hostB = new ListeningHost();
    hostB.Ports = [new ListeningPort(12001)];
    hostB.Router = new Router();
    hostB.Router.MapGet("/", request => new HttpResponse().WithContent("Hello from the host B!"));
    
    // создаём конфигурацию сервера и добавляем в неё оба
    // прослушивающих хоста
    //
    HttpServerConfiguration configuration = new HttpServerConfiguration();
    configuration.ListeningHosts.Add(hostA);
    configuration.ListeningHosts.Add(hostB);

    // создаём HTTP‑сервер, использующий указанную
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
