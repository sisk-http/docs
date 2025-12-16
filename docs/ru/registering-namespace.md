# Настройка резервирования пространств имён в Windows

> [!NOTE]
> Эта конфигурация является необязательной и требуется только тогда, когда вы хотите, чтобы Sisk прослушивал хосты, отличные от "localhost" в Windows, используя движок HttpListener.

Sisk работает с сетевым интерфейсом HttpListener, который привязывает виртуальный хост к системе для прослушивания запросов.

В Windows такое привязывание несколько ограничено: в качестве допустимого хоста можно привязать только localhost. При попытке прослушивать другой хост сервер выдаёт ошибку доступа. В этом руководстве объясняется, как предоставить разрешение на прослушивание любого желаемого хоста в системе.

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
@echo off

:: вставьте префикс здесь, без пробелов и кавычек
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Где в `PREFIX` указывается префикс ("Listening Host->Port"), на котором ваш сервер будет прослушивать. Он должен быть отформатирован с указанием схемы URL, хоста, порта и завершающего слеша, пример:

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://my-application.example.test/
```

Чтобы вы могли прослушивать в вашем приложении через:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

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