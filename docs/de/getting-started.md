# Erste Schritte mit Sisk

Sisk kann in jeder .NET-Umgebung ausgeführt werden. In diesem Leitfaden werden wir Ihnen zeigen, wie Sie eine Sisk-Anwendung mit .NET erstellen. Wenn Sie es noch nicht installiert haben, laden Sie bitte das SDK von [hier](https://dotnet.microsoft.com/en-us/download/dotnet/7.0) herunter.

In diesem Tutorial werden wir Ihnen zeigen, wie Sie eine Projektstruktur erstellen, eine Anfrage empfangen, einen URL-Parameter abrufen und eine Antwort senden. Dieser Leitfaden konzentriert sich auf den Aufbau eines einfachen Servers mit C#. Sie können auch Ihre bevorzugte Programmiersprache verwenden.

> [!NOTE]
> Sie könnten an einem Quickstart-Projekt interessiert sein. Überprüfen Sie [dieses Repository](https://github.com/sisk-http/quickstart) für weitere Informationen.

## Erstellen eines Projekts

Nennen wir unser Projekt "Meine Sisk-Anwendung". Sobald Sie .NET eingerichtet haben, können Sie Ihr Projekt mit dem folgenden Befehl erstellen:

```bash
dotnet new console -n meine-sisk-anwendung
```

Als Nächstes navigieren Sie zu Ihrem Projektverzeichnis und installieren Sisk mit dem .NET-Utility-Tool:

```bash
cd meine-sisk-anwendung
dotnet add package Sisk.HttpServer
```

Sie können weitere Möglichkeiten, Sisk in Ihrem Projekt zu installieren, [hier](https://www.nuget.org/packages/Sisk.HttpServer/) finden.

Jetzt erstellen wir eine Instanz unseres HTTP-Servers. In diesem Beispiel konfigurieren wir ihn, um auf Port 5000 zu hören.

## Aufbau des HTTP-Servers

Sisk ermöglicht es Ihnen, Ihre Anwendung schrittweise manuell aufzubauen, da sie auf das HttpServer-Objekt routet. Dies kann jedoch für die meisten Projekte nicht sehr praktisch sein. Daher können wir die Builder-Methode verwenden, die es einfacher macht, unsere Anwendung in Betrieb zu nehmen.

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

Es ist wichtig, jedes wichtige Komponenten von Sisk zu verstehen. Später in diesem Dokument werden Sie mehr über die Funktionsweise von Sisk erfahren.

## Manuelle (erweiterte) Einrichtung

Sie können erfahren, wie jedes Sisk-Mechanismus funktioniert, in [diesem Abschnitt](/docs/advanced/manual-setup) der Dokumentation, der das Verhalten und die Beziehungen zwischen dem HttpServer, Router, ListeningPort und anderen Komponenten erklärt.