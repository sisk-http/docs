# SSL Прокси

> [!WARNING]
> Эта функция экспериментальная и не должна использоваться в production. Обратитесь к [этому документу](/docs/deploying.html#proxying-your-application), если хотите, чтобы Sisk работал с SSL.

Модуль Sisk SSL Proxy предоставляет HTTPS-соединение для [ListeningHost](/api/Sisk.Core.Http.ListeningHost) в Sisk и перенаправляет HTTPS-сообщения в небезопасный HTTP-контекст. Модуль был создан для предоставления SSL-соединения для службы, которая использует [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) для работы, которая не поддерживает SSL.

Прокси работает в той же программе и прослушивает HTTP/1.1-сообщения, перенаправляя их по тому же протоколу в Sisk. В настоящее время эта функция является высокоэкспериментальной и может быть настолько нестабильной, что ее нельзя использовать в production.

В настоящее время SslProxy поддерживает почти все функции HTTP/1.1, такие как keep-alive, chunked encoding, websockets и т. д. Для открытого соединения с SSL-прокси создается TCP-соединение с целевым сервером, а прокси перенаправляется на установленное соединение.

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
    // добавить SSL в проект
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

Вам необходимо предоставить действительный SSL-сертификат для прокси. Чтобы убедиться, что сертификат принимается браузерами, не забудьте импортировать его в операционную систему, чтобы он работал правильно.
