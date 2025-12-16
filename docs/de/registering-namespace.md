# Konfigurieren von Namensraumreservierungen unter Windows

> [!NOTE]
> Diese Konfiguration ist optional und nur erforderlich, wenn Sie möchten, dass Sisk unter Windows mit dem HttpListener‑Engine auf Hosts außer „localhost“ lauscht.

Sisk arbeitet mit der HttpListener‑Netzwerkschnittstelle, die einen virtuellen Host an das System bindet, um auf Anfragen zu lauschen.

Unter Windows ist diese Bindung etwas restriktiv und erlaubt nur localhost als gültigen Host. Beim Versuch, auf einen anderen Host zu lauschen, wird auf dem Server ein „Access denied“-Fehler ausgelöst. Dieses Tutorial erklärt, wie Sie die Berechtigung erteilen, auf jedem gewünschten Host des Systems zu lauschen.

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

:: Prefix hier einfügen, ohne Leerzeichen oder Anführungszeichen
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Dabei ist `PREFIX` das Präfix („Listening Host->Port“), auf das Ihr Server lauschen soll. Es muss mit dem URL‑Schema, Host, Port und einem abschließenden Schrägstrich formatiert sein, Beispiel:

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

Damit Sie in Ihrer Anwendung darüber lauschen können:

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