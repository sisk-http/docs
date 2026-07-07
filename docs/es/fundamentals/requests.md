# Solicitudes

Las solicitudes son estructuras que representan un mensaje de solicitud HTTP. El objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contiene funciones útiles para manejar mensajes HTTP a lo largo de tu aplicación.

Una solicitud HTTP se compone del método, la ruta, la versión, los encabezados y el cuerpo.

En este documento, te enseñaremos cómo obtener cada uno de estos elementos.

## Obtención del método de la solicitud

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

## Obtención de componentes de la URL de la solicitud

Puedes obtener varios componentes de una URL a través de ciertas propiedades de una solicitud. Para este ejemplo, consideremos la URL:

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
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtiene la cadena de consulta de la solicitud. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtiene la consulta de la solicitud en una colección de valores con nombre. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina si la solicitud está usando SSL (true) o no (false). | `false` |

También puedes optar por usar la propiedad [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que incluye todo lo anterior en un solo objeto.

## Metadatos de la solicitud y cancelación

Sisk también adjunta metadatos operacionales a cada solicitud. Estas propiedades son útiles para registros, rastreo, localización, diagnóstico y operaciones de larga duración:

| Propiedad o método | Uso |
| --- | --- |
| [RequestId](/api/Sisk.Core.Http.HttpRequest.RequestId) | Un identificador único para la solicitud. Habilita [IncludeRequestIdHeader](/api/Sisk.Core.Http.HttpServerConfiguration.IncludeRequestIdHeader) para devolverlo como `X-Request-Id`. |
| [RequestedAt](/api/Sisk.Core.Http.HttpRequest.RequestedAt) | El momento en que Sisk creó el objeto de solicitud. |
| [RemoteAddress](/api/Sisk.Core.Http.HttpRequest.RemoteAddress) | La dirección del cliente resuelta a partir de la conexión, o de tu [ForwardingResolver](/docs/es/advanced/forwarding-resolvers). |
| [Culture](/api/Sisk.Core.Http.HttpRequest.Culture) | La mejor cultura resuelta a partir de `Accept-Language`, retrocediendo a la cultura actual. |
| [DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken) | Un token de cancelación que se activa cuando el cliente se desconecta, cuando el motor HTTP configurado lo soporta. |
| [Bag](/api/Sisk.Core.Http.HttpRequest.Bag) | Un almacén tipado de clave/valor compartido entre manejadores de solicitud y la acción de ruta. |
| [GetRawHttpRequest](/api/Sisk.Core.Http.HttpRequest.GetRawHttpRequest) | Una representación textual de la solicitud para diagnóstico. |

## Obtención del cuerpo de la solicitud

Algunas solicitudes incluyen cuerpo, como formularios, archivos o transacciones API. Puedes obtener el cuerpo de una solicitud mediante la propiedad:

```cs
// obtiene el cuerpo de la solicitud como una cadena, usando la codificación de la solicitud como codificador
string body = request.Body;

// o lo obtiene en un arreglo de bytes
byte[] bodyBytes = request.RawBody;

// o bien, puedes transmitirlo.
Stream requestStream = request.GetRequestStream();

// o leer el cuerpo de forma asíncrona
Memory<byte> bodyMemory = await request.GetBodyContentsAsync();
```

También es posible determinar si hay un cuerpo en la solicitud y si está cargado con las propiedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina si la solicitud tiene contenidos, y [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable), que indica que el servidor HTTP recibió completamente el contenido desde el punto remoto.

No es posible leer el contenido de la solicitud mediante `GetRequestStream` más de una vez. Si lo lees con este método, los valores en `RawBody` y `Body` tampoco estarán disponibles. No es necesario disponer del flujo de la solicitud en el contexto de la solicitud, ya que se dispone al final de la sesión HTTP en la que se crea. Además, puedes usar la propiedad [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obtener la mejor codificación y decodificar la solicitud manualmente.

El servidor tiene límites para leer el contenido de la solicitud, lo que se aplica tanto a [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) como a [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Estas propiedades copian todo el flujo de entrada a un búfer local del mismo tamaño que [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Se devuelve al cliente una respuesta con estado 413 Content Too Large si el contenido enviado es mayor que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido en la configuración del usuario. Además, si no hay un límite configurado o si es demasiado grande, el servidor lanzará una [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) cuando el contenido enviado por el cliente supere [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) y si se intenta acceder al contenido a través de una de las propiedades mencionadas arriba. Aún puedes manejar el contenido mediante transmisión.

> [!NOTE]
> Aunque Sisk lo permite, siempre es buena idea seguir la Semántica HTTP para crear tu aplicación y no obtener o servir contenido en métodos que no lo permiten. Lee sobre [RFC 9110 "HTTP Semantics"](https://httpwg.org/spec/rfc9110.html).

## Lectura de solicitudes JSON

Para APIs JSON, prefiere los ayudantes JSON incorporados en lugar de leer `Body` y deserializar manualmente. Utilizan [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/api/system.text.json) y por defecto usan [HttpRequest.DefaultJsonSerializerOptions](/api/Sisk.Core.Http.HttpRequest.DefaultJsonSerializerOptions).

```cs
public record CreateUserRequest(string Name, string Email);

router.MapPost("/users", (HttpRequest request) =>
{
    CreateUserRequest? body = request.GetJsonContent<CreateUserRequest>();
    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Usa la sobrecarga asíncrona cuando ya estés en una ruta async o quieras que la cancelación de la solicitud detenga la deserialización:

```cs
router.MapPost("/users", async (HttpRequest request) =>
{
    CreateUserRequest? body =
        await request.GetJsonContentAsync<CreateUserRequest>(request.DisconnectToken);

    if (body is null)
        return new HttpResponse(System.Net.HttpStatusCode.BadRequest);

    return new HttpResponse(System.Net.HttpStatusCode.Created);
});
```

Puedes pasar opciones personalizadas de [JsonSerializerOptions](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsonserializeroptions) para un endpoint específico:

```cs
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
{
    PropertyNameCaseInsensitive = true
};

UserDto? user = request.GetJsonContent<UserDto>(options);
```

Para aplicaciones Native AOT o sensibles al recorte, usa la sobrecarga `JsonTypeInfo<T>` generada por un `JsonSerializerContext`:

```cs
[JsonSerializable(typeof(CreateUserRequest))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

CreateUserRequest? body =
    await request.GetJsonContentAsync(
        AppJsonSerializerContext.Default.CreateUserRequest,
        request.DisconnectToken);
```

La misma regla de lectura única se aplica a los ayudantes JSON: después de que Sisk lea el flujo de la solicitud mediante `GetJsonContent`, `GetJsonContentAsync`, `Body` o `RawBody`, no podrás consumir más tarde el mismo cuerpo mediante `GetRequestStream()`.

## Obtención del contexto de la solicitud

El HTTP Context es un objeto exclusivo de Sisk que almacena información del servidor HTTP, ruta, router y manejador de solicitud. Puedes usarlo para organizarte en un entorno donde estos objetos son difíciles de gestionar.

Puedes obtener el [HttpContext](/api/Sisk.Core.Http.HttpContext) que se está ejecutando actualmente usando el método estático `HttpContext.GetCurrentContext()`. Este método devuelve el contexto de la solicitud que se está procesando en el hilo actual.

```cs
HttpContext context = HttpContext.GetCurrentContext();
```

### Modo de registro

La propiedad [HttpContext.LogMode](/api/Sisk.Core.Http.HttpContext.LogMode) te permite controlar el comportamiento de registro para la solicitud actual. Puedes habilitar o deshabilitar el registro para solicitudes específicas, sobrescribiendo la configuración predeterminada del servidor.

```cs
// Deshabilitar el registro para esta solicitud
context.LogMode = LogOutputMode.None;
```

### Bolsa de solicitud

El objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contiene información almacenada que se pasa de un manejador de solicitud a otro punto, y puede ser consumida en el destino final. Este objeto también puede ser usado por manejadores de solicitud que se ejecutan después del callback de ruta.

> [!TIP]
> Esta propiedad también es accesible mediante la propiedad [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

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

El manejador de solicitud anterior definirá `AuthenticatedUser` en la bolsa de solicitud, y podrá ser consumido más adelante en el callback final:

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

La clase `TypedValueDictionary` también provee los métodos `GetValue` y `SetValue` para mayor control.

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

## Obtención de datos de formulario

Puedes obtener los valores de datos de formulario en una [StringKeyStoreCollection](/api/Sisk.Core.Entity.StringKeyStoreCollection) con el siguiente ejemplo:

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

La versión asíncrona es útil cuando el cuerpo de la solicitud puede ser grande o cuando deseas soporte de cancelación:

```cs
var form = await request.GetFormContentAsync(request.DisconnectToken);
```

## Obtención de datos de formulario multipart

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
    // el siguiente método lee toda la entrada de la solicitud en un
    // arreglo de MultipartObjects
    var multipartFormDataObjects = request.GetMultipartFormContent();
    
    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // El nombre del archivo provisto por los datos de formulario multipart.
        // Se devuelve null si el objeto no es un archivo.
        Console.WriteLine("File name       : " + uploadedObject.Filename);

        // El nombre del campo del objeto de datos de formulario multipart.
        Console.WriteLine("Field name      : " + uploadedObject.Name);

        // La longitud del contenido del dato multipart.
        Console.WriteLine("Content length  : " + uploadedObject.ContentLength);

        // Determina el formato de imagen basado en el encabezado del archivo para cada
        // tipo de contenido conocido. Si el contenido no es un formato de archivo común
        // reconocido, este método devolverá MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Common format   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Usa [GetMultipartFormContentAsync](/api/Sisk.Core.Http.HttpRequest.GetMultipartFormContentAsync) cuando la ruta es asíncrona:

```cs
var multipartFormDataObjects =
    await request.GetMultipartFormContentAsync(request.DisconnectToken);
```

Puedes leer más sobre los [objetos de formulario multipart](/api/Sisk.Core.Entity.MultipartObject) de Sisk y sus métodos, propiedades y funcionalidades.

## Detección de desconexión del cliente

Desde la versión v1.15 de Sisk, el framework provee un token de cancelación a través de [HttpRequest.DisconnectToken](/api/Sisk.Core.Http.HttpRequest.DisconnectToken). Cuando el motor HTTP configurado soporta la detección de desconexión, este token se cancela cuando la conexión del cliente se cierra antes de que la respuesta se complete. Esto es útil para detener operaciones de larga duración cuando el cliente ya no está esperando el resultado.

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

El motor predeterminado de Sisk, basado en `System.Net.HttpListener`, no soporta la detección de desconexión del cliente. Cuando tu aplicación usa el motor predeterminado, `DisconnectToken` es `CancellationToken.None`; en la práctica, es un token que no se cancela y debe considerarse no disponible.

El [motor Cadente](/docs/es/cadente) soporta `DisconnectToken`. Si tu ruta depende de la cancelación consciente de desconexiones, usa Cadente u otro motor que implemente explícitamente este comportamiento. Incluso con un motor soportado, la cancelación es cooperativa: pasa el token a APIs async y revísalo en tu propio trabajo de larga duración.

## Soporte de eventos enviados por el servidor

Sisk soporta [Server-sent events](https://developer.mozilla.org/en-US/docs/es/Web/API/Server-sent_events), que permite enviar fragmentos como un flujo y mantener viva la conexión entre el servidor y el cliente.

Llamar al método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) pondrá el HttpRequest en su estado de escucha. A partir de esto, el contexto de esta solicitud HTTP no esperará un HttpResponse ya que se superpondrán los paquetes enviados por eventos del lado del servidor.

Después de enviar todos los paquetes, el callback debe devolver el método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará la respuesta final al cliente e indicará que la transmisión ha terminado.

No es posible predecir la longitud total de todos los paquetes que se enviarán, por lo que no es posible determinar el fin de la conexión con el encabezado `Content-Length`.

Según la mayoría de los navegadores, los eventos del lado del servidor no soportan el envío de encabezados HTTP ni métodos distintos al GET. Por lo tanto, ten cuidado al usar manejadores de solicitud con peticiones de tipo event‑source que requieran encabezados específicos, ya que probablemente no los tendrán.

Además, la mayoría de los navegadores reinician los flujos si no se llama al método [EventSource.close](https://developer.mozilla.org/en-US/docs/es/Web/API/EventSource/close) del lado del cliente después de recibir todos los paquetes, lo que provoca procesamiento adicional infinito en el servidor. Para evitar este tipo de problema, es común enviar un paquete final indicando que la fuente de eventos ha terminado de enviar todos los paquetes.

El ejemplo a continuación muestra cómo el navegador puede comunicarse con el servidor que soporta eventos del lado del servidor.

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
        var serverEvents = await request.GetEventSourceAsync ();
        
        string[] fruits = new[] { "Apple", "Banana", "Watermelon", "Tomato" };
        
        foreach (string fruit in fruits)
        {
            await serverEvents.SendAsync(fruit);
            await Task.Delay(1500);
        }

        return await serverEvents.CloseAsync();
    }
}
```

Al ejecutar este código, esperamos un resultado similar a este:

<img src="/assets/img/server side events demo.gif" />

## Resolución de IPs y hosts proxied

Sisk puede usarse con proxies, y por ello las direcciones IP pueden ser reemplazadas por el punto final del proxy en la transacción de un cliente al proxy.

Puedes definir tus propios resolutores en Sisk con los [forwarding resolvers](/docs/es/advanced/forwarding-resolvers).

## Codificación de encabezados

La codificación de encabezados puede ser un problema para algunas implementaciones. En Windows, los encabezados UTF‑8 no están soportados, por lo que se usa ASCII. Sisk tiene un convertidor de codificación incorporado, que puede ser útil para decodificar encabezados codificados incorrectamente.

Esta operación es costosa y está deshabilitada por defecto, pero puede habilitarse con [HttpServerConfiguration.NormalizeHeadersEncodings](/api/Sisk.Core.Http.HttpServerConfiguration.NormalizeHeadersEncodings).