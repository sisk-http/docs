# Configurando reservas de namespace no Windows

> [!NOTE]
> Esta configuração é opcional e só é necessária quando você deseja que o Sisk escute em hosts diferentes de "localhost" no Windows usando o mecanismo HttpListener.

O Sisk funciona com a interface de rede HttpListener, que vincula um host virtual ao sistema para escutar solicitações.

No Windows, essa vinculação é um pouco restritiva, permitindo apenas que o localhost seja vinculado como um host válido. Ao tentar escutar em outro host, um erro de acesso negado é lançado no servidor. Este tutorial explica como conceder autorização para escutar em qualquer host que você desejar no sistema.

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

Onde em `PREFIX` está o prefixo ("Listening Host->Port") que seu servidor escutará. Ele deve ser formatado com o esquema da URL, host, porta e uma barra no final, exemplo:

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

Para que sua aplicação possa escutar através de:

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