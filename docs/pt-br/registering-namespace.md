# Configurando reservas de namespace no Windows

O Sisk funciona com a interface de rede HttpListener, que vincula um host virtual ao sistema para ouvir solicitações.

No Windows, essa vinculação é um pouco restritiva, permitindo apenas localhost como host válido. Ao tentar ouvir em outro host, um erro de acesso negado é lançado no servidor. Este tutorial explica como conceder autorização para ouvir em qualquer host que você desejar no sistema.

```bat
@echo off

:: insira o prefixo aqui, sem espaços ou aspas
SET PREFIX=

SET DOMAIN=%ComputerName%\%USERNAME%
netsh http add urlacl url=%PREFIX% user=%DOMAIN%

pause
```

Onde em `PREFIX`, está o prefixo ("Host de Escutar->Porta") que seu servidor irá escutar. Ele deve ser formatado com o esquema de URL, host, porta e uma barra no final, exemplo:

```bat
SET PREFIX=http://my-application.example.test/
```

Para que você possa ser ouvido em seu aplicativo através de:

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



