# Solicitudes

Las solicitudes son estructuras que representan un mensaje de solicitud HTTP. El objeto [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contiene funciones útiles para manejar mensajes HTTP en toda su aplicación.

Una solicitud HTTP se forma por el método, ruta, versión, encabezados y cuerpo.

En este documento, le enseñaremos cómo obtener cada uno de estos elementos.

## Obtener el método de la solicitud

Para obtener el método de la solicitud recibida, puede utilizar la propiedad Method:

```cs
static HttpResponse Index(HttpRequest request)
{
    HttpMethod requestMethod = request.Method;
    ...
}
```

Esta propiedad devuelve el método de la solicitud representado por un objeto [HttpMethod](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.httpmethod).

> [!NOTE]
> A diferencia de los métodos de ruta, esta propiedad no sirve para el elemento [RouteMethod.Any](/api/Sisk.Core.Routing.RouteMethod). En su lugar, devuelve el método de solicitud real.

## Obtener componentes de la URL de la solicitud

Puede obtener varios componentes de una URL a través de ciertas propiedades de una solicitud. Para este ejemplo, consideremos la URL:

``` 
http://localhost:5000/user/login?email=foo@bar.com
```

| Nombre del componente | Descripción | Valor del componente |
| --- | --- | --- |
| [Path](/api/Sisk.Core.Http.HttpRequest.Path) | Obtiene la ruta de la solicitud. | `/user/login` |
| [FullPath](/api/Sisk.Core.Http.HttpRequest.FullPath) | Obtiene la ruta y la cadena de consulta de la solicitud. | `/user/login?email=foo@bar.com` |
| [FullUrl](/api/Sisk.Core.Http.HttpRequest.FullUrl) | Obtiene la cadena de solicitud de URL completa. | `http://localhost:5000/user/login?email=foo@bar.com` |
| [Host](/api/Sisk.Core.Http.HttpRequest.Host) | Obtiene el host de la solicitud. | `localhost` |
| [Authority](/api/Sisk.Core.Http.HttpRequest.Authority) | Obtiene el host y el puerto de la solicitud. | `localhost:5000` |
| [QueryString](/api/Sisk.Core.Http.HttpRequest.QueryString) | Obtiene la consulta de la solicitud. | `?email=foo@bar.com` |
| [Query](/api/Sisk.Core.Http.HttpRequest.Query) | Obtiene la consulta de la solicitud en una colección de valores con nombre. | `{StringValueCollection object}` |
| [IsSecure](/api/Sisk.Core.Http.HttpRequest.IsSecure) | Determina si la solicitud utiliza SSL (true) o no (false). | `false` |

También puede optar por utilizar la propiedad [HttpRequest.Uri](/api/Sisk.Core.Http.HttpRequest.Uri), que incluye todo lo anterior en un solo objeto.

## Obtener el cuerpo de la solicitud

Algunas solicitudes incluyen un cuerpo, como formularios, archivos o transacciones de API. Puede obtener el cuerpo de una solicitud desde la propiedad:

```cs
// obtiene el cuerpo de la solicitud como una cadena, utilizando la codificación de la solicitud como codificador
string body = request.Body;

// o lo obtiene en un arreglo de bytes
byte[] bodyBytes = request.RawBody;

// o también puede transmitirlo.
Stream requestStream = request.GetRequestStream();
```

También es posible determinar si hay un cuerpo en la solicitud y si está cargado con las propiedades [HasContents](/api/Sisk.Core.Http.HttpRequest.HasContents), que determina si la solicitud tiene contenido y [IsContentAvailable](/api/Sisk.Core.Http.HttpRequest.IsContentAvailable) que indica que el servidor HTTP recibió completamente el contenido del punto remoto.

No es posible leer el contenido de la solicitud a través de `GetRequestStream` más de una vez. Si lee con este método, los valores en `RawBody` y `Body` no estarán disponibles. No es necesario desechar el flujo de solicitud en el contexto de la solicitud, ya que se desecha al final de la sesión HTTP en la que se crea. También puede utilizar la propiedad [HttpRequest.RequestEncoding](/api/Sisk.Core.Http.HttpRequest.RequestEncoding) para obtener la mejor codificación para decodificar la solicitud manualmente.

El servidor tiene límites para leer el contenido de la solicitud, que se aplica tanto a [HttpRequest.Body](/api/Sisk.Core.Http.HttpRequest.Body) como a [HttpRequest.RawBody](/api/Sisk.Core.Http.HttpRequest.Body). Estas propiedades copian el flujo de entrada completo en un búfer local del mismo tamaño que [HttpRequest.ContentLength](/api/Sisk.Core.Http.HttpRequest.ContentLength).

Una respuesta con estado 413 Contenido demasiado grande se devuelve al cliente si el contenido enviado es mayor que [HttpServerConfiguration.MaximumContentLength](/api/Sisk.Core.Http.HttpServerConfiguration.MaximumContentLength) definido en la configuración del usuario. Además, si no hay un límite configurado o si es demasiado grande, el servidor lanzará una [OutOfMemoryException](https://learn.microsoft.com/en-us/dotnet/api/system.outofmemoryexception?view=net-8.0) cuando el contenido enviado por el cliente exceda [Int32.MaxValue](https://learn.microsoft.com/en-us/dotnet/api/system.int32.maxvalue) (2 GB) y si el contenido se intenta acceder a través de una de las propiedades mencionadas anteriormente. Todavía puede tratar con el contenido a través de transmisión.

> [!NOTE]
> Aunque Sisk lo permite, siempre es una buena idea seguir la semántica HTTP para crear su aplicación y no obtener o servir contenido en métodos que no lo permiten. Lea sobre [RFC 9110 "Semántica HTTP"](https://httpwg.org/spec/rfc9110.html).

## Obtener el contexto de la solicitud

El contexto HTTP es un objeto exclusivo de Sisk que almacena información del servidor HTTP, ruta, enrutador y controlador de solicitud. Puede utilizarlo para organizarse en un entorno donde estos objetos son difíciles de organizar.

El objeto [RequestBag](/api/Sisk.Core.Http.HttpContext.RequestBag) contiene información almacenada que se pasa de un controlador de solicitud a otro punto y se puede consumir en el destino final. Este objeto también se puede utilizar por controladores de solicitud que se ejecutan después de la devolución de llamada de la ruta.

> [!TIP]
> Esta propiedad también es accesible a través de la propiedad [HttpRequest.Bag](/api/Sisk.Core.Http.HttpRequest.Bag).

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public string Identifier { get; init; } = Guid.NewGuid().ToString();
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers["Authorization"] != null)
        {
            context.RequestBag.Add("AuthenticatedUser", "Bob");
            return null;
        }
        else
        {
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

El controlador de solicitud anterior definirá `AuthenticatedUser` en la bolsa de solicitud y se puede consumir más adelante en la devolución de llamada final:

```cs
public class MyController
{
    [Route(RouteMethod.Get, "/")]
    [RequestHandler(typeof(AuthenticateUserRequestHandler))]
    static HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        string authUser = request.Context.RequestBag["AuthenticatedUser"];
        res.Content = new StringContent($"Hello, {authUser}!");
        return res;
    }
}
```

También puede utilizar los métodos auxiliares `Bag.Set()` y `Bag.Get()` para obtener o establecer objetos por sus singleton de tipo.

```cs
public class Authenticate : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        request.Bag.Set<User>(authUser);
    }
}

[RouteGet("/")]
[RequestHandler<Authenticate>]
public static HttpResponse Test(HttpRequest request)
{
    var user = request.Bag.Get<User>();
}
```

## Obtener datos de formulario

Puede obtener los valores de los datos de formulario en una [NameValueCollection](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.specialized.namevaluecollection) con el ejemplo siguiente:

```cs
static HttpResponse Index(HttpRequest request)
{
    var form = request.GetFormContent();

    string? username = form["username"];
    string? password = form["password"];

    if (AttempLogin(username, password) == true)
    {
        ...
    }
}
```

## Obtener datos de formulario multipart

La solicitud HTTP de Sisk le permite obtener contenidos multipart, como archivos, campos de formulario o cualquier contenido binario.

```cs
static HttpResponse Index(HttpRequest request)
{
    // el siguiente método lee la entrada de solicitud completa en un
    // arreglo de objetos Multipart
    var multipartFormDataObjects = request.GetMultipartFormContent();

    foreach (MultipartObject uploadedObject in multipartFormDataObjects)
    {
        // El nombre del archivo proporcionado por los datos de formulario multipart.
        // Se devuelve null si el objeto no es un archivo.
        Console.WriteLine("Nombre del archivo       : " + uploadedObject.Filename);

        // El nombre del campo de los datos de formulario multipart.
        Console.WriteLine("Nombre del campo      : " + uploadedObject.Name);

        // La longitud del contenido de los datos de formulario multipart.
        Console.WriteLine("Longitud del contenido  : " + uploadedObject.ContentLength);

        // Determina el formato de imagen en función del encabezado del archivo para cada
        // tipo de contenido conocido. Si el contenido no es un formato de archivo común reconocido,
        // el método siguiente devolverá MultipartObjectCommonFormat.Unknown
        Console.WriteLine("Formato común   : " + uploadedObject.GetCommonFileFormat());
    }
}
```

Puede leer más sobre los objetos de formulario multipart de Sisk y sus métodos, propiedades y funcionalidades.

## Soporte para eventos enviados por el servidor

Sisk admite [eventos enviados por el servidor](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), que permite enviar fragmentos como un flujo y mantener la conexión entre el servidor y el cliente viva.

Llamando al método [HttpRequest.GetEventSource](/api/Sisk.Core.Http.HttpRequest.GetEventSource) se pondrá la solicitud HTTP en su estado de escucha. A partir de esto, el contexto de esta solicitud HTTP no esperará una respuesta HTTP, ya que se superpondrá a los paquetes enviados por eventos del servidor.

Después de enviar todos los paquetes, la devolución de llamada debe devolver el método [Close](/api/Sisk.Core.Http.HttpRequestEventSource.Close), que enviará la respuesta final al servidor y indicará que la transmisión ha terminado.

No es posible predecir qué será la longitud total de todos los paquetes que se enviarán, por lo que no es posible determinar el final de la conexión con el encabezado `Content-Length`.

Por defecto, la mayoría de los navegadores no admiten el envío de encabezados HTTP o métodos diferentes al GET. Por lo tanto, tenga cuidado al utilizar controladores de solicitud con solicitudes de evento de origen que requieren encabezados específicos en la solicitud, ya que es probable que no los tengan.

Además, la mayoría de los navegadores reinician las transmisiones si el método [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close) no se llama en el lado del cliente después de recibir todos los paquetes, lo que causa un procesamiento adicional infinito en el lado del servidor. Para evitar este tipo de problema, es común enviar un paquete final que indique que el evento de origen ha terminado de enviar todos los paquetes.

El ejemplo siguiente muestra cómo el navegador puede comunicarse con el servidor que admite eventos enviados por el servidor.

```html
<html>
    <body>
        <b>Frutas:</b>
        <ul></ul>
    </body>
    <script>
        const evtSource = new EventSource('/event-source');
        const eventList = document.querySelector('ul');

        evtSource.onmessage = (e) => {
            const newElement = document.createElement("li");

            newElement.textContent = `mensaje: ${e.data}`;
            eventList.appendChild(newElement);

            if (e.data == "Tomate") {
                evtSource.close();
            }
        }
    </script>
</html>
```

Y envíe progresivamente los mensajes al cliente:

```cs
public class MyController
{
    [Route(RouteMethod.Get, "/event-source")]
    static HttpResponse ServerEventsResponse(HttpRequest request)
    {
        var serverEvents = request.GetEventSource();

        string[] frutas = new[] { "Manzana", "Plátano", "Sandía", "Tomate" };

        foreach (string fruta in frutas)
        {
            serverEvents.Send(fruta);
            Thread.Sleep(1500);
        }

        return serverEvents.Close();
    }
}
```

Al ejecutar este código, esperamos un resultado similar a este:

<img src="/assets/img/server side events demo.gif" />

## Resolución de IPs y hosts proxy

Sisk se puede utilizar con proxies, y por lo tanto, las direcciones IP pueden reemplazarse por el punto final del proxy en la transacción desde un cliente hasta el proxy.

Puede definir sus propios resolutores en Sisk con [resolutores de reenvío](/docs/advanced/forwarding-resolvers).

## Codificación de encabezados

La codificación de encabezados puede ser un problema para algunas implementaciones. En Windows, los encabezados UTF-8 no son compatibles, por lo que se utiliza ASCII. Sisk tiene un convertidor de codificación incorporado, que puede ser útil para decodificar encabezados codificados incorrectamente.

Esta operación es costosa y está deshabilitada de forma predeterminada, pero se puede habilitar bajo la bandera [NormalizeHeadersEncodings](/specification/spec/Sisk.Core.Http.HttpServerFlags.NormalizeHeadersEncodings).