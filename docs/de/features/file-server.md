# Dateiserver

Sisk stellt den Namespace `Sisk.Http.FileSystem` bereit, der Werkzeuge zum Bereitstellen statischer Dateien, zur Verzeichnisauflistung und zur Dateikonvertierung enthält. Diese Funktion ermöglicht das Bereitstellen von Dateien aus einem lokalen Verzeichnis, mit Unterstützung für Bereichsanfragen (Audio-/Video-Streaming) und benutzerdefinierte Dateiverarbeitung.

## Bereitstellen statischer Dateien

Der einfachste Weg, statische Dateien bereitzustellen, ist [Router.MapFileSystem](/api/Sisk.Core.Routing.Router.MapFileSystem). Diese Methode ordnet ein URL-Präfix einem Verzeichnis auf dem Datenträger zu.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// ordnet die Wurzel des Servers dem aktuellen Verzeichnis zu
mainRouter.MapFileSystem("/", Directory.GetCurrentDirectory());

// ordnet /assets dem Ordner "public/assets" zu
mainRouter.MapFileSystem(
    "/assets",
    Path.Combine(Directory.GetCurrentDirectory(), "public", "assets"));
```

Wenn eine Anfrage dem Routen-Präfix entspricht, sucht der `HttpFileServerHandler` nach einer Datei im angegebenen Verzeichnis. Wird sie gefunden, wird die Datei bereitgestellt; andernfalls wird eine 404-Antwort zurückgegeben (oder 403, wenn der Zugriff verweigert wird).

`HttpFileServer.CreateServingRoute` ist weiterhin verfügbar, wenn Sie ein `Route`-Objekt explizit erstellen müssen, aber `MapFileSystem` ist die direkteste Option für Anwendungscode.

## HttpFileServerHandler

Für mehr Kontrolle darüber, wie Dateien bereitgestellt werden, können Sie `HttpFileServerHandler` manuell instanziieren und konfigurieren.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// aktiviert die Verzeichnisauflistung (standardmäßig deaktiviert)
fileHandler.AllowDirectoryListing = true;

// legt ein benutzerdefiniertes Routen-Präfix fest (dies wird vom Anforderungspfad entfernt)
fileHandler.RoutePrefix = "/public";

// registriert den Handler unter /public
mainRouter.MapFileSystem("/public", fileHandler);
```

### Konfiguration

| Eigenschaft | Beschreibung |
|---|---|
| `RootDirectoryPath` | Der absolute oder relative Pfad zum Stammverzeichnis, aus dem Dateien bereitgestellt werden. |
| `RoutePrefix` | Das Routen-Präfix, das beim Auflösen von Dateien vom Anforderungspfad entfernt wird. Standard ist `/`. |
| `AllowDirectoryListing` | Wenn auf `true` gesetzt, aktiviert die Verzeichnisauflistung, wenn ein Verzeichnis angefordert wird und keine Indexdatei gefunden wird. Standard ist `false`. |
| `FileConverters` | Eine Liste von `HttpFileServerFileConverter`, die verwendet werden, um Dateien vor dem Bereitstellen zu transformieren. |

## Verzeichnisauflistung

Wenn `AllowDirectoryListing` aktiviert ist und der Benutzer einen Verzeichnispfad anfordert, erzeugt Sisk eine HTML-Seite, die den Inhalt dieses Verzeichnisses auflistet.

Die Verzeichnisauflistung enthält:
- Navigation zum übergeordneten Verzeichnis (`..`).
- Liste der Unterverzeichnisse.
- Liste der Dateien mit Größe und letztem Änderungsdatum.

## Dateikonverter

Dateikonverter ermöglichen es Ihnen, bestimmte Dateitypen abzufangen und anders zu verarbeiten. Beispielsweise könnten Sie ein Bild transkodieren, eine Datei on-the-fly komprimieren oder eine Datei mit Teilinhalt (Range-Anfragen) bereitstellen.

Sisk enthält zwei integrierte Konverter für Media-Streaming:
- `HttpFileAudioConverter`: Unterstützt `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Unterstützt `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Diese Konverter ermöglichen die Unterstützung von **HTTP Range Requests**, sodass Clients in Audio- und Videodateien vorspulen können.

### Erstellen eines benutzerdefinierten Konverters

Um einen benutzerdefinierten Dateikonverter zu erstellen, erben Sie von `HttpFileServerFileConverter` und implementieren `CanConvert` und `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // nur auf .txt-Dateien anwenden
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // gesamten Textinhalt in Großbuchstaben umwandeln
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Dann fügen Sie ihn zu Ihrem Handler hinzu:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```