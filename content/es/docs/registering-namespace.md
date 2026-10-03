---
title: "Configuración de reservas de espacios de nombres en Windows"
linkTitle: "Configuración de Windows"
weight: 70
aliases:
  - "/docs/es/registering-namespace.html"
sourceHash: "c0adab5c6258ef68"
---

> [!NOTE]
> Esta configuración es opcional y solo se requiere cuando deseas que Sisk escuche en hosts diferentes a "localhost" en Windows usando el motor HttpListener.

Sisk funciona con la interfaz de red HttpListener, que enlaza un host virtual al sistema para escuchar solicitudes.

En Windows, este enlace es algo restrictivo, solo permite que localhost se vincule como un host válido. Al intentar escuchar en otro host, se lanza un error de acceso denegado en el servidor. Este tutorial explica cómo otorgar autorización para escuchar en cualquier host que desees en el sistema.

```bat {title="Namespace Setup.bat"}
@echo off

:: insert prefix here, without spaces or quotes
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Donde en `PREFIX` está el prefijo ("Host de escucha->Puerto") que tu servidor escuchará. Debe estar formateado con el esquema URL, host, puerto y una barra al final, por ejemplo:

```bat {title="Namespace Setup.bat"}
SET PREFIX=http://my-application.example.test/
```

De modo que puedas escuchar en tu aplicación mediante:

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
