# Начало работы с Sisk

Sisk может работать в любой среде .NET. В этом руководстве мы научим вас, как создать приложение Sisk с использованием .NET. Если вы еще не установили его, пожалуйста, загрузите SDK отсюда [https://dotnet.microsoft.com/en-us/download/dotnet/7.0](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).

В этом учебном пособии мы рассмотрим, как создать структуру проекта, получить запрос, получить параметр URL и отправить ответ. В этом руководстве мы сосредоточимся на создании простого сервера с использованием C#. Вы также можете использовать свой любимый язык программирования.

> [!NOTE]
> Вам может быть интересно ознакомиться с проектом quickstart. Дополнительную информацию можно найти в этом репозитории [https://github.com/sisk-http/quickstart](https://github.com/sisk-http/quickstart).

## Создание проекта

Назовем наш проект "My Sisk Application". После того, как вы настроили .NET, вы можете создать свой проект с помощью следующей команды:

```bash
dotnet new console -n my-sisk-application
```

Затем перейдите в каталог вашего проекта и установите Sisk с помощью инструмента .NET:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Дополнительные способы установки Sisk в вашем проекте можно найти [здесь](https://www.nuget.org/packages/Sisk.HttpServer/).

Теперь давайте создадим экземпляр нашего HTTP-сервера. В этом примере мы настроим его для прослушивания на порту 5000.

## Создание HTTP-сервера

Sisk позволяет создавать ваше приложение пошагово вручную, так как он маршрутизирует к объекту HttpServer. Однако это может быть не очень удобно для большинства проектов. Поэтому мы можем использовать метод builder, который упрощает запуск нашего приложения.

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
                Content = new StringContent("Hello, world!")
            };
        });

        await app.StartAsync();
    }
}
```

Важно понимать каждый важный компонент Sisk. Позже в этом документе вы узнаете больше о том, как работает Sisk.

## Ручной (упрощенный) настройка

Вы можете узнать, как работает каждый механизм Sisk, в [этом разделе](/docs/advanced/manual-setup) документации, который объясняет поведение и взаимосвязи HttpServer, Router, ListeningPort и других компонентов.
