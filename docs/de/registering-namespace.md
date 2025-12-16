# Konfiguration von Namensraumreservierungen auf Windows

Sisk arbeitet mit der HttpListener-Netzwerkschnittstelle, die einen virtuellen Host an das System bindet, um Anfragen zu hören.

Auf Windows ist diese Bindung ein bisschen restriktiv und erlaubt nur localhost als gültigen Host. Wenn versucht wird, einem anderen Host zuzuhören, wird auf dem Server ein Zugriff verweigert-Fehler ausgelöst. Dieses Tutorial erklärt, wie man die Autorisierung erteilt, um auf jedem Host zuzuhören, den man auf dem System möchte.

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

Wo `PREFIX` das Präfix ("Zuhör-Host->Port") ist, auf das der Server hört. Es muss im URL-Schema, Host, Port und einem Schrägstrich am Ende formatiert werden, Beispiel:

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

Damit Sie in Ihrer Anwendung über gehört werden können:

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