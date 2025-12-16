# Configuración manual (avanzada)

En esta sección, crearemos nuestro servidor HTTP sin ningún estándar predefinido, de una manera completamente abstracta. Aquí, puedes construir manualmente cómo funcionará tu servidor HTTP. Cada ListeningHost tiene un enrutador, y un servidor HTTP puede tener múltiples ListeningHosts, cada uno apuntando a un host diferente en un puerto diferente.

Primero, necesitamos entender el concepto de solicitud/respuesta. Es bastante simple: para cada solicitud, debe haber una respuesta. Sisk sigue este principio también. Creemos un método que responda con un mensaje "Hola, mundo" en HTML, especificando el código de estado y los encabezados.

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
                    <h1>Hola, mundo!</h1>
                </body>
            </html>
        ")
    };

    return indexResponse;
}
```

El siguiente paso es asociar este método con una ruta HTTP.

## Enrutadores

Los enrutadores son abstracciones de rutas de solicitud y sirven como el puente entre solicitudes y respuestas para el servicio. Los enrutadores administran rutas de servicio, funciones y errores.

Un enrutador puede tener varias rutas, y cada ruta puede realizar diferentes operaciones en esa ruta, como ejecutar una función, servir una página o proporcionar un recurso desde el servidor.

Creemos nuestro primer enrutador y asociemos nuestro método `IndexPage` con la ruta de índice.

```csharp
Router mainRouter = new Router();

// SetRoute asociará todas las rutas de índice con nuestro método.
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage);
```

Ahora nuestro enrutador puede recibir solicitudes y enviar respuestas. Sin embargo, `mainRouter` no está vinculado a un host o servidor, por lo que no funcionará por sí solo. El siguiente paso es crear nuestro ListeningHost.

## Hosts y puertos de escucha

Un [ListeningHost](/api/Sisk.Core.Http.ListeningHost) puede hospedar un enrutador y varios puertos de escucha para el mismo enrutador. Un [ListeningPort](/api/Sisk.Core.Http.ListeningPort) es un prefijo donde el servidor HTTP escuchará.

Aquí, podemos crear un `ListeningHost` que apunte a dos puntos finales para nuestro enrutador:

```csharp
ListeningHost myHost = new ListeningHost
{
    Router = new Router(),
    Ports = new ListeningPort[]
    {
        new ListeningPort("http://localhost:5000/")
    }
};
```

Ahora nuestro servidor HTTP escuchará en los puntos finales especificados y redirigirá sus solicitudes a nuestro enrutador.

## Configuración del servidor

La configuración del servidor es responsable de la mayoría del comportamiento del servidor HTTP en sí. En esta configuración, podemos asociar `ListeningHosts` con nuestro servidor.

```csharp
HttpServerConfiguration config = new HttpServerConfiguration();
config.ListeningHosts.Add(myHost); // Agregue nuestro ListeningHost a esta configuración del servidor
```

A continuación, podemos crear nuestro servidor HTTP:

```csharp
HttpServer server = new HttpServer(config);
server.Start();    // Inicia el servidor
Console.ReadKey(); // Evita que la aplicación se cierre
```

Ahora podemos compilar nuestro ejecutable y ejecutar nuestro servidor HTTP con el comando:

```bash
dotnet watch
```

En tiempo de ejecución, abre tu navegador y navega a la ruta del servidor, y deberías ver:

<img src="/assets/img/localhost.png" >