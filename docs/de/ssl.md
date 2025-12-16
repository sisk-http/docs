# Arbeiten mit SSL

Arbeiten mit SSL für die Entwicklung kann notwendig sein, wenn in Kontexten gearbeitet wird, die Sicherheit erfordern, wie in den meisten Webentwicklungsszenarien. Sisk operiert auf Basis von HttpListener, der keine native HTTPS-Unterstützung bietet, sondern nur HTTP. Es gibt jedoch Umgehungen, die es ermöglichen, mit SSL in Sisk zu arbeiten. Siehe sie unten:

## Über den Sisk.Cadente.CoreEngine

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

Es ist möglich, den experimentellen **Cadente**-Engine in Sisk-Projekten zu verwenden, ohne dass eine zusätzliche Konfiguration auf dem Computer oder im Projekt erforderlich ist. Sie müssen das `Sisk.Cadente.CoreEngine`-Paket in Ihrem Projekt installieren, um den Cadente-Server im Sisk-Server verwenden zu können.

Um SSL zu konfigurieren, können Sie die `UseSsl`- und `UseEngine`-Methoden des Builders verwenden:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Hinweis: Dieses Paket befindet sich noch in der experimentellen Phase.

## Über IIS auf Windows

- Verfügbar auf: Windows
- Aufwand: mittel

Wenn Sie auf Windows sind, können Sie IIS verwenden, um SSL auf Ihrem HTTP-Server zu aktivieren. Es wird empfohlen, dass Sie diesem [Tutorial](/docs/de/registering-namespace) vorher folgen, wenn Sie möchten, dass Ihre Anwendung auf einem anderen Host als "localhost" hört.

Damit dies funktioniert, müssen Sie IIS über die Windows-Funktionen installieren. IIS ist für Windows- und Windows-Server-Benutzer kostenlos verfügbar. Um SSL in Ihrer Anwendung zu konfigurieren, müssen Sie das SSL-Zertifikat bereit haben, auch wenn es selbstsigniert ist. Anschließend können Sie sehen, [wie Sie SSL auf IIS 7 oder höher einrichten](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Über mitmproxy

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

**mitmproxy** ist ein Interceptions-Proxy-Tool, das es Entwicklern und Sicherheitstestern ermöglicht, HTTP- und HTTPS-Verkehr zwischen einem Client (wie einem Webbrowser) und einem Server zu überwachen, zu modifizieren und aufzuzeichnen. Sie können die **mitmdump**-Utility verwenden, um einen Reverse-SSL-Proxy zwischen Ihrem Client und Ihrer Sisk-Anwendung zu starten.

1. Zuerst installieren Sie [mitmproxy](https://mitmproxy.org/) auf Ihrem Computer.
2. Starten Sie Ihre Sisk-Anwendung. In diesem Beispiel verwenden wir Port 8000 als unsicheren HTTP-Port.
3. Starten Sie den mitmproxy-Server, um auf dem sicheren Port 8001 zu hören:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Und Sie sind bereit! Sie können bereits auf Ihre Anwendung über `https://localhost:8001/` zugreifen. Ihre Anwendung muss nicht laufen, um `mitmdump` zu starten.

Alternativ können Sie einen Verweis auf die [mitmproxy-Hilfe](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) in Ihrem Projekt hinzufügen. Dies erfordert jedoch, dass mitmproxy auf Ihrem Computer installiert ist.

## Über das Sisk.SslProxy-Paket

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

> [!WICHTIG]
>
> Das Sisk.SslProxy-Paket ist veraltet und wird nicht mehr unterstützt. Stattdessen wird das `Sisk.Cadente.CoreEngine`-Paket empfohlen.

Das Sisk.SslProxy-Paket ist eine einfache Möglichkeit, SSL auf Ihrer Sisk-Anwendung zu aktivieren. Es handelt sich jedoch um ein **extrem experimentelles** Paket. Es kann instabil sein, mit diesem Paket zu arbeiten, aber Sie können Teil der kleinen Gruppe von Menschen sein, die dazu beitragen, dieses Paket lebensfähig und stabil zu machen. Um loszulegen, können Sie das Sisk.SslProxy-Paket mit installieren:

```sh
dotnet add package Sisk.SslProxy
```

> [!HINWEIS]
>
> Sie müssen "Vorabversionen einbeziehen" im Visual Studio-Paket-Manager aktivieren, um Sisk.SslProxy zu installieren.

Es handelt sich erneut um ein experimentelles Projekt, also sollten Sie nicht einmal daran denken, es in die Produktion zu übernehmen.

Derzeit kann Sisk.SslProxy die meisten HTTP/1.1-Features verarbeiten, einschließlich HTTP-Continue, Chunked-Encoding, WebSockets und SSE. Lesen Sie mehr über SslProxy [hier](/docs/de/extensions/ssl-proxy).