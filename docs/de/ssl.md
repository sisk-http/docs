# Arbeiten mit SSL

Arbeiten mit SSL für die Entwicklung kann erforderlich sein, wenn man in Kontexten arbeitet, die Sicherheit erfordern, wie die meisten Webentwicklungsszenarien. Sisk läuft auf HttpListener, das kein natives HTTPS unterstützt, sondern nur HTTP. Es gibt jedoch Umgehungslösungen, die es ermöglichen, mit SSL in Sisk zu arbeiten. Siehe sie unten:

## Durch die Sisk.Cadente.CoreEngine

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

Es ist möglich, die experimentelle **Cadente**-Engine in Sisk-Projekten zu verwenden, ohne zusätzliche Konfiguration auf dem Computer oder im Projekt zu benötigen. Sie müssen das Paket `Sisk.Cadente.CoreEngine` in Ihrem Projekt installieren, um den Cadente-Server im Sisk-Server nutzen zu können.

Um SSL zu konfigurieren, können Sie die Methoden `UseSsl` und `UseEngine` des Builders verwenden:

```csharp
using var http = HttpServer.CreateBuilder()
    .UseEngine<CadenteHttpServerEngine>()
    .UseSsl(CertificateHelper.CreateTrustedDevelopmentCertificate("localhost"))
```

> Hinweis: Dieses Paket befindet sich noch in der experimentellen Phase.

## Durch IIS unter Windows

- Verfügbar auf: Windows
- Aufwand: mittel

Wenn Sie unter Windows sind, können Sie IIS verwenden, um SSL auf Ihrem HTTP-Server zu aktivieren. Dafür ist es ratsam, vorher [dieses Tutorial](/docs/de/registering-namespace) zu befolgen, wenn Sie möchten, dass Ihre Anwendung auf einem Host als „localhost“ lauscht.

Um dies zum Laufen zu bringen, müssen Sie IIS über Windows-Features installieren. IIS ist kostenlos für Windows- und Windows Server-Benutzer verfügbar. Um SSL in Ihrer Anwendung zu konfigurieren, haben Sie das SSL-Zertifikat bereit, auch wenn es selbstsigniert ist. Anschließend können Sie [wie man SSL auf IIS 7 oder höher einrichtet](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis) sehen.

## Durch mitmproxy

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

**mitmproxy** ist ein Interzeptions-Proxy-Tool, das Entwicklern und Sicherheitstestern ermöglicht, HTTP- und HTTPS-Verkehr zwischen einem Client (wie einem Webbrowser) und einem Server zu inspizieren, zu modifizieren und aufzuzeichnen. Sie können das **mitmdump**-Utility verwenden, um einen Reverse-SSL-Proxy zwischen Ihrem Client und Ihrer Sisk-Anwendung zu starten.

1. Installieren Sie zunächst [mitmproxy](https://mitmproxy.org/) auf Ihrem Rechner.
2. Starten Sie Ihre Sisk-Anwendung. Für dieses Beispiel verwenden wir Port 8000 als unsicheren HTTP-Port.
3. Starten Sie den mitmproxy-Server, um auf dem sicheren Port 8001 zu lauschen:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Und Sie sind bereit! Sie können Ihre Anwendung bereits über `https://localhost:8001/` aufrufen. Ihre Anwendung muss nicht laufen, damit Sie `mitmdump` starten.

Alternativ können Sie Ihrem Projekt einen Verweis auf den [mitmproxy-Helfer](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) hinzufügen. Dies erfordert jedoch, dass mitmproxy auf Ihrem Computer installiert ist.

## Durch das Sisk.SslProxy-Paket

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

> [!IMPORTANT]
>
> Das Sisk.SslProxy-Paket ist in der Favoritenliste zugunsten des Pakets `Sisk.Cadente.CoreEngine` veraltet und wird nicht mehr gepflegt.

Das Sisk.SslProxy-Paket ist ein einfacher Weg, SSL in Ihrer Sisk-Anwendung zu aktivieren. Es ist jedoch ein **extrem experimentelles** Paket. Es kann instabil sein, mit diesem Paket zu arbeiten, aber Sie können Teil des kleinen Prozentsatzes von Personen sein, die dazu beitragen, dieses Paket funktionsfähig und stabil zu machen. Um loszulegen, können Sie das Sisk.SslProxy-Paket mit installieren:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Sie müssen „Include prerelease“ im Visual Studio Package Manager aktivieren, um Sisk.SslProxy zu installieren.

Nochmals: Es ist ein experimentelles Projekt, also denken Sie nicht einmal daran, es in Produktion zu bringen.

Derzeit kann Sisk.SslProxy die meisten HTTP/1.1-Funktionen verarbeiten, einschließlich HTTP Continue, Chunked-Encoding, WebSockets und SSE. Lesen Sie mehr über SslProxy [hier](/docs/de/extensions/ssl-proxy).