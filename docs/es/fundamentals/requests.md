# Requests

Las solicitudes son estructuras que representan un mensaje de solicitud HTTP. El objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contiene funciones útiles para manejar mensajes HTTP en toda tu aplicación.

Una solicitud HTTP se forma por el método, ruta, versión, encabezados y cuerpo.

En este documento, te enseñaremos cómo obtener cada uno de estos elementos.

## Obtener el método de la solicitud

Para obtener el método de la solicitud recibida, puedes usar la propiedad Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Esta propiedad devuelve el método de la solicitud representado por un objeto [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> A diferencia de los métodos de ruta, esta propiedad no sirve el elemento [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). En su lugar, devuelve el método real de la solicitud.

## Obtener componentes de la URL de la solicitud

Puedes obtener varios componentes de una URL mediante ciertas propiedades de una solicitud. Para este ejemplo, consideremos la URL:

```
http://localhost:5000/user/login?email=foo@bar.com
```

| Nombre del componente | Descripción | Valor del componente |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtiene la ruta de la solicitud. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtiene la ruta de la solicitud y la cadena de consulta. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtiene la cadena completa de la URL de la solicitud. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtiene el host de la solicitud. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtiene el host y el puerto de la solicitud. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtiene la consulta de la solicitud. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtiene la consulta de la solicitud en una colección de valores nombrados. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina si la solicitud está usando SSL (true) o no (false). | `false` |

También puedes optar por usar la propiedad [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que incluye todo lo anterior en un solo objeto.

## Obtener el cuerpo de la solicitud

Algunas solicitudes incluyen cuerpo, como formularios, archivos o transacciones API. Puedes obtener el cuerpo de una solicitud desde la propiedad:

```cs
// obtiene el cuerpo de la solicitud como una cadena, usando la codificación de la solicitud como el codificador
string body = request.Body;

// o lo obtiene en un array de bytes
byte[] bodyBytes = request.RawBody;

// o, de lo contrario, puedes transmitirlo.
Stream requestStream = request.GetRequestStream();
```

También es posible determinar si hay un cuerpo en la solicitud y si está cargado con las propiedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina si la solicitud tiene contenidos y [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) que indica que el servidor HTTP recibió completamente el contenido del punto remoto.

No es posible leer el contenido de la solicitud a través de `GetRequestStream` más de una vez. Si lees con este método, los valores en `RawBody` y `Body` tampoco estarán disponibles. No es necesario disponer del flujo de solicitud en el contexto de la solicitud, ya que se dispone al final de la sesión HTTP en la que se creó. Además, puedes usar la propiedad [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obtener la mejor codificación para decodificar la solicitud manualmente.

El servidor tiene límites para leer el contenido de la solicitud, que se aplica tanto a [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) como a [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Estas propiedades copian todo el flujo de entrada a un búfer local del mismo tamaño que [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Se devuelve una respuesta con estado 413 Content Too Large al cliente si el contenido enviado es mayor que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido en la configuración del usuario. Además, si no hay límite configurado o si es demasiado grande, el servidor lanzará una [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) cuando el contenido enviado por el cliente exceda [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) y si el contenido se intenta acceder a través de una de las propiedades mencionadas anteriormente. Puedes seguir manejando el contenido mediante transmisión.

> [!NOTE]
> Aunque Sisk lo permite, siempre es una buena idea seguir la Semántica HTTP para crear tu aplicación y no obtener ni servir contenido en métodos que no lo permiten. Lee sobre [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Obtener el contexto de la solicitud

El Contexto HTTP es un objeto exclusivo de Sisk que almacena información del servidor HTTP, ruta, enrutador y manejador de solicitud. Puedes usarlo para poder organizarte en un entorno donde estos objetos son difíciles de organizar.

El objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contiene información almacenada que se pasa de un manejador de solicitud a otro punto, y puede consumirse en el destino final. Este objeto también puede ser usado por manejadores de solicitud que se ejecutan después del callback de ruta.

> [!TIP]
> Esta propiedad también es accesible por la propiedad [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            context.RequestBag.Add("AuthenticatedUser", new User("Bob"));
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

El manejador de solicitud anterior definirá `AuthenticatedUser` en el request bag, y puede consumirse más tarde en el callback final:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        User authUser = request.Context.RequestBag["AuthenticatedUser"];
        
        return new HttpResponse() {
            Content = new StringContent($"Hello, {authUser.Name}!")
        };
    }
}
```

También puedes usar los métodos auxiliares `Bag.Set()` y `Bag.Get()` para obtener o establecer objetos por sus tipos singleton.

<div class="script-header">
    <span>
        Middleware/Authenticate.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}
```

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse GetUser(HttpRequest request)
{
    var user = request.Bag.Get<User>();
    ...
}
```

## Obtener datos de formulario

Puedes obtener los valores de datos de formulario en una [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) con el ejemplo siguiente:

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/auth")]
public HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password))
    {
        ...
    }
}
```

## Obtener datos de formulario multipart

La solicitud HTTP de Sisk te permite obtener contenidos multipart cargados, como archivos, campos de formulario o cualquier contenido binario.

<div class="script-header">
    <span>
        Controller/Auth.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePost("/upload-contents")]
public HttpResponse Index(HttpRequest request)
{
    // el siguiente método lee toda la entrada de la solicitud en
    // un array de MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // El nombre del archivo proporcionado por los datos de formulario multipart.
        // Se devuelve null si el objeto no es un archivo.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // El nombre del campo del objeto de datos de formulario multipart.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // La longitud de contenido del formulario multipart.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Determina el formato de imagen basado en el encabezado del archivo para cada
        // tipo de contenido conocido. Si el contenido no es un formato de archivo común reconocido,
        // este método devolverá MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Puedes leer más sobre los [objetos de formulario multipart](/api/Sisk.Core.Entity.MultipartObject) de Sisk y sus métodos, propiedades y funcionalidades.

## Detectar desconexión del cliente

Desde la versión v1.15 de Sisk, el framework proporciona un CancellationToken que se lanza cuando la conexión entre el cliente y el servidor se cierra prematuramente antes de recibir la respuesta. Este token puede ser útil para detectar cuando el cliente ya no desea la respuesta y cancelar operaciones de larga duración.

```csharp
router.MapGet("/connect", async (HttpRequest req) =>
{
    // obtiene el token de desconexión de la solicitud
    var dc = req.DisconnectToken;

    await LongOperationAsync(dc);

    return new HttpResponse();
});
```

Este token no es compatible con todos los motores HTTP, y cada uno requiere una implementación.

## Soporte de eventos enviados por el servidor

Sisk soporta [Server-sent events](https://developer.mozilla.org/en-US/docs/es/Web/API/Server-sent_events), que permite enviar fragmentos como un flujo y mantener la conexión entre el servidor y el cliente viva.

Llamar al método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) pondrá la HttpRequest en su estado de escucha. Desde esto, el contexto de esta solicitud HTTP no esperará una HttpResponse ya que superpondrá los paquetes enviados por eventos del lado del servidor.

Después de enviar todos los paquetes, el callback debe devolver el método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará la respuesta final al servidor e indicará que el streaming ha terminado.

No es posible predecir cuál será la longitud total de todos los paquetes que se enviarán, por lo que no es posible determinar el final de la conexión con la cabecera `Content-Length`.

Por defecto en la mayoría de los navegadores, los eventos del lado del servidor no soportan enviar encabezados HTTP o métodos distintos al método GET. Por lo tanto, ten cuidado al usar manejadores de solicitud con solicitudes event-source que requieran encabezados específicos en la solicitud, ya que probablemente no los tendrán.

Además, la mayoría de los navegadores reinician los flujos si el método [EventSource.close](https://developer.mozilla.org/en-US/docs/es/Web/API/EventSource/close) no se llama en el lado del cliente después de recibir todos los paquetes, causando procesamiento adicional infinito en el lado del servidor. Para evitar este tipo de problema, es común enviar un paquete final indicando que la fuente de eventos ha terminado de enviar todos los paquetes.

El ejemplo siguiente muestra cómo el navegador puede comunicar al servidor que soporta eventos del lado del servidor.

<div class="script-header">
    <span>
        sse-example.html
    </span>
    <span>
        HTML
    </span>
</div>

```html
<html>
    <body>
        <b>Fruits:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('http://localhost:5555/event-source');
        const eventList = document.querySelector('ul');
        
        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `message: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomato") {
                evtSource.close();
            }
        }
    </script>
</html>
```

Y enviar progresivamente los mensajes al cliente:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class MyController
{
    [RouteGet("/event-source")]
    public async Task<HttpResponse> ServerEventsResponse(HttpRequest request)
    {
        var sse = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return serverEvents.Close();
    }
}
```

Al ejecutar este código, esperamos un resultado similar a este:

<img src="/assets/img/server side events demo.gif" />

## Resolver IPs y hosts proxied

Sisk puede usarse con proxies, y por lo tanto las direcciones IP pueden ser reemplazadas por el punto final del proxy en la transacción de un cliente al proxy.

Puedes definir tus propios resolutores en Sisk con [forwarding resolvers](/docs/es/advanced/forwarding-resolvers).

## Codificación de encabezados

La codificación de encabezados puede ser un problema para algunas implementaciones. En Windows, los encabezados UTF-8 no son compatibles, por lo que se usa ASCII. Sisk tiene un convertidor de codificación incorporado, que puede ser útil para decodificar encabezados codificados incorrectamente.

Esta operación es costosa y está deshabilitada por defecto, pero puede habilitarse bajo la bandera [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).