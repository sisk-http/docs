# HTTP-Server-Engines

Das Sisk Framework ist in mehrere Pakete unterteilt, wobei das Hauptpaket (Sisk.HttpServer) keinen Basis-HTTP-Server enthält - standardmäßig wird [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) als Haupt-Engine von Sisk verwendet, um die untergeordnete Rolle des Servers auszuführen.

Die HTTP-Engine erfüllt die Rolle der Schicht unterhalb der Anwendungsschicht, die von Sisk angeboten wird. Diese Schicht ist für die Verbindungsbearbeitung, die Serialisierung und Deserialisierung von Nachrichten, die Steuerung der Nachrichtenwarteschlange und die Kommunikation mit dem Socket des Computers verantwortlich.

Die [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine)-Klasse bietet eine API, um alle notwendigen Funktionalitäten einer HTTP-Engine zu implementieren, die in höheren Schichten mit Sisk verwendet werden können, wie z.B. Routing, SSE, Middlewares usw. Diese Funktionen sind nicht die Verantwortung der HTTP-Engine, sondern vielmehr eines Teils der Bibliotheken, die die HTTP-Engine als Basis für die Ausführung verwenden.

Durch diese Abstraktion ist es möglich, Sisk so anzupassen, dass es mit jeder anderen HTTP-Engine verwendet werden kann, die in .NET oder einer anderen Sprache geschrieben ist, wie z.B. Kestrel. Derzeit verwendet Sisk weiterhin eine Abstraktion des nativen .NET-[HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) als Standard für neue Projekte. Diese Standardabstraktion bringt einige spezifische Probleme mit sich, wie z.B. unbestimmtes Verhalten auf verschiedenen Plattformen (HttpListener hat eine Implementierung für Windows und eine andere für andere Plattformen), fehlende Unterstützung für SSL und keine sehr angenehme Leistung außerhalb von Windows.

Eine experimentelle Implementierung eines Hochleistungs-Servers, der rein in C# geschrieben ist, ist auch als HTTP-Engine für Sisk verfügbar, genannt das [Cadente](https://github.com/sisk-http/core/tree/main/cadente)-Projekt, das ein Experiment eines verwalteten Servers ist, der mit Sisk oder ohne verwendet werden kann.

## Implementierung einer HTTP-Engine für Sisk

Sie können eine Verbindung zwischen einem bestehenden HTTP-Server und Sisk herstellen, indem Sie die [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine)-Klasse erweitern. Zusätzlich zu dieser Klasse müssen Sie auch Abstraktionen für Kontexte, Anfragen und Antworten implementieren.

Ein vollständiges Abstraktionsbeispiel ist [auf GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) verfügbar. Es sieht wie folgt aus:

```csharp
/// <summary>
/// Bietet eine Implementierung von <see cref="HttpServerEngine"/> mit <see cref="HttpListener"/>.
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// Ruft die gemeinsam genutzte Instanz der <see cref="HttpListenerAbstractEngine"/>-Klasse ab.
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// Initialisiert eine neue Instanz der <see cref="HttpListenerAbstractEngine"/>-Klasse.
    /// </summary>
    public HttpListenerAbstractEngine () {
        _listener = new HttpListener {
            IgnoreWriteExceptions = true
        };
    }

    /// <inheritdoc/>
    public override TimeSpan IdleConnectionTimeout {
        get => _listener.TimeoutManager.IdleConnection;
        set => _listener.TimeoutManager.IdleConnection = value;
    }
    
    // ...
}
```

## Auswahl eines Ereignisschleifens

Während der Erstellung einer HTTP-Engine wird der Server auf Anfragen hören und Kontexte erstellen, um jede davon in separaten Threads zu bearbeiten. Dazu müssen Sie einen [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism) auswählen:

- `InlineAsynchronousGetContext` die Ereignisschleife ist linear - HTTP-Kontextbearbeitungsrufe erfolgen in einer asynchronen Schleife.
- `UnboundAsynchronousGetContext` die Ereignisschleife wird durch die `BeginGetContext`- und `EndGetContext`-Methoden übertragen.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

Sie müssen nicht beide Ereignisschleifen implementieren. Wählen Sie diejenige, die am meisten Sinn für Ihre HTTP-Engine ergibt.

## Testen

Nachdem Sie Ihre HTTP-Engine verknüpft haben, ist es wichtig, Tests durchzuführen, um sicherzustellen, dass alle Sisk-Funktionen identisches Verhalten aufweisen, wenn andere Engines verwendet werden. **Es ist extrem wichtig**, dass Sisk für verschiedene HTTP-Engines identisches Verhalten aufweist.

Sie können das Test-Repository auf [GitHub](https://github.com/sisk-http/core/tree/main/tests) besuchen.