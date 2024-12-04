# Proxy SSL

> [!WARNING]
> Este recurso é experimental e não deve ser usado em produção. Consulte [este documento](/docs/deploying.html#proxying-your-application) se quiser fazer o Sisk funcionar com SSL.

O Proxy SSL do Sisk é um módulo que fornece uma conexão HTTPS para um [ListeningHost](/api/Sisk.Core.Http.ListeningHost) no Sisk e roteia mensagens HTTPS para um contexto HTTP inseguro. O módulo foi construído para fornecer conexão SSL para um serviço que usa [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) para executar, que não suporta SSL.

O proxy é executado dentro do mesmo aplicativo e escuta por mensagens HTTP/1.1, encaminhando-as para o Sisk no mesmo protocolo. Atualmente, esse recurso é altamente experimental e pode ser instável o suficiente para não ser usado em produção.

No momento, o SslProxy suporta quase todos os recursos HTTP/1.1, como keep-alive, codificação chunked, websockets, etc. Para uma conexão aberta ao proxy SSL, uma conexão TCP é criada para o servidor de destino e o proxy é encaminhado para a conexão estabelecida.

O SslProxy pode ser usado com HttpServer.CreateBuilder da seguinte forma:

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // adicionar SSL ao projeto
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

Você deve fornecer um certificado SSL válido para o proxy. Para garantir que o certificado seja aceito pelos navegadores, lembre-se de importá-lo no sistema operacional para que ele funcione corretamente.
