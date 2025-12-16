# HTTP Server Engines

Фреймворк Sisk разделен на несколько пакетов, где основной пакет (Sisk.HttpServer) не включает базовый HTTP-сервер - по умолчанию используется [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) в качестве основного движка Sisk для выполнения низкоуровневой роли сервера.

Движок HTTP выполняет роль слоя ниже слоя приложения, предлагаемого Sisk. Этот слой отвечает за управление соединениями, сериализацию и десериализацию сообщений, контроль очереди сообщений и общение с сокетом машины.

Класс [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) предоставляет API для реализации всех необходимых функций HTTP-движка для использования в верхних слоях с Sisk, таких как маршрутизация, SSE, middleware и т. д. Эти функции не являются ответственностью HTTP-движка, а rather подмножества библиотек, которые будут использовать HTTP-движок в качестве основы для выполнения.

С этой абстракцией возможно перенести Sisk для использования с любым другим HTTP-движком, написанным на .NET или не на .NET, например Kestrel. В настоящее время Sisk остается использовать абстракцию родного .NET [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) в качестве значения по умолчанию для новых проектов. Это значение по умолчанию приносит некоторые специфические проблемы, такие как неопределенное поведение на разных платформах (HttpListener имеет одну реализацию для Windows и другую для других платформ), отсутствие поддержки SSL и не очень приятную производительность вне Windows.

Также доступна экспериментальная реализация высокопроизводительного сервера, написанного чисто на C#, в качестве HTTP-движка для Sisk, называемого проектом [Cadente](https://github.com/sisk-http/core/tree/main/cadente), который является экспериментом управляемого сервера, который можно использовать с Sisk или без него.

## Реализация HTTP-движка для Sisk

Вы можете создать мост соединения между существующим HTTP-сервером и Sisk, расширяя класс [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine).除了 этого класса, вам также придется реализовать абстракции для контекстов, запросов и ответов.

Полный пример абстракции доступен на [GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) для просмотра. Он выглядит следующим образом:

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

Во время создания HTTP-движка сервер будет слушать запросы в цикле и создавать контексты для обработки каждого из них в отдельных потоках. Для этого вам придется выбрать [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` цикл событий линеен - обработка контекста HTTP происходит в асинхронном цикле.
- `UnboundAsynchronousGetContext` цикл событий передается через методы `BeginGetContext` и `EndGetContext`.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

Вам не нужно реализовывать оба цикла событий. Выберите тот, который имеет больше смысла для вашего HTTP-движка.

## Тестирование

После связывания вашего HTTP-движка крайне важно провести тесты, чтобы убедиться, что все функции Sisk имеют идентичное поведение при использовании других движков. **Это крайне важно** иметь одинаковое поведение Sisk для разных HTTP-движков.

Вы можете посетить репозиторий тестов на [GitHub](https://github.com/sisk-http/core/tree/main/tests).