# SSL-Proxy

> [!WARNING]
> Diese Funktion ist experimentell und sollte nicht in der Produktion verwendet werden. Bitte beachten Sie [dieses Dokument](/docs/de/deploying.html#proxying-your-application), wenn Sie Sisk mit SSL verwenden möchten.

Der Sisk SSL-Proxy ist ein Modul, das eine HTTPS-Verbindung für einen [ListeningHost](/api/Sisk.Core.Http.ListeningHost) in Sisk bereitstellt und HTTPS-Nachrichten an einen unsicheren HTTP-Kontext weiterleitet. Das Modul wurde erstellt, um eine SSL-Verbindung für einen Dienst bereitzustellen, der [HttpListener](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httplistener?view=net-8.0) verwendet, um zu ausgeführt zu werden, was keine SSL-Unterstützung bietet.

Der Proxy läuft innerhalb der gleichen Anwendung und hört auf HTTP/1.1-Nachrichten, die im gleichen Protokoll an Sisk weitergeleitet werden. Derzeit ist diese Funktion sehr experimentell und möglicherweise so instabil, dass sie nicht in der Produktion verwendet werden sollte.

Derzeit unterstützt der SslProxy fast alle HTTP/1.1-Features, wie z. B. Keep-Alive, Chunked-Encoding, WebSockets usw. Für eine offene Verbindung zum SSL-Proxy wird eine TCP-Verbindung zum Zielserver erstellt und der Proxy wird an die etablierte Verbindung weitergeleitet.

Der SslProxy kann mit HttpServer.CreateBuilder wie folgt verwendet werden:

```csharp
using var app = HttpServer.CreateBuilder(port: 5555)
    .UseRouter(r =>
    {
        r.MapGet("/", request =>
        {
            return new HttpResponse("Hallo, Welt!");
        });
    })
    // SSL zum Projekt hinzufügen
    .UseSsl(
        sslListeningPort: 5567,
        new X509Certificate2(@".\ssl.pfx", password: "12345")
    )
    .Build();

app.Start();
```

Sie müssen ein gültiges SSL-Zertifikat für den Proxy bereitstellen. Um sicherzustellen, dass das Zertifikat von Browsern akzeptiert wird, importieren Sie es in das Betriebssystem, damit es ordnungsgemäß funktioniert.