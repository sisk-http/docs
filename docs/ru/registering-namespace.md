# Настройка резервирования пространств имен в Windows

Sisk работает с сетевым интерфейсом HttpListener, который связывает виртуальный хост с системой для прослушивания запросов.

В Windows это связывание немного ограничено, разрешая связывать только localhost в качестве допустимого хоста. При попытке прослушивать другой хост на сервере возникает ошибка доступа. Это руководство объясняет, как предоставить авторизацию для прослушивания на любом хосте, который вы хотите на системе.

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

:: вставьте префикс здесь, без пробелов или кавычек
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Где в `PREFIX` находится префикс ("Хост->Порт прослушивания"), который будет прослушивать ваш сервер. Он должен быть отформатирован по схеме URL, хосту, порту и слэшу в конце, например:

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

Таким образом, вы можете прослушивать в вашем приложении через:

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