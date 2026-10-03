---
title: "Konfigurieren von Namensraumreservierungen unter Windows"
linkTitle: "Windows-Setup"
weight: 70
aliases:
  - "/docs/de/registering-namespace.html"
sourceHash: "c0adab5c6258ef68"
---

> [!NOTE]
> Diese Konfiguration ist optional und nur erforderlich, wenn Sie möchten, dass Sisk unter Windows mit dem HttpListener‑Engine auf Hosts außer „localhost“ lauscht.

Sisk arbeitet mit der HttpListener‑Netzwerkschnittstelle, die einen virtuellen Host an das System bindet, um auf Anfragen zu lauschen.

Unter Windows ist diese Bindung etwas restriktiv und erlaubt nur localhost als gültigen Host. Beim Versuch, auf einen anderen Host zu lauschen, wird auf dem Server ein „Access denied“-Fehler ausgelöst. Dieses Tutorial erklärt, wie Sie die Berechtigung erteilen, auf jedem gewünschten Host des Systems zu lauschen.

```bat {title="Namespace Setup.bat"}
@echo off

:: Prefix hier einfügen, ohne Leerzeichen oder Anführungszeichen
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Dabei ist `PREFIX` das Präfix („Listening Host->Port“), auf das Ihr Server lauschen soll. Es muss mit dem URL‑Schema, Host, Port und einem abschließenden Schrägstrich formatiert sein, Beispiel:

```bat {title="Namespace Setup.bat"}
SET PREFIX=http://my-application.example.test/
```

Damit Sie in Ihrer Anwendung darüber lauschen können:

```csharp {title="Program.cs"}
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
