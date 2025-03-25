# Arbeiten mit SSL

Arbeiten mit SSL für die Entwicklung kann notwendig sein, wenn Sie in Kontexten arbeiten, die Sicherheit erfordern, wie z.B. die meisten Webentwicklungsszenarien. Sisk operiert auf Basis von HttpListener, der keine native HTTPS-Unterstützung bietet, sondern nur HTTP. Es gibt jedoch Workarounds, die es Ihnen ermöglichen, mit SSL in Sisk zu arbeiten. Siehe sie unten:

## Über IIS auf Windows

- Verfügbar auf: Windows
- Aufwand: mittel

Wenn Sie auf Windows sind, können Sie IIS verwenden, um SSL auf Ihrem HTTP-Server zu aktivieren. Damit dies funktioniert, ist es ratsam, dass Sie diesem [Tutorial](/docs/registering-namespace) vorher folgen, wenn Sie möchten, dass Ihre Anwendung auf einem anderen Host als "localhost" hört.

Damit dies funktioniert, müssen Sie IIS über die Windows-Features installieren. IIS ist für Windows- und Windows-Server-Benutzer kostenlos verfügbar. Um SSL in Ihrer Anwendung zu konfigurieren, müssen Sie das SSL-Zertifikat bereit haben, auch wenn es selbstsigniert ist. Als Nächstes können Sie sehen, [wie Sie SSL auf IIS 7 oder höher einrichten](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Über mitmproxy

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

**mitmproxy** ist ein Interceptions-Proxy-Tool, das es Entwicklern und Sicherheitstestern ermöglicht, HTTP- und HTTPS-Verkehr zwischen einem Client (wie einem Webbrowser) und einem Server zu überwachen, zu modifizieren und aufzuzeichnen. Sie können die **mitmdump**-Utility verwenden, um einen Reverse-SSL-Proxy zwischen Ihrem Client und Ihrer Sisk-Anwendung zu starten.

1. Zuerst installieren Sie [mitmproxy](https://mitmproxy.org/) auf Ihrem Computer.
2. Starten Sie Ihre Sisk-Anwendung. In diesem Beispiel verwenden wir den Port 8000 als unsicheren HTTP-Port.
3. Starten Sie den mitmproxy-Server, um den sicheren Port 8001 zu hören:

```sh
mitmdump --mode reverse:http://localhost:8000/ -p 8001
```

Und Sie sind bereit! Sie können Ihre Anwendung bereits über `https://localhost:8001/` aufrufen. Ihre Anwendung muss nicht laufen, damit Sie `mitmdump` starten können.

Alternativ können Sie einen Verweis auf die [mitmproxy-Hilfe](https://github.com/sisk-http/core/tree/main/extensions/Sisk.Helpers.mitmproxy) in Ihrem Projekt hinzufügen. Dies erfordert jedoch, dass mitmproxy auf Ihrem Computer installiert ist.

## Über Sisk.SslProxy-Paket

- Verfügbar auf: Linux, macOS, Windows
- Aufwand: einfach

Das Sisk.SslProxy-Paket ist eine einfache Möglichkeit, SSL auf Ihrer Sisk-Anwendung zu aktivieren. Es ist jedoch ein **extrem experimentelles** Paket. Es kann instabil sein, mit diesem Paket zu arbeiten, aber Sie können Teil des kleinen Prozentsatzes von Menschen sein, die dazu beitragen, dieses Paket verwendbar und stabil zu machen. Um loszulegen, können Sie das Sisk.SslProxy-Paket mit installieren:

```sh
dotnet add package Sisk.SslProxy
```

> [!NOTE]
>
> Sie müssen "Vorabversionen von Paketen aktivieren" im Visual Studio-Paket-Manager aktivieren, um Sisk.SslProxy zu installieren.

Wiederum ist es ein experimentelles Projekt, also sollten Sie nicht einmal daran denken, es in die Produktion zu übernehmen.

Im Moment kann Sisk.SslProxy die meisten HTTP/1.1-Features verarbeiten, einschließlich HTTP-Continue, Chunked-Encoding, WebSockets und SSE. Lesen Sie mehr über SslProxy [hier](/docs/extensions/ssl-proxy).