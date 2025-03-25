# INI-Konfiguration

Sisk hat eine Methode für das Abrufen von Startkonfigurationen, die nicht JSON sind. Tatsächlich kann jede Pipeline, die [IConfigurationReader](/api/Sisk.Core.Http.Hosting.IConfigurationReader) implementiert, mit [PortableConfigurationBuilder.WithConfigurationPipeline](/api/Sisk.Core.Http.Hosting.PortableConfigurationBuilder) verwendet werden, um die Serverkonfiguration aus jeder Dateityp zu lesen.

Das [Sisk.IniConfiguration](https://www.nuget.org/packages/Sisk.IniConfiguration/)-Paket bietet einen streambasierten INI-Dateileser, der keine Ausnahmen für häufige Syntaxfehler auslöst und eine einfache Konfigurationssyntax hat. Dieses Paket kann außerhalb des Sisk-Frameworks verwendet werden und bietet Flexibilität für Projekte, die einen effizienten INI-Dokumentleser benötigen.

## Installation

Um das Paket zu installieren, können Sie mit folgendem Befehl beginnen:

```bash
$ dotnet add package Sisk.IniConfiguration
```

Sie können auch das Core-Paket installieren, das weder den INI-[IConfigurationReader](https://docs.sisk-framework.org/api/Sisk.Core.Http.Hosting.IConfigurationReader) noch die Sisk-Abhängigkeit enthält, sondern nur die INI-Serialisierer:

```bash
$ dotnet add package Sisk.IniConfiguration.Core
```

Mit dem Hauptpaket können Sie es in Ihrem Code wie im folgenden Beispiel verwenden:

```cs
class Program
{
    static HttpServerHostContext Host = null!;

    static void Main(string[] args)
    {
        Host = HttpServer.CreateBuilder()
            .UsePortableConfiguration(config =>
            {
                config.WithConfigFile("app.ini", createIfDontExists: true);
                
                // verwendet den IniConfigurationReader-Konfigurationsleser
                config.WithConfigurationPipeline<IniConfigurationReader>();
            })
            .UseRouter(r =>
            {
                r.MapGet("/", SayHello);
            })
            .Build();
        
        Host.Start();
    }

    static HttpResponse SayHello(HttpRequest request)
    {
        string? name = Host.Parameters["name"] ?? "world";
        return new HttpResponse($"Hallo, {name}!");
    }
}
```

Der obige Code sucht nach einer app.ini-Datei im aktuellen Verzeichnis des Prozesses (CurrentDirectory). Die INI-Datei sieht wie folgt aus:

```ini
[Server]
# Mehrere Zuhöradressen werden unterstützt
Listen = http://localhost:5552/
Listen = http://localhost:5553/
ThrowExceptions = false
AccessLogsStream = console

[Cors]
AllowMethods = GET, POST
AllowHeaders = Content-Type, Authorization
AllowOrigin = *

[Parameters]
Name = "Kanye West"
```

## INI-Geschmack und Syntax

Aktuelle Implementierung des Geschmacks:

- Eigenschaften- und Sektionsnamen sind **groß-/kleinschreibungsunabhängig**.
- Eigenschaftsnamen und Werte sind **gekürzt**, sofern Werte nicht in Anführungszeichen gesetzt sind.
- Werte können mit einfachen oder doppelten Anführungszeichen in Anführungszeichen gesetzt werden. Anführungszeichen können Zeilenumbrüche enthalten.
- Kommentare werden mit `#` und `;` unterstützt. **Nachgestellte Kommentare sind ebenfalls erlaubt**.
- Eigenschaften können mehrere Werte haben.

Im Detail finden Sie die Dokumentation für den "Geschmack" des INI-Parsers, der in Sisk verwendet wird, [in diesem Dokument](https://github.com/sisk-http/archive/blob/master/ext/ini-reader-syntax.md).

Verwenden Sie beispielsweise den folgenden INI-Code:

```ini
One = 1
Value = dies ist ein Wert
Another value = "dieser Wert
    hat einen Zeilenumbruch darin"

; der Code unten hat einige Farben
[some section]
Color = Red
Color = Blue
Color = Yellow ; verwenden Sie nicht gelb
```

Analysieren Sie ihn mit:

```csharp
// analysieren Sie den INI-Text aus der Zeichenfolge
IniDocument doc = IniDocument.FromString(iniText);

// erhalten Sie einen Wert
string? one = doc.Global.GetOne("one");
string? anotherValue = doc.Global.GetOne("another value");

// erhalten Sie mehrere Werte
string[]? colors = doc.GetSection("some section")?.GetMany("color");
```

## Konfigurationsparameter

| Sektion und Name | Mehrere Werte zulassen | Beschreibung |
| ---------------- | --------------------- | ----------- |
| `Server.Listen` | Ja | Die Zuhöradressen/Ports des Servers. |
| `Server.Encoding` | Nein | Die Standardcodierung des Servers. |
| `Server.MaximumContentLength` | Nein | Die maximale Inhaltslänge des Servers in Bytes. |
| `Server.IncludeRequestIdHeader` | Nein | Gibt an, ob der HTTP-Server den X-Request-Id-Header senden soll. |
| `Server.ThrowExceptions` | Nein | Gibt an, ob unbehandelte Ausnahmen ausgelöst werden sollen. |
| `Server.AccessLogsStream` | Nein | Gibt den Ausgabestream für den Zugriff auf die Protokolle an. |
| `Server.ErrorsLogsStream` | Nein | Gibt den Ausgabestream für die Fehlerprotokolle an. |
| `Cors.AllowMethods` | Nein | Gibt den Wert des CORS-Allow-Methods-Headers an. |
| `Cors.AllowHeaders` | Nein | Gibt den Wert des CORS-Allow-Headers-Headers an. |
| `Cors.AllowOrigins` | Nein | Gibt mehrere Allow-Origin-Header, getrennt durch Kommata, an. [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) für weitere Informationen. |
| `Cors.AllowOrigin` | Nein | Gibt einen Allow-Origin-Header an. |
| `Cors.ExposeHeaders` | Nein | Gibt den Wert des CORS-Expose-Headers-Headers an. |
| `Cors.AllowCredentials` | Nein | Gibt den Wert des CORS-Allow-Credentials-Headers an. |
| `Cors.MaxAge` | Nein | Gibt den Wert des CORS-Max-Age-Headers an. |