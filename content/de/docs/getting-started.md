---
title: "Erste Schritte"
weight: 10
aliases:
  - "/docs/de/getting-started.html"
sourceHash: "92d7e16e172282fe"
---

Willkommen zur Sisk-Dokumentation!

Sisk ist ein quelloffenes leichtgewichtiges HTTP‑Framework für .NET. Du kannst es verwenden, um einen eigenständigen Web‑Service zu erstellen, ein HTTP‑Modul in eine bestehende Anwendung einzubetten oder einen Service hinter einem Reverse‑Proxy mit nur der benötigten Konfiguration zu betreiben.

Die Werte von Sisk umfassen Code‑Transparenz, Modularität, Leistung und Skalierbarkeit. Es kann verschiedene Anwendungsstile handhaben, darunter RESTful‑APIs, JSON‑RPC‑Dienste, WebSockets, Server‑Sent‑Events und das Bereitstellen statischer Dateien.

Seine Hauptfunktionen umfassen:

| Ressource | Beschreibung |
| --------- | ------------ |
| [Routing](/docs/fundamentals/routing) | Ein Pfadrouter, der Präfixe, benutzerdefinierte Methoden, Pfadvariablen, Wertkonverter und mehr unterstützt. |
| [Request Handlers](/docs/fundamentals/request-handlers) | Auch bekannt als *Middlewares*, bietet eine Schnittstelle zum Erstellen eigener Request‑Handler, die vor oder nach einer Aktion mit der Anfrage arbeiten. |
| [Compression](/docs/fundamentals/responses#gzip-deflate-and-brotli-compression) | Komprimiere deine Antwortinhalte einfach mit Sisk. |
| [Web sockets](/docs/features/websockets) | Stellt Routen bereit, die vollständige WebSockets akzeptieren, zum Lesen und Schreiben zum Client. |
| [Server-sent events](/docs/features/server-sent-events) | Ermöglicht das Senden von Serverereignissen an Clients, die das SSE‑Protokoll unterstützen. |
| [Logging](/docs/features/logging) | Vereinfachtes Logging. Protokolliere Fehler, Zugriffe, definiere rotierende Logs nach Größe, mehrere Ausgabeströme für dasselbe Log und mehr. |
| [Multi-host](/docs/advanced/multi-host-setup) | Betreibe einen HTTP‑Server für mehrere Ports, wobei jeder Port seinen eigenen Router und jeder Router seine eigene Anwendung hat. |
| [Server handlers](/docs/advanced/http-server-handlers) | Erweitere deine eigene Implementierung des HTTP‑Servers. Passe ihn mit Erweiterungen, Verbesserungen und neuen Funktionen an. |

## Erste Schritte

Sisk kann in jeder .NET‑Umgebung ausgeführt werden. In diesem Leitfaden zeigen wir dir, wie du eine Sisk‑Anwendung mit .NET erstellst. Falls du das SDK noch nicht installiert hast, lade es bitte von [hier](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) herunter.

In diesem Tutorial behandeln wir, wie man eine Projektstruktur erstellt, eine Anfrage empfängt, einen URL‑Parameter erhält und eine Antwort sendet. Dieser Leitfaden konzentriert sich darauf, einen einfachen Server mit C# zu bauen. Du kannst jedoch auch deine bevorzugte Programmiersprache verwenden.

> [!NOTE]
> Vielleicht bist du an einem Quick‑Start‑Projekt interessiert. Sieh dir [dieses Repository](https://github.com/sisk-http/quickstart) für weitere Informationen an.

## Erstellen eines Projekts

Nennen wir unser Projekt „My Sisk Application“. Sobald .NET eingerichtet ist, kannst du dein Projekt mit dem folgenden Befehl erstellen:

```bash
dotnet new console -n my-sisk-application
```

Navigiere anschließend in dein Projektverzeichnis und installiere Sisk mit dem .NET‑Utility‑Tool:

```bash
cd my-sisk-application
dotnet add package Sisk.HttpServer
```

Weitere Installationsmöglichkeiten für Sisk in deinem Projekt findest du [hier](https://www.nuget.org/packages/Sisk.HttpServer/).

Jetzt erstellen wir eine Instanz unseres HTTP‑Servers. In diesem Beispiel konfigurieren wir ihn, um auf Port 5000 zu lauschen.

## Aufbau des HTTP‑Servers

Sisk ermöglicht es dir, deine Anwendung Schritt für Schritt manuell zu bauen, da es zum HttpServer‑Objekt routet. Das ist jedoch für die meisten Projekte nicht sehr praktisch. Daher können wir die Builder‑Methode verwenden, die das Aufsetzen unserer App erleichtert.

```csharp {title="Program.cs"}
class Program
{
    static async Task Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseListeningPort("http://localhost:5000/")
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

Es ist wichtig, jede wesentliche Komponente von Sisk zu verstehen. Später in diesem Dokument erfährst du mehr darüber, wie Sisk funktioniert.

## Manuelle (erweiterte) Einrichtung

Du kannst lernen, wie jeder Sisk‑Mechanismus funktioniert, in [diesem Abschnitt](/docs/advanced/manual-setup) der Dokumentation, der das Verhalten und die Beziehungen zwischen HttpServer, Router, ListeningPort und anderen Komponenten erklärt.
