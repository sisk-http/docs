# HTTP Server Engines

Das Sisk Framework ist in mehrere Pakete unterteilt, wobei das Hauptpaket (Sisk.HttpServer) keinen Basis-HTTP-Server enthält – standardmäßig wird [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) als Haupt-Engine von Sisk verwendet, um die Low‑Level-Rolle des Servers zu übernehmen.

Die HTTP‑Engine erfüllt die Rolle der Schicht unterhalb der Anwendungsschicht, die von Sisk angeboten wird. Diese Schicht ist verantwortlich für die Verbindungsverwaltung, die Serialisierung und Deserialisierung von Nachrichten, die Steuerung der Nachrichtenwarteschlange und die Kommunikation mit dem Socket des Geräts.

Die Klasse [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) stellt eine API bereit, um alle notwendigen Funktionen einer HTTP‑Engine zu implementieren, die in höheren Schichten mit Sisk verwendet werden können, wie Routing, SSE, Middleware usw. Diese Funktionen liegen nicht in der Verantwortung der HTTP‑Engine, sondern in dem Teil der Bibliotheken, die die HTTP‑Engine als Basis für die Ausführung nutzen.

Durch diese Abstraktion ist es möglich, Sisk so zu portieren, dass es mit jeder anderen HTTP‑Engine verwendet werden kann, die in .NET geschrieben ist oder nicht, z. B. Kestrel. Derzeit verwendet Sisk weiterhin eine Abstraktion des nativen .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) als Standard für neue Projekte. Diese Standardabstraktion bringt einige spezifische Probleme mit sich, wie unbestimmtes Verhalten auf verschiedenen Plattformen (HttpListener hat eine Implementierung für Windows und eine andere für andere Plattformen), fehlende SSL-Unterstützung und nicht sehr angenehme Leistung außerhalb von Windows.

Eine experimentelle Implementierung eines Hochleistungsservers, der ausschließlich in C# geschrieben ist, ist ebenfalls als HTTP‑Engine für Sisk verfügbar, genannt das [Cadente](https://github.com/sisk-http/core/tree/main/cadente) Projekt, das ein Experiment eines verwalteten Servers ist, der mit Sisk oder ohne verwendet werden kann.

## Implementierung einer HTTP‑Engine für Sisk

Sie können eine Verbindung zwischen einem bestehenden HTTP‑Server und Sisk herstellen, indem Sie die Klasse [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) erweitern. Zusätzlich zu dieser Klasse müssen Sie auch Abstraktionen für Kontexte, Anfragen und Antworten implementieren.

Ein vollständiges Abstraktionsbeispiel ist [auf GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) verfügbar. Es sieht so aus:

```csharp
/// <summary>
/// Provides an implementation of <see cref="HttpServerEngine"/> using <see cref="HttpListener"/>.
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// Gets the shared instance of the <see cref="HttpListenerAbstractEngine"/> class.
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// Initializes a new instance of the <see cref="HttpListenerAbstractEngine"/> class.
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

## Auswahl einer Event‑Loop

Während der Erstellung einer HTTP‑Engine wird der Server Anfragen in einer Schleife empfangen und Kontexte erstellen, um jede einzelne in separaten Threads zu verarbeiten. Dafür müssen Sie einen [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism) wählen:

- `InlineAsynchronousGetContext` – die Event‑Loop ist linear – Aufrufe zur Handhabung des HTTP‑Kontexts erfolgen in einer asynchronen Schleife.
- `UnboundAsynchronousGetContext` – die Event‑Loop wird durch die Methoden `BeginGetContext` und `EndGetContext` übertragen.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

Sie müssen nicht beide Event‑Loops implementieren. Wählen Sie diejenige, die für Ihre HTTP‑Engine am sinnvollsten ist.

## Tests

Nach dem Verknüpfen Ihrer HTTP‑Engine ist es wichtig, Tests durchzuführen, um sicherzustellen, dass alle Sisk‑Funktionen bei der Verwendung anderer Engines identisches Verhalten zeigen. **Es ist äußerst wichtig**, dass Sisk bei verschiedenen HTTP‑Engines das gleiche Verhalten aufweist.

Sie können das Test‑Repository auf [GitHub](https://github.com/sisk-http/core/tree/main/tests) besuchen.