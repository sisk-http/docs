# Erste Schritte

Willkommen in der Sisk-Dokumentation!

Schließlich, was ist das Sisk-Framework? Es ist eine Open-Source-Bibliothek, die mit .NET erstellt wurde, um minimalistisch, flexibel und abstrakt zu sein. Sie ermöglicht es Entwicklern, Internetdienste schnell zu erstellen, mit wenig oder keiner notwendigen Konfiguration. Sisk ermöglicht es Ihrer bestehenden Anwendung, ein verwaltetes HTTP-Modul zu haben, das vollständig und entsorgbar ist.

Die Werte von Sisk umfassen Code-Transparenz, Modularität, Leistung und Skalierbarkeit und können verschiedene Arten von Anwendungen verarbeiten, wie z.B. Restful, JSON-RPC, Web-Sockets und mehr.

Die wichtigsten Funktionen umfassen:

| Ressource | Beschreibung |
| ------- | --------- |
| [Routing](/docs/de/fundamentals/routing) | Ein Pfad-Router, der Präfixe, benutzerdefinierte Methoden, Pfadvariablen, Wertkonverter und mehr unterstützt. |
| [Anfrage-Handler](/docs/de/fundamentals/request-handlers) | Auch bekannt als *Middleware*, bietet eine Schnittstelle, um eigene Anfrage-Handler zu erstellen, die mit der Anfrage vor oder nach einer Aktion arbeiten. |
| [Komprimierung](/docs/de/fundamentals/responses#gzip-deflate-and-brotli-compression) | Komprimieren Sie den Inhalt Ihrer Antwort einfach mit Sisk. |
| [Web-Sockets](/docs/de/features/websockets) | Bietet Routen, die vollständige Web-Sockets akzeptieren, für das Lesen und Schreiben an den Client. |
| [Server-gesendete Ereignisse](/docs/de/features/server-sent-events) | Bietet das Senden von Server-Ereignissen an Clients, die das SSE-Protokoll unterstützen. |
| [Protokollierung](/docs/de/features/logging) | Vereinfachte Protokollierung. Protokollieren Sie Fehler, Zugriffe, definieren Sie rotierende Protokolle nach Größe, mehrere Ausgabeströme für das gleiche Protokoll und mehr. |
| [Mehrere Hosts](/docs/de/advanced/multi-host-setup) | Haben Sie einen HTTP-Server für mehrere Ports, und jeden Port mit seinem eigenen Router, und jeden Router mit seiner eigenen Anwendung. |
| [Server-Handler](/docs/de/advanced/http-server-handlers) | Erweitern Sie Ihre eigene Implementierung des HTTP-Servers. Anpassen Sie mit Erweiterungen, Verbesserungen und neuen Funktionen.

## Erste Schritte

Sisk kann in jeder .NET-Umgebung ausgeführt werden. In diesem Leitfaden werden wir Ihnen zeigen, wie Sie eine Sisk-Anwendung mit .NET erstellen. Wenn Sie es noch nicht installiert haben, laden Sie bitte das SDK von [hier](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) herunter.

In diesem Tutorial werden wir zeigen, wie Sie eine Projektstruktur erstellen, eine Anfrage empfangen, einen URL-Parameter abrufen und eine Antwort senden. Dieser Leitfaden konzentriert sich auf den Aufbau eines einfachen Servers mit C#. Sie können auch Ihre bevorzugte Programmiersprache verwenden.

> [!NOTE]
> Sie könnten an einem Quickstart-Projekt interessiert sein. Überprüfen Sie [dieses Repository](https://github.com/sisk-http/quickstart) für weitere Informationen.

## Erstellen eines Projekts

Nennen wir unser Projekt "Meine Sisk-Anwendung". Sobald Sie .NET eingerichtet haben, können Sie Ihr Projekt mit dem folgenden Befehl erstellen:

```bash
dotnet new console -n meine-sisk-anwendung
```

Navigieren Sie als Nächstes zu Ihrem Projektverzeichnis und installieren Sie Sisk mit dem .NET-Utility-Tool:

```bash
cd meine-sisk-anwendung
dotnet add package Sisk.HttpServer
```

Sie können weitere Möglichkeiten finden, Sisk in Ihrem Projekt zu installieren, [hier](https://www.nuget.org/packages/Sisk.HttpServer/).

Lassen Sie uns nun eine Instanz unseres HTTP-Servers erstellen. Für dieses Beispiel werden wir ihn so konfigurieren, dass er auf Port 5000 hört.

## Erstellen des HTTP-Servers

Sisk ermöglicht es Ihnen, Ihre Anwendung Schritt für Schritt manuell aufzubauen, da sie auf das HttpServer-Objekt routet. Dies kann jedoch für die meisten Projekte nicht sehr bequem sein. Daher können wir die Builder-Methode verwenden, die es einfacher macht, unsere Anwendung in Betrieb zu nehmen.

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
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
                Content = new StringContent("Hallo, Welt!")
            };
        });
        
        await app.StartAsync();
    }
}
```

Es ist wichtig, jedes wichtige Komponente von Sisk zu verstehen. Später in diesem Dokument werden Sie mehr über die Funktionsweise von Sisk erfahren.

## Manuelle (erweiterte) Einrichtung

Sie können erfahren, wie jedes Sisk-Mechanismus funktioniert, in [diesem Abschnitt](/docs/de/advanced/manual-setup) der Dokumentation, der das Verhalten und die Beziehungen zwischen dem HttpServer, Router, ListeningPort und anderen Komponenten erklärt.