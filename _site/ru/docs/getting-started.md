# Getting started

Source: https://docs.sisk-framework.org/ru/docs/getting-started.html

Welcome to the Sisk documentation!

Sisk is an open-source lightweight HTTP framework for .NET. You can use it to build a standalone web service, embed an HTTP module inside an existing application, or run a service behind a reverse proxy with only the configuration you need.

Sisk's values include code transparency, modularity, performance, and scalability. It can handle different application styles, including RESTful APIs, JSON-RPC services, WebSockets, Server-Sent Events, and static file serving.

It's main features includes:

| Resource | Description |
| ------- | --------- |
| [Routing](https://docs.sisk-framework.org/ru/docs/fundamentals/routing.md) | Маршрутизатор путей, поддерживающий префиксы, пользовательские методы, переменные пути, конвертеры значений и многое другое. |
| [Request Handlers](https://docs.sisk-framework.org/ru/docs/fundamentals/request-handlers.md) | Также известные как *middlewares*, предоставляют интерфейс для создания собственных обработчиков запросов, работающих до или после действия. |
| [Compression](https://docs.sisk-framework.org/ru/docs/fundamentals/responses.md#gzip-deflate-and-brotli-compression) | Легко сжимайте содержимое ответов с помощью Sisk. |
| [Web sockets](https://docs.sisk-framework.org/ru/docs/features/websockets.md) | Предоставляет маршруты, принимающие полноценные веб‑сокеты для чтения и записи клиенту. |
| [Server-sent events](https://docs.sisk-framework.org/ru/docs/features/server-sent-events.md) | Обеспечивает отправку серверных событий клиентам, поддерживающим протокол SSE. |
| [Logging](https://docs.sisk-framework.org/ru/docs/features/logging.md) | Упрощённое логирование. Записывайте ошибки, доступ, определяйте ротацию логов по размеру, несколько потоков вывода для одного лога и многое другое. |
| [Multi-host](https://docs.sisk-framework.org/ru/docs/advanced/multi-host-setup.md) | Позволяет иметь HTTP‑сервер для нескольких портов, каждый из которых со своим маршрутизатором и приложением. |
| [Server handlers](https://docs.sisk-framework.org/ru/docs/advanced/http-server-handlers.md) | Расширяйте собственную реализацию HTTP‑сервера. Настраивайте с помощью расширений, улучшений и новых функций. |

## First steps

Sisk can run in any .NET environment. In this guide, we will teach you how to create a Sisk application using .NET. If you haven't installed it yet, please download the SDK from [here](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

In this tutorial, we will cover how to create a project structure, receive a request, obtain a URL parameter, and send a response. This guide will focus on building a simple server using C#. You can also use your favorite programming language.

> [!NOTE]
> Возможно, вам будет интересен проект quickstart. Смотрите [this repository](https://github.com/sisk-http/quickstart) для получения дополнительной информации.

## Creating a Project

Let's name our project "My Sisk Application." Once you have .NET set up, you can create your project with the following command:

```bash
dotnet new console -n my-sisk-application
```

Next, navigate to your project directory and install Sisk using the .NET utility tool:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

You can find additional ways to install Sisk in your project [here](https://www.nuget.org/packages/Sisk.HttpServer/).

Now, let's create an instance of our HTTP server. For this example, we will configure it to listen on port 5000.

## Building the HTTP Server

Sisk allows you to build your application step by step manually, as it routes to the HttpServer object. However, this may not be very convenient for most projects. Therefore, we can use the builder method, which makes it easier to get our app up and running.

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

It's important to understand each vital component of Sisk. Later in this document, you will learn more about how Sisk works.

## Manual (advanced) setup

You can learn how each Sisk mechanism works in [this section](https://docs.sisk-framework.org/ru/docs/advanced/manual-setup.md) of the documentation, which explains the behavior and relationships between the HttpServer, Router, ListeningPort, and other components.
