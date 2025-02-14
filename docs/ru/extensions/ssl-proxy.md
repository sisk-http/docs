# SSL Proxy

> [!WARNING]
> Эта функция экспериментальная и не должна использоваться в производстве. Пожалуйста, обратитесь к [этому документу](/docs/deploying.html#proxying-your-application), если вы хотите сделать Sisk работать с SSL.

Sisk SSL Proxy - это модуль, который предоставляет HTTPS-соединение для [ListeningHost](/api/Sisk.Core.Http.ListeningHost) в Sisk и маршрутизирует HTTPS-сообщения в не安全ный HTTP-контекст. Модуль был создан для предоставления SSL-соединения для службы, которая использует [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) для запуска, который не поддерживает SSL.

Прокси работает внутри одного и того же приложения и слушает HTTP/1.1-сообщения, пересылая их в том же протоколе в Sisk. В настоящее время эта функция является высокоэкспериментальной и может быть достаточно нестабильной, чтобы не использовать ее в производстве.

На данный момент SslProxy поддерживает почти все функции HTTP/1.1, такие как keep-alive, chunked encoding, websockets и т. д. Для открытого соединения с SSL-прокси создается TCP-соединение с целевым сервером, и прокси пересылается на установленное соединение.

SslProxy можно использовать с HttpServer.CreateBuilder следующим образом:

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    // добавление SSL в проект
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

Вам необходимо предоставить действительный SSL-сертификат для прокси. Чтобы обеспечить принятие сертификата браузерами, не забудьте импортировать его в операционную систему, чтобы он функционировал правильно.