# Konfiguration von Namensraumreservierungen auf Windows

Sisk arbeitet mit der HttpListener-Netzwerkschnittstelle, die einen virtuellen Host an das System bindet, um Anfragen zu empfangen.

Unter Windows ist diese Bindung ein bisschen restriktiv und erlaubt nur localhost als gültigen Host. Wenn man versucht, auf einen anderen Host zuzugreifen, wird auf dem Server ein Zugriffsverweigerungsfehler ausgelöst. Dieses Tutorial erklärt, wie man die Autorisierung erteilt, um auf jeden Host auf dem System zuzuhören, den man möchte.

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

:: Präfix hier einfügen, ohne Leerzeichen oder Anführungszeichen
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Wo `PREFIX` das Präfix ("Zuhör-Host->Port") ist, auf das der Server hört. Es muss im URL-Schema, Host, Port und einem Schrägstrich am Ende formatiert sein, Beispiel:

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://my-anwendung.example.test/
```

Damit Sie in Ihrer Anwendung über Folgendes zugehört werden können:

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
            .UseListeningPort("http://my-anwendung.example.test/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hallo, Welt!")
            };
        });

        await app.StartAsync();
    }
}
```