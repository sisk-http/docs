---
title: "Configuración manual (avanzada)"
linkTitle: "Configuración manual"
weight: 10
aliases:
  - "/docs/es/advanced/manual-setup.html"
sourceHash: "5beab76d9614d79e"
---

Utilice la configuración manual cuando necesite ensamblar los componentes del servidor usted mismo, como cuando un proceso debe exponer varios hosts, puertos, routers o una configuración de servidor personalizada. Para la mayoría de las aplicaciones, la API del constructor es más corta y debe ser preferida. La configuración manual es útil cuando desea control directo sobre los cuatro componentes principales: un `Router`, uno o más objetos `ListeningHost`, una `HttpServerConfiguration` y el `HttpServer` final.

Primero, necesitamos entender el concepto de solicitud/respuesta. Es bastante simple: por cada solicitud, debe haber una respuesta. Sisk sigue también este principio. Creemos un método que responda con un mensaje "Hello, World!" en HTML, especificando el código de estado y los encabezados.

```csharp
// Program.cs
using Sisk.Core.Http;
using Sisk.Core.Routing;

static HttpResponse IndexPage(HttpRequest request)
{
    HttpResponse indexResponse = new HttpResponse
    {
        Status = System.Net.HttpStatusCode.OK,
        Content = new HtmlContent(@"
            <html>
                <body>
                    <h1>Hello, world!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

El siguiente paso es asociar este método con una ruta HTTP.

## Enrutadores

Los enrutadores son abstracciones de rutas de solicitud y sirven como puente entre solicitudes y respuestas para el servicio. Los enrutadores gestionan rutas del servicio, funciones y errores.

Un enrutador puede tener varias rutas, y cada ruta puede realizar diferentes operaciones en esa ruta, como ejecutar una función, servir una página o proporcionar un recurso del servidor.

Creemos nuestro primer enrutador y asociemos nuestro método `IndexPage` con la ruta de índice.

```csharp
Router mainRouter = new Router;

mainRouter.MapGet("/", IndexPage);
```

Ahora nuestro enrutador puede recibir solicitudes y enviar respuestas. Sin embargo, `mainRouter` no está vinculado a un host o a un servidor, por lo que no funcionará por sí solo. El siguiente paso es crear nuestro ListeningHost.

## Hosts de escucha y puertos

Un [ListeningHost](/api/Sisk.Core.Http.ListeningHost) puede alojar un enrutador y varios puertos de escucha para el mismo enrutador. Un [ListeningPort](/api/Sisk.Core.Http.ListeningPort) es un prefijo donde el servidor HTTP escuchará.

Aquí, podemos crear un `ListeningHost` que apunte a dos puntos finales para nuestro enrutador:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = mainRouter,
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Ahora nuestro servidor HTTP escuchará los puntos finales especificados y redirigirá sus solicitudes a nuestro enrutador.

## Configuración del servidor

La configuración del servidor es responsable de la mayor parte del comportamiento del propio servidor HTTP. En esta configuración, podemos asociar `ListeningHosts` con nuestro servidor.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Agregar nuestro ListeningHost a esta configuración del servidor
```

Opciones comunes de configuración del servidor:

| Propiedad | Predeterminado | Usar cuando | Notas |
| --- | --- | --- | --- |
| [RemoteRequestsAction](/api/Sisk.Core.Http.HttpServerConfiguration.RemoteRequestsAction) | `RequestListenAction.Accept` | El servicio debe rechazar solicitudes no locales a menos que provengan de un proxy inverso confiable. | Establézcalo en `Drop` solo cuando la topología de despliegue sea clara. |
| [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader) | `false` | Los clientes o proxies necesitan el ID de solicitud de Sisk en el encabezado de respuesta `X-Request-Id`. | Combínelo con registros que incluyan `HttpRequest.RequestId`. |
| [IdleConnectionTimeout](/api/Sisk.Core.Http.HttpServerConfiguration.IdleConnectionTimeout) | `120` seconds | Las conexiones keep-alive inactivas deben cerrarse tarde o temprano. | Esto lo aplica el motor HTTP. |
| [NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings) | `false` | Recibe encabezados con una discordancia de codificación. | Esto tiene un costo de procesamiento; déjelo deshabilitado a menos que sea necesario. |
| [SendSiskHeader](/api/Sisk.Core.Http.HttpServerConfiguration.SendSiskHeader) | `true` | Desea ocultar o exponer el encabezado `X-Powered-By` de Sisk. | Desactívelo para políticas de encabezados de producción más estrictas. |
| [OptionsLogMode](/api/Sisk.Core.Http.HttpServerConfiguration.OptionsLogMode) | `LogOutput.Both` | Desea reducir o redirigir los registros generados por el manejo automático de `OPTIONS`. | Utiliza los mismos valores de modo de registro que las rutas. |
| [AsyncRequestProcessing](/api/Sisk.Core.Http.HttpServerConfiguration.AsyncRequestProcessing) | `true` | Necesita procesamiento determinista de una sola solicitud para diagnóstico. | Desactivarlo limita el rendimiento. |
| [DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) | `true` | Los valores del contenedor de solicitud que implementan `IDisposable` deben disponerse automáticamente. | Manténgalo habilitado a menos que la propiedad se gestione en otro lugar. |
| [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) | `true` | Los manejadores de valores deben recibir enumerables asíncronos como valores enumerables bloqueantes. | Desactívelo cuando implemente su propio manejo de flujos asíncronos. |
| [KeepAlive](/api/Sisk.Core.Http.HttpServerConfiguration.KeepAlive) | `true` | Las conexiones deben permanecer reutilizables después de las respuestas. | Desactívelo para clientes o intermediarios que no manejan bien las conexiones persistentes. |
| [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash) | `false` | Las rutas GET deben redirigir a una URL con barra diagonal final. | Se aplica solo a rutas que no son expresiones regulares. |
| [MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) | `0` | Los cuerpos de solicitud necesitan un límite de tamaño. | `0` significa ilimitado hasta que se alcancen los límites del framework o de la memoria. |
| [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression) | `false` | Las respuestas deben comprimirse automáticamente cuando el cliente lo soporta. | Las respuestas `CompressedContent` existentes no se comprimen de nuevo. |

A continuación, podemos crear nuestro servidor HTTP:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Inicia el servidor
Console.ReadKey(); // Evita que la aplicación salga
```

Ahora podemos compilar nuestro ejecutable y ejecutar nuestro servidor HTTP con el comando:

```bash
dotnet watch
```

En tiempo de ejecución, abra su navegador y navegue a la ruta del servidor, y debería ver:

<img src="/assets/img/localhost.png" >
