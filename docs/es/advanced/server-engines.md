# Motores de Servidor HTTP

El Sisk Framework se divide en varios paquetes, donde el principal (Sisk.HttpServer) no incluye un servidor HTTP base; por defecto, se utiliza [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) como el motor principal de Sisk para desempeñar el papel de bajo nivel del servidor.

El motor HTTP cumple el papel de la capa inferior a la capa de aplicación ofrecida por Sisk. Esta capa es responsable de la gestión de conexiones, serialización y deserialización de mensajes, control de la cola de mensajes y comunicación con el socket de la máquina.

La clase [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine) expone una API para implementar todas las funcionalidades necesarias de un motor HTTP que se utilizará en capas superiores con Sisk, como enrutamiento, SSE, middlewares, etc. Estas funciones no son responsabilidad del motor HTTP, sino del subconjunto de bibliotecas que utilizarán el motor HTTP como base para la ejecución.

Con esta abstracción, es posible portar Sisk para que se utilice con cualquier otro motor HTTP, escrito en .NET o no, como Kestrel, por ejemplo. Actualmente, Sisk sigue utilizando una abstracción del [HttpListener](https://learn.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-9.0) nativo de .NET como el valor predeterminado para nuevos proyectos. Esta abstracción predeterminada presenta algunos problemas específicos, como un comportamiento no especificado en diferentes plataformas (HttpListener tiene una implementación para Windows y otra para otras plataformas), falta de soporte para SSL y un rendimiento poco agradable fuera de Windows.

Una implementación experimental de un servidor de alto rendimiento escrito puramente en C# también está disponible como motor HTTP para Sisk, llamado el proyecto [Cadente](https://github.com/sisk-http/core/tree/main/cadente), que es un experimento de un servidor administrado que puede usarse con Sisk o no.

## Implementar un Motor HTTP para Sisk

Puedes crear un puente de conexión entre un servidor HTTP existente y Sisk extendiendo la clase [HttpServerEngine](/api/Sisk.Core.Http.Engine.HttpServerEngine). Además de esta clase, también tendrás que implementar abstracciones para contextos, peticiones y respuestas.

Un ejemplo completo de abstracción está [disponible en GitHub](https://github.com/sisk-http/core/blob/main/src/Http/Engine/HttpListenerAbstractEngine.cs) para ver. Se ve así:

```csharp
/// <summary>
/*  Proporciona una implementación de <see cref="HttpServerEngine"/> usando <see cref="HttpListener"/>.
*/
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

## Elegir un Bucle de Eventos

Durante la creación de un motor HTTP, el servidor escuchará peticiones en un bucle y creará contextos para manejar cada una de ellas en hilos separados. Para ello, tendrás que elegir un [HttpServerEngineContextEventLoopMechanism](/api/Sisk.Core.Http.Engine.HttpServerEngineContextEventLoopMechanism):

- `InlineAsynchronousGetContext` el bucle de eventos es lineal: las llamadas de manejo de contexto HTTP ocurren en un bucle asíncrono.
- `UnboundAsynchronousGetContext` el bucle de eventos se transmite a través de los métodos `BeginGetContext` y `EndGetContext`.

```csharp
public override HttpServerEngineContextEventLoopMechanism EventLoopMechanism => HttpServerEngineContextEventLoopMechanism.UnboundAsynchronousGetContext;
```

No necesitas implementar ambos bucles de eventos. Elige el que tenga más sentido para tu motor HTTP.

## Pruebas

Después de enlazar tu motor HTTP, es esencial realizar pruebas para asegurar que todas las funcionalidades de Sisk tengan un comportamiento idéntico al usar otros motores. **Es extremadamente importante** que Sisk tenga el mismo comportamiento con diferentes motores HTTP.

Puedes visitar el repositorio de pruebas en [GitHub](https://github.com/sisk-http/core/tree/main/tests).