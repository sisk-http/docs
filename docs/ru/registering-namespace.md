# Настройка резервирования имен пространств имен в Windows

Sisk работает с сетевым интерфейсом HttpListener, который связывает виртуальный хост с системой для прослушивания запросов.

В Windows эта связка несколько ограничительна, позволяя только localhost как действительный хост. При попытке прослушивания другого хоста на сервере возникает ошибка отказа в доступе. В этом руководстве объясняется, как предоставить разрешение на прослушивание на любом хосте, который вам нужен в системе.

```bat
@echo off

:: вставьте префикс здесь, без пробелов или кавычек
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Где в `PREFIX` указан префикс ("Хост прослушивания->Порт"), на который будет прослушиваться ваш сервер. Он должен быть отформатирован с использованием схемы URL, хоста, порта и слеша в конце, например:

```bat
SET PREFIX=http://my-application.example.test/
```

Чтобы вы могли прослушивать ваше приложение через:

```csharp
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://my-application.example.test/")
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
