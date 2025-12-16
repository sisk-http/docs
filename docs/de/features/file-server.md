# Dateiserver

Sisk bietet den `Sisk.Http.FileSystem`-Namespace, der Tools für die Bereitstellung statischer Dateien, Verzeichnisaufzeichnungen und Dateikonvertierung enthält. Diese Funktion ermöglicht es Ihnen, Dateien aus einem lokalen Verzeichnis bereitzustellen, mit Unterstützung für Bereichsanfragen (Audio-/Video-Streaming) und benutzerdefinierte Dateiverarbeitung.

## Bereitstellung statischer Dateien

Der einfachste Weg, um statische Dateien bereitzustellen, besteht darin, `HttpFileServer.CreateServingRoute` zu verwenden. Diese Methode erstellt eine Route, die einen URL-Präfix einem Verzeichnis auf der Festplatte zuordnet.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

// ordnet die Wurzel des Servers dem aktuellen Verzeichnis zu
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/", Directory.GetCurrentDirectory()));

// ordnet /assets dem "public/assets"-Verzeichnis zu
mainRouter.SetRoute(HttpFileServer.CreateServingRoute("/assets", Path.Combine(Directory.GetCurrentDirectory(), "public", "assets")));
```

Wenn eine Anfrage dem Routen-Präfix entspricht, sucht der `HttpFileServerHandler` nach einer Datei im angegebenen Verzeichnis. Wenn diese gefunden wird, wird die Datei bereitgestellt; andernfalls wird eine 404-Antwort (oder 403, wenn der Zugriff verweigert wird) zurückgegeben.

## HttpFileServerHandler

Für eine bessere Kontrolle über die Bereitstellung von Dateien können Sie den `HttpFileServerHandler` manuell instanziieren und konfigurieren.

```cs
var fileHandler = new HttpFileServerHandler("/var/www/html");

// aktiviert die Verzeichnisaufzeichnung (standardmäßig deaktiviert)
fileHandler.AllowDirectoryListing = true;

// setzt einen benutzerdefinierten Routen-Präfix (dieser wird vom Anfragepfad entfernt)
fileHandler.RoutePrefix = "/public";

// registriert die Handler-Aktion
mainRouter.SetRoute(RouteMethod.Get, "/public/.*", fileHandler.HandleRequest);
```

### Konfiguration

| Eigenschaft | Beschreibung |
|---|---|
| `RootDirectoryPath` | Der absolute oder relative Pfad zum Wurzelverzeichnis, aus dem Dateien bereitgestellt werden. |
| `RoutePrefix` | Der Routen-Präfix, der vom Anfragepfad entfernt wird, wenn Dateien aufgelöst werden. Standardmäßig `/`. |
| `AllowDirectoryListing` | Wenn auf `true` gesetzt, aktiviert die Verzeichnisaufzeichnung, wenn ein Verzeichnis angefordert wird und keine Index-Datei gefunden wird. Standardmäßig `false`. |
| `FileConverters` | Eine Liste von `HttpFileServerFileConverter`, die verwendet werden, um Dateien vor der Bereitstellung zu transformieren. |

## Verzeichnisaufzeichnung

Wenn `AllowDirectoryListing` aktiviert ist und der Benutzer einen Verzeichnispfad anfordert, generiert Sisk eine HTML-Seite, die den Inhalt dieses Verzeichnisses auflistet.

Die Verzeichnisaufzeichnung umfasst:
- Navigation zum übergeordneten Verzeichnis (`..`).
- Liste von Unterverzeichnissen.
- Liste von Dateien mit Größe und letztem Änderungsdatum.

## Dateikonverter

Dateikonverter ermöglichen es Ihnen, bestimmte Dateitypen zu erfassen und anders zu behandeln. Zum Beispiel möchten Sie möglicherweise ein Bild transkodieren, eine Datei auf dem Fly komprimieren oder eine Datei mithilfe von Teilinhalten (Bereichsanfragen) bereitstellen.

Sisk enthält zwei integrierte Konverter für Medien-Streaming:
- `HttpFileAudioConverter`: Behandelt `.mp3`, `.ogg`, `.wav`, `.flac`, `.ogv`.
- `HttpFileVideoConverter`: Behandelt `.webm`, `.avi`, `.mkv`, `.mpg`, `.mpeg`, `.wmv`, `.mov`, `.mp4`.

Diese Konverter ermöglichen die Unterstützung von **HTTP-Bereichsanfragen**, die es Clients ermöglichen, durch Audio- und Video-Dateien zu suchen.

### Erstellen eines benutzerdefinierten Konverters

Um einen benutzerdefinierten Dateikonverter zu erstellen, erben Sie von `HttpFileServerFileConverter` und implementieren `CanConvert` und `Convert`.

```cs
using Sisk.Core.Http;
using Sisk.Core.Http.FileSystem;

public class MyTextConverter : HttpFileServerFileConverter
{
    public override bool CanConvert(FileInfo file)
    {
        // wird nur auf .txt-Dateien angewendet
        return file.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase);
    }

    public override HttpResponse Convert(FileInfo file, HttpRequest request)
    {
        string content = File.ReadAllText(file.FullName);
        
        // wandelt den gesamten Textinhalt in Großbuchstaben um
        return new HttpResponse(200)
        {
            Content = new StringContent(content.ToUpper())
        };
    }
}
```

Fügen Sie ihn dann Ihrem Handler hinzu:

```cs
var handler = new HttpFileServerHandler("./files");
handler.FileConverters.Add(new MyTextConverter());
```