# Diensteanbieter

Diensteanbieter sind eine Möglichkeit, Ihre Sisk-Anwendung auf verschiedene Umgebungen mit einer portablen Konfigurationsdatei zu übertragen. Diese Funktion ermöglicht es Ihnen, den Serverport, Parameter und andere Optionen ohne Änderung des Anwendungscode für jede Umgebung zu ändern. Dieses Modul hängt von der Sisk-Konstruktionsyntax ab und kann über die Methode `UsePortableConfiguration` konfiguriert werden.

Ein Konfigurationsanbieter wird mit `IConfigurationProvider` implementiert, der einen Konfigurationsleser bereitstellt und jede Implementierung erhalten kann. Standardmäßig bietet Sisk einen JSON-Konfigurationsleser, aber es gibt auch ein Paket für INI-Dateien. Sie können auch Ihren eigenen Konfigurationsanbieter erstellen und ihn mit:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigReader<MyConfigurationReader>();
    })
    .Build();
```

Wie bereits erwähnt, ist der Standardanbieter eine JSON-Datei. Standardmäßig wird nach einer Datei mit dem Namen `service-config.json` gesucht, und diese wird im aktuellen Verzeichnis des laufenden Prozesses und nicht im Verzeichnis der ausführbaren Datei gesucht.

Sie können den Dateinamen sowie das Verzeichnis, in dem Sisk nach der Konfigurationsdatei suchen soll, mit:

```csharp
using Sisk.Core.Http;
using Sisk.Core.Http.Hosting;

using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithConfigFile("config.toml",
            createIfDontExists: true,
            lookupDirectories:
                ConfigurationFileLookupDirectory.CurrentDirectory |
                ConfigurationFileLookupDirectory.AppDirectory);
    })
    .Build();
```

Der obige Code sucht nach der Datei `config.toml` im aktuellen Verzeichnis des laufenden Prozesses. Wenn sie nicht gefunden wird, sucht er dann im Verzeichnis, in dem die ausführbare Datei liegt. Wenn die Datei nicht existiert, wird der Parameter `createIfDontExists` beachtet, und die Datei wird ohne Inhalt im letzten getesteten Pfad (basierend auf `lookupDirectories`) erstellt, und ein Fehler wird in der Konsole ausgegeben, was die Anwendung verhindert, sich zu initialisieren.

> [!TIP]
> 
> Sie können den Quellcode des INI-Konfigurationslesers und des JSON-Konfigurationslesers betrachten, um zu verstehen, wie ein `IConfigurationProvider` implementiert wird.

## Lesen von Konfigurationen aus einer JSON-Datei

Standardmäßig bietet Sisk einen Konfigurationsanbieter, der Konfigurationen aus einer JSON-Datei liest. Diese Datei folgt einer festen Struktur und besteht aus den folgenden Parametern:

```json
{
    "Server": {
        "DefaultEncoding": "UTF-8",
        "ThrowExceptions": true,
        "IncludeRequestIdHeader": true
    },
    "ListeningHost": {
        "Label": "Meine Sisk-Anwendung",
        "Ports": [
            "http://localhost:80/",
            "https://localhost:443/",  // Konfigurationsdateien unterstützen auch Kommentare
        ],
        "CrossOriginResourceSharingPolicy": {
            "AllowOrigin": "*",
            "AllowOrigins": [ "*" ],   // neu in 0.14
            "AllowMethods": [ "*" ],
            "AllowHeaders": [ "*" ],
            "MaxAge": 3600
        },
        "Parameters": {
            "MySqlConnection": "server=localhost;user=root;"
        }
    }
}
```

Die aus einer Konfigurationsdatei erstellten Parameter können im Serverkonstruktor abgerufen werden:

```csharp
using var app = HttpServer.CreateBuilder()
    .UsePortableConfiguration(config =>
    {
        config.WithParameters(paramCollection =>
        {
            string databaseConnection = paramCollection.GetValueOrThrow("MySqlConnection");
        });
    })
    .Build();
```

Jeder Konfigurationsleser bietet eine Möglichkeit, die Serverinitialisierungsparameter zu lesen. Einige Eigenschaften sind so konzipiert, dass sie in der Prozessumgebung anstelle der Konfigurationsdatei definiert werden, wie z. B. sensible API-Daten, API-Schlüssel usw.

## Konfigurationsdateistruktur

Die JSON-Konfigurationsdatei besteht aus den folgenden Eigenschaften:

<table>
    <thead>
        <tr>
            <th>Eigenschaft</th>
            <th>Pflichtfeld</th>
            <th>Beschreibung</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Server</td>
            <td>Erforderlich</td>
            <td>Stellt den Server selbst mit seinen Einstellungen dar.</td>
        </tr>
        <tr>
            <td>Server.AccessLogsStream</td>
            <td>Optional</td>
            <td>Standardmäßig <code>console</code>. Gibt den Ausgabestream für die Zugriffsprotokolle an. Kann eine Dateiname, <code>null</code> oder <code>console</code> sein.</td>
        </tr>
        <tr>
            <td>Server.ErrorsLogsStream</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Gibt den Ausgabestream für die Fehlerprotokolle an. Kann eine Dateiname, <code>null</code> oder <code>console</code> sein.</td>
        </tr>
        <tr>
            <td>Server.MaximumContentLength</td>
            <td>Optional</td>
            <tr>
            <td>Server.MaximumContentLength</td>
            <td>Optional</td>
            <td>Standardmäßig <code>0</code>. Gibt die maximale Inhaltslänge in Bytes an. Null bedeutet unendlich.</td>
        </tr>
        <tr>
            <td>Server.IncludeRequestIdHeader</td>
            <td>Optional</td>
            <td>Standardmäßig <code>false</code>. Gibt an, ob der HTTP-Server den <code>X-Request-Id</code>-Header senden soll.</td>
        </tr>
        <tr>
            <td>Server.ThrowExceptions</td>
            <td>Optional</td>
            <td>Standardmäßig <code>true</code>. Gibt an, ob unbehandelte Ausnahmen ausgelöst werden sollen. Auf <code>false</code> setzen, wenn die Anwendung in Produktion ist, und auf <code>true</code>, wenn die Anwendung debuggt wird.</td>
        </tr>
        <tr>
            <td>ListeningHost</td>
            <td>Erforderlich</td>
            <td>Stellt den Server-Host dar, der zugehört.</td>
        </tr>
        <tr>
            <td>ListeningHost.Label</td>
            <td>Optional</td>
            <td>Stellt die Anwendungsbezeichnung dar.</td>
        </tr>
        <tr>
            <td>ListeningHost.Ports</td>
            <td>Erforderlich</td>
            <td>Stellt ein Array von Zeichenfolgen dar, die der Syntax von <a href="/api/Sisk.Core.Http.ListeningPort">ListeningPort</a> entsprechen.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy</td>
            <td>Optional</td>
            <td>Konfiguriert die CORS-Header für die Anwendung.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowCredentials</td>
            <td>Optional</td>
            <td>Standardmäßig <code>false</code>. Gibt den <code>Allow-Credentials</code>-Header an.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.ExposeHeaders</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet ein Array von Zeichenfolgen. Gibt den <code>Expose-Headers</code>-Header an.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigin</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet eine Zeichenfolge. Gibt den <code>Allow-Origin</code>-Header an.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowOrigins</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet ein Array von Zeichenfolgen. Gibt mehrere <code>Allow-Origin</code>-Header an. Siehe <a href="/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins">AllowOrigins</a> für weitere Informationen.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowMethods</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet ein Array von Zeichenfolgen. Gibt den <code>Allow-Methods</code>-Header an.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.AllowHeaders</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet ein Array von Zeichenfolgen. Gibt den <code>Allow-Headers</code>-Header an.</td>
        </tr>
        <tr>
            <td>ListeningHost.CrossOriginResourceSharingPolicy.MaxAge</td>
            <td>Optional</td>
            <td>Standardmäßig <code>null</code>. Erwartet eine Ganzzahl. Gibt den <code>Max-Age</code>-Header in Sekunden an.</td>
        </tr>
        <tr>
            <td>ListeningHost.Parameters</td>
            <td>Optional</td>
            <td>Gibt die Eigenschaften an, die der Anwendungskonfigurationsmethode bereitgestellt werden.</td>
        </tr>
    </tbody>
</table>