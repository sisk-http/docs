# Configurando reservas de namespace no Windows

Sisk funciona com a interface de rede HttpListener, que vincula um host virtual ao sistema para ouvir solicitações.

No Windows, essa vinculação é um pouco restritiva, permitindo apenas que o localhost seja vinculado como um host válido. Ao tentar ouvir outro host, um erro de acesso negado é lançado no servidor. Este tutorial explica como conceder autorização para ouvir em qualquer host que você desejar no sistema.

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

:: insira o prefixo aqui, sem espaços ou aspas
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Onde em `PREFIX`, é o prefixo ("Host de Escuta->Porta") que o servidor irá ouvir. Ele deve ser formatado com o esquema de URL, host, porta e uma barra no final, exemplo:

<div class="script-header">
    <span>
        Namespace Setup.bat
    </span>
    <span>
        BATCH
    </span>
</div>

```bat
SET PREFIX=http://meu-aplicativo.exemplo.teste/
```

Para que você possa ser ouvido em seu aplicativo por meio de:

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
            .UseListeningPort("http://meu-aplicativo.exemplo.teste/")
            .Build();

        app.Router.MapGet("/", request =>
        {
            return new HttpResponse()
            {
                Status = 200,
                Content = new StringContent("Olá, mundo!")
            };
        });

        await app.StartAsync();
    }
}
```