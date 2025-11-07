# HTTP Server Engines

Фреймворк Sisk разделён на несколько пакетов, где основной (Sisk.HttpServer) не включает базовый HTTP‑сервер — по умолчанию в качестве основного движка Sisk используется [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) для выполнения низкоуровневой роли сервера.

HTTP‑движок выполняет роль слоя ниже уровня приложения, предлагаемого Sisk. Этот слой отвечает за управление соединениями, сериализацию и десериализацию сообщений, контроль очереди сообщений и взаимодействие с сокетом машины.

Класс [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) предоставляет API для реализации всех необходимых функций HTTP‑движка, которые будут использоваться в верхних слоях с Sisk, таких как маршрутизация, SSE, промежуточные слои и т.д. Эти функции не являются обязанностью HTTP‑движка, а скорее подмножества библиотек, которые используют HTTP‑движок как основу для выполнения.

Благодаря этой абстракции возможно портировать Sisk для использования с любым другим HTTP‑движком, написанным на .NET или не на нём, например Kestrel. В настоящее время Sisk остаётся использовать абстракцию нативного .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) в качестве дефолта для новых проектов. Эта дефолтная абстракция приносит некоторые специфические проблемы, такие как неопределённое поведение на разных платформах (HttpListener имеет одну реализацию для Windows и другую для других платформ), отсутствие поддержки SSL и не очень приятная производительность вне Windows.

Экспериментальная реализация высокопроизводительного сервера, написанного полностью на C#, также доступна как HTTP‑движок для Sisk, под названием проект [Cadente](https://github.com/sisk-http/core/tree/main/cadente), который является экспериментом управляемого сервера, который может использоваться с Sisk или без него.

## Реализация HTTP‑движка для Sisk

Вы можете создать мост соединения между существующим HTTP‑сервером и Sisk, расширив класс [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine). В дополнение к этому классу вам также понадобится реализовать абстракции для контекстов, запросов и ответов.

Полный пример абстракции доступен на [GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) для просмотра. Он выглядит так:

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

## Выбор цикла событий

При создании HTTP‑движка сервер будет прослушивать запросы в цикле и создавать контексты для обработки каждого из них в отдельных потоках. Для этого вам понадобится выбрать [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` — цикл событий линейный — вызовы обработки HTTP‑контекста происходят в асинхронном цикле.
- `UnboundAsynchronousGetContext` — цикл событий передаётся через методы `BeginGetContext` и `EndGetContext`.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

Вам не нужно реализовывать оба цикла событий. Выберите тот, который имеет наибольший смысл для вашего HTTP‑движка.

## Тестирование

После связывания вашего HTTP‑движка крайне важно провести тесты, чтобы убедиться, что все функции Sisk ведут себя одинаково при использовании других движков. **Очень важно** иметь одинаковое поведение Sisk для разных HTTP‑движков.

Вы можете посетить репозиторий тестов на [GitHub](https://github.com/sisk-http/core/tree/main/tests).