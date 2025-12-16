# Motores de servidor HTTP

El marco de trabajo Sisk se divide en varios paquetes, donde el principal (Sisk.HttpServer) no incluye un servidor HTTP base - por defecto, [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) se utiliza como el motor principal de Sisk para realizar el papel de bajo nivel del servidor.

El motor HTTP cumple el papel de la capa debajo de la capa de aplicación ofrecida por Sisk. Esta capa es responsable de la gestión de conexiones, serialización y deserialización de mensajes, control de cola de mensajes y comunicación con el socket de la máquina.

La clase [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) expone una API para implementar todas las funcionalidades necesarias de un motor HTTP para ser utilizado en capas superiores con Sisk, como enrutamiento, SSE, middlewares, etc. Estas funciones no son responsabilidad del motor HTTP, sino de un subconjunto de bibliotecas que utilizarán el motor HTTP como base para la ejecución.

Con esta abstracción, es posible portar Sisk para ser utilizado con cualquier otro motor HTTP, escrito en .NET o no, como Kestrel, por ejemplo. Actualmente, Sisk sigue utilizando una abstracción del [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) nativo de .NET como el valor predeterminado para nuevos proyectos. Esta abstracción predeterminada conlleva algunos problemas específicos, como un comportamiento no especificado en diferentes plataformas (HttpListener tiene una implementación para Windows y otra para otras plataformas), falta de soporte para SSL y un rendimiento no muy agradable fuera de Windows.

También está disponible una implementación experimental de un servidor de alto rendimiento escrito puramente en C# como un motor HTTP para Sisk, llamado el proyecto [Cadente](https://github.com/sisk-http/core/tree/main/cadente), que es un experimento de un servidor administrado que se puede utilizar con Sisk o no.

## Implementar un motor HTTP para Sisk

Puedes crear un puente de conexión entre un servidor HTTP existente y Sisk extendiendo la clase [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine). Además de esta clase, también deberás implementar abstracciones para contextos, solicitudes y respuestas.

Un ejemplo de abstracción completa está [disponible en GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) para su visualización. Se ve así:

```csharp
/// <summary>
/// Proporciona una implementación de <see cref="HttpServerEngine"/> utilizando <see cref="HttpListener"/>.
/// </summary>
public sealed class HttpListenerAbstractEngine : HttpServerEngine {
    private HttpListener _listener;
    private static Lazy<HttpListenerAbstractEngine> shared = new Lazy<HttpListenerAbstractEngine> ( () => new HttpListenerAbstractEngine () );

    /// <summary>
    /// Obtiene la instancia compartida de la clase <see cref="HttpListenerAbstractEngine"/>.
    /// </summary>
    public static HttpListenerAbstractEngine Shared => shared.Value;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="HttpListenerAbstractEngine"/>.
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

## Elegir un bucle de eventos

Durante la creación de un motor HTTP, el servidor escuchará las solicitudes en un bucle y creará contextos para manejar cada una de ellas en hilos separados. Para esto, deberás elegir un [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` el bucle de eventos es lineal - las llamadas de manejo de contexto HTTP ocurren en un bucle asíncrono.
- `UnboundAsynchronousGetContext` el bucle de eventos se transmite a través de los métodos `BeginGetContext` y `EndGetContext`.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

No necesitas implementar ambos bucles de eventos. Elige el que más sentido tenga para tu motor HTTP.

## Pruebas

Después de vincular tu motor HTTP, es esencial realizar pruebas para asegurarte de que todas las funcionalidades de Sisk tengan un comportamiento idéntico al utilizar otros motores. **Es extremadamente importante** tener el mismo comportamiento de Sisk para diferentes motores HTTP.

Puedes visitar el repositorio de pruebas en [GitHub](https://github.com/sisk-http/core/tree/main/tests).