# Configuración de reservas de namespace en Windows

Sisk funciona con la interfaz de red HttpListener, que enlaza un host virtual al sistema para escuchar solicitudes.

En Windows, esta unión es un poco restrictiva, solo permitiendo que localhost se enlace como un host válido. Al intentar escuchar a otro host, se lanza un error de acceso denegado en el servidor. Este tutorial explica cómo conceder autorización para escuchar en cualquier host que desee en el sistema.

<div class="script-header">
    <span>
        Configuración de namespace.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
@echo off

:: insertar prefijo aquí, sin espacios ni comillas
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Donde en `PREFIX`, es el prefijo ("Host de escucha->Puerto") que su servidor escuchará. Debe estar formateado con el esquema de URL, host, puerto y una barra al final, ejemplo:

<div class="script-header">
    <span>
        Configuración de namespace.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://mi-aplicación.example.test/
```

Para que pueda ser escuchado en su aplicación a través de:

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
            .UseListeningPort("http://mi-aplicación.example.test/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Hola, mundo!")
            };
        });

        await app.StartAsync();
    }
}
```