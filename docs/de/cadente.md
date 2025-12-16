# Cadente

Cadente ist eine experimentelle, verwaltete HTTP/1.1-Listener-Implementierung für Sisk. Sie dient als Ersatz für den Standard-`System.Net.HttpListener` und bietet eine größere Kontrolle und Flexibilität, insbesondere auf nicht-Windows-Plattformen.

## Überblick

Standardmäßig verwendet Sisk `HttpListener` (aus `System.Net`) als seine zugrunde liegende HTTP-Server-Engine. Während `HttpListener` stabil und leistungsfähig auf Windows ist (wo er den kernel-modus-Treiber HTTP.sys verwendet), ist seine Implementierung auf Linux und macOS verwaltet und hatte historisch bedingt Einschränkungen, wie z. B. fehlende native SSL-Unterstützung (was einen Reverse-Proxy wie Nginx oder Sisk.SslProxy erfordert) und unterschiedliche Leistungsmerkmale.

Cadente zielt darauf ab, diese Probleme zu lösen, indem es einen vollständig verwalteten HTTP/1.1-Server in C# bereitstellt. Seine Hauptziele sind:

- **Native SSL-Unterstützung:** Funktioniert auf allen Plattformen ohne externe Proxys oder komplexe Konfiguration.
- **Plattformübergreifende Konsistenz:** Identisches Verhalten auf Windows, Linux und macOS.
- **Leistung:** Entwickelt als hochleistungsfähige Alternative zum verwalteten `HttpListener`.
- **Unabhängigkeit:** Entkoppelt von `System.Net.HttpListener`, um Sisk vor möglichen zukünftigen Veraltungen oder mangelnder Wartung dieses Komponenten in .NET zu schützen.

> [!WARNING]
> **Experimenteller Status**
> 
> Cadente befindet sich derzeit in einer experimentellen Phase (Beta). Es wird nicht empfohlen, es in kritischen Produktionsumgebungen zu verwenden. Die API und das Verhalten können sich ändern.

## Installation

Cadente ist als separates Paket verfügbar. Um es mit Sisk zu verwenden, benötigen Sie das `Sisk.Cadente.CoreEngine`-Paket.

```bash
dotnet add package Sisk.Cadente.CoreEngine --prerelease
```

## Verwendung mit Sisk

Um Cadente als HTTP-Motor für Ihre Sisk-Anwendung zu verwenden, müssen Sie den `HttpServer` so konfigurieren, dass er `CadenteHttpServerEngine` anstelle der Standard-Engine verwendet.

Die `CadenteHttpServerEngine` passt den Cadente-`HttpHost` an die `HttpServerEngine`-Abstraktion an, die von Sisk erforderlich ist.

```csharp
using Sisk.Core.Http;
using Sisk.Cadente.CoreEngine;

using var host = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(certificate: CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
    .Build();

await host.StartAsync();
```

### Erweiterte Konfiguration

Sie können die zugrunde liegende `HttpHost`-Instanz anpassen, indem Sie eine Setup-Aktion an den `CadenteHttpServerEngine`-Konstruktor übergeben. Dies ist nützlich für die Konfiguration von Timeouts oder anderen niedrigstufigen Einstellungen.

```csharp
using var engine = new CadenteHttpServerEngine(host =>
{
    // Konfigurieren Sie die Client-Lese-/Schreibzeitüberschreitungen
    host.TimeoutManager.ClientReadTimeout = TimeSpan.FromSeconds(30);
    host.TimeoutManager.ClientWriteTimeout = TimeSpan.FromSeconds(30);
});
```

## Verwendung als eigenständiger Server

Obwohl Cadente in erster Linie für Sisk entwickelt wurde, kann es als eigenständiger HTTP-Server (ähnlich wie `HttpListener`) verwendet werden.

```csharp
using Sisk.Cadente;

var host = new HttpHost(15000)
{
    Handler = new MyHostHandler()
};

host.Start();
Thread.Sleep(-1);

class MyHostHandler : HttpHostHandler
{
    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        using var writer = new StreamWriter(context.Response.GetResponseStream());
        await writer.WriteLineAsync("Hallo, Welt!");
    }
}
```