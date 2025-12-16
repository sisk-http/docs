# Arbeiten mit SSL

Die Arbeit mit SSL für die Entwicklung kann notwendig sein, wenn man in Kontexten arbeitet, die Sicherheit erfordern, wie die meisten Web‑Entwicklungsszenarien. Sisk läuft auf HttpListener, das kein natives HTTPS, sondern nur HTTP unterstützt. Es gibt jedoch Umgehungen, die es ermöglichen, SSL in Sisk zu verwenden. Siehe unten:

## Über die Sisk.Cadente.CoreEngine

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

Es ist möglich, die experimentelle [**Cadente**](/docs/de/cadente)‑Engine in Sisk‑Projekten zu nutzen, ohne zusätzliche Konfiguration am Computer oder im Projekt vorzunehmen. Sie müssen das Paket `Sisk.Cadente.CoreEngine` in Ihrem Projekt installieren, um den Cadente‑Server im Sisk‑Server verwenden zu können.

Um SSL zu konfigurieren, können Sie die Methoden `UseSsl` und `UseEngine` des Builders verwenden:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Hinweis: Dieses Paket befindet sich noch in der experimentellen Phase.

## Über IIS unter Windows

- Verfügbar auf: Windows
- Aufwand: mittel

Wenn Sie Windows verwenden, können Sie IIS einsetzen, um SSL auf Ihrem HTTP‑Server zu aktivieren. Damit dies funktioniert, sollten Sie vorher dem [Tutorial](/docs/de/registering-namespace) folgen, falls Ihre Anwendung auf einem anderen Host als „localhost“ lauschen soll.

Damit das funktioniert, müssen Sie IIS über die Windows‑Features installieren. IIS ist für Windows‑ und Windows‑Server‑Benutzer kostenlos verfügbar. Um SSL in Ihrer Anwendung zu konfigurieren, halten Sie das SSL‑Zertifikat bereit, selbst wenn es selbstsigniert ist. Anschließend können Sie nachlesen, [wie man SSL auf IIS 7 oder höher einrichtet](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Über mitmproxy

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

**mitmproxy** ist ein Interception‑Proxy‑Tool, das Entwicklern und Sicherheitstestern ermöglicht, HTTP‑ und HTTPS‑Verkehr zwischen einem Client (z. B. einem Webbrowser) und einem Server zu inspizieren, zu verändern und aufzuzeichnen. Sie können das Dienstprogramm **mitmdump** verwenden, um einen Reverse‑SSL‑Proxy zwischen Ihrem Client und Ihrer Sisk‑Anwendung zu starten.

1. Installieren Sie zunächst [mitmproxy](https://mitmproxy.org/) auf Ihrem Rechner.  
2. Starten Sie Ihre Sisk‑Anwendung. In diesem Beispiel verwenden wir Port 8000 als unsicheren HTTP‑Port.  
3. Starten Sie den mitmproxy‑Server, der auf dem sicheren Port 8001 lauscht:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Und Sie können loslegen! Sie können Ihre Anwendung bereits über `https://localhost:8001/` erreichen. Ihre Anwendung muss nicht laufen, damit Sie `mitmdump` starten können.

Alternativ können Sie in Ihrem Projekt einen Verweis auf den [mitmproxy‑Helper](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) hinzufügen. Dies erfordert weiterhin, dass mitmproxy auf Ihrem Computer installiert ist.

## Über das Sisk.SslProxy‑Paket

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

> [!IMPORTANT]
>
> Das Sisk.SslProxy‑Paket ist zugunsten des `Sisk.Cadente.CoreEngine`‑Pakets veraltet und wird nicht mehr gepflegt.

Das Sisk.SslProxy‑Paket ist ein einfacher Weg, SSL in Ihrer Sisk‑Anwendung zu aktivieren. Es handelt sich jedoch um ein **extrem experimentelles** Paket. Die Arbeit damit kann instabil sein, aber Sie können zu dem kleinen Prozentsatz der Personen gehören, die dazu beitragen, dieses Paket brauchbar und stabil zu machen. Um zu beginnen, können Sie das Sisk.SslProxy‑Paket installieren mit:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Sie müssen in Visual Studio den „Include prerelease“‑Schalter im NuGet‑Paket‑Manager aktivieren, um Sisk.SslProxy zu installieren.

Noch einmal: Es ist ein experimentelles Projekt, also denken Sie nicht einmal daran, es in die Produktion zu übernehmen.

Derzeit kann Sisk.SslProxy die meisten HTTP/1.1‑Funktionen handhaben, einschließlich HTTP Continue, Chunked‑Encoding, WebSockets und SSE. Lesen Sie mehr über SslProxy [hier](/docs/de/extensions/ssl-proxy).