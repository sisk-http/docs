# Respuestas

Source: https://docs.sisk-framework.org/es/docs/fundamentals/responses.html

Las respuestas representan objetos que son respuestas HTTP a solicitudes HTTP. Son enviadas por el servidor al cliente como una indicación de la solicitud de un recurso, página, documento, archivo u otro objeto.

Una respuesta HTTP se compone de estado, encabezados y contenido.

En este documento, le enseñaremos cómo estructurar respuestas HTTP con Sisk.

## Configuración de un estado HTTP

La lista de estados HTTP es la misma desde HTTP/1.0, y Sisk soporta todos ellos.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

O con sintaxis Fluent:

```cs
new HttpResponse()
    .WithStatus(200) // or
    .WithStatus(HttpStatusCode.Ok) // or
    .WithStatus(HttpStatusInformation.Ok);
```

Puede ver la lista completa de HttpStatusCode disponibles [aquí](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). También puede proporcionar su propio código de estado usando la estructura [HttpStatusInformation](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpStatusInformation.md).

## Cuerpo y tipo de contenido

Sisk soporta objetos de contenido nativos de .NET para enviar el cuerpo en respuestas. Puede usar la clase [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar una respuesta JSON, por ejemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

El servidor siempre intentará calcular el `Content-Length` a partir de lo que haya definido en el contenido si no lo ha definido explícitamente en un encabezado. Si el servidor no puede obtener implícitamente el encabezado Content-Length del contenido de la respuesta, la respuesta se enviará con codificación Chunked.

También puede transmitir la respuesta enviando un [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) o usando el método [GetResponseStream](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.GetResponseStream.md).

## Encabezados de respuesta

Puede agregar, editar o eliminar encabezados que envía en la respuesta. El ejemplo a continuación muestra cómo enviar una respuesta de redirección al cliente.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

O con sintaxis Fluent:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Cuando usa el método [Add](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Add.md) de `HttpHeaderCollection`, está añadiendo un encabezado a la solicitud sin alterar los que ya fueron enviados. El método [Set](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.Set.md) reemplaza los encabezados con el mismo nombre por el valor indicado. El indexador de `HttpHeaderCollection` llama internamente al método `Set` para reemplazar los encabezados.

También puede obtener valores de encabezados usando el método [GetHeaderValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.HttpHeaderCollection.GetHeaderValue.md). Este método ayuda a obtener valores tanto de los encabezados de respuesta como de los encabezados de contenido (si se ha establecido contenido).

```cs
// Devuelve el valor del encabezado "Content-Type", verificando tanto response.Headers como response.Content.Headers
string? contentType = response.GetHeaderValue("Content-Type");
```

## Envío de cookies

Sisk tiene métodos que facilitan la definición de cookies en el cliente. Las cookies establecidas con este método ya están codificadas en URL y cumplen con el estándar RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

O con sintaxis Fluent:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Existen otras [versiones más completas](https://docs.sisk-framework.org/api/Sisk.Core.Helpers.CookieHelper.SetCookie.md) del mismo método.

## Respuestas fragmentadas

Puede establecer la codificación de transferencia a chunked para enviar respuestas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Al usar codificación chunked, el encabezado Content-Length se omite automáticamente.

## Flujo de respuesta

Los flujos de respuesta son una forma gestionada que le permite enviar respuestas de manera segmentada. Es una operación de nivel más bajo que usar objetos `HttpResponse`, ya que requiere que envíe los encabezados y el contenido manualmente, y luego cierre la conexión.

Este ejemplo abre un flujo de solo lectura para el archivo, copia el flujo al flujo de salida de la respuesta y no carga todo el archivo en memoria. Esto puede ser útil para servir archivos medianos o grandes.

```cs
// obtiene el flujo de salida de la respuesta
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// establece la codificación de la respuesta para usar chunked-encoding
// también no debe enviar el encabezado content-length al usar
// codificación chunked
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia el flujo del archivo al flujo de salida de la respuesta
fileStream.CopyTo(responseStream.ResponseStream);

// cierra el flujo
return responseStream.Close();
```

## Compresión GZip, Deflate y Brotli

Puede enviar respuestas con contenido comprimido en Sisk comprimiendo contenidos HTTP. Primero, encapsule su objeto [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) dentro de uno de los compresores a continuación para enviar la respuesta comprimida al cliente.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // or Content = new BrotliContent(new HtmlContent(myHtml)),
        // or Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

También puede usar estos contenidos comprimidos con flujos.

```cs
router.MapGet("/archive.zip", request => {
    
    // no aplique "using" aquí. el HttpServer descartará su contenido
    // después de enviar la respuesta.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Los encabezados `Content-Encoding` se establecen automáticamente al usar estos contenidos.

## Compresión automática

Es posible comprimir automáticamente las respuestas HTTP con la propiedad [EnableAutomaticResponseCompression](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression.md). Esta propiedad encapsula automáticamente el contenido de la respuesta del router en un contenido comprimible que es aceptado por la solicitud, siempre que la respuesta no herede de un [CompressedContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.CompressedContent.md).

Solo se elige un contenido comprimible por solicitud, seleccionado según el encabezado `Accept-Encoding`, que sigue el orden:

- [BrotliContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.BrotliContent.md) (br)
- [GZipContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.GZipContent.md) (gzip)
- [DeflateContent](https://docs.sisk-framework.org/api/Sisk.Core.Http.DeflateContent.md) (deflate)

Si la solicitud indica que acepta cualquiera de estos métodos de compresión, la respuesta se comprimirá automáticamente.

## Tipos de respuesta implícitos

Puede usar otros tipos de retorno además de `HttpResponse`, pero es necesario configurar el router para que sepa cómo manejar cada tipo de objeto.

El concepto es siempre devolver un tipo de referencia y convertirlo en un objeto `HttpResponse` válido. Las rutas que devuelven `HttpResponse` no sufren ninguna conversión.

Los tipos de valor (estructuras) no pueden usarse como tipo de retorno porque no son compatibles con el [RouterCallback](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouterCallback.md), por lo que deben envolver‑se en un `ValueResult` para poder ser usados en los manejadores.

Considere el siguiente ejemplo de un módulo de router que no usa `HttpResponse` en el tipo de retorno:

```cs
[RoutePrefix("/users")]
public class UsersController : RouterModule
{
    public List<User> Users = new List<User>();

    [RouteGet]
    public IEnumerable<User> Index(HttpRequest request)
    {
        return Users.ToArray();
    }

    [RouteGet("<id>")]
    public User View(HttpRequest request)
    {
        int id = request.RouteParameters["id"].GetInteger();
        User dUser = Users.First(u => u.Id == id);

        return dUser;
    }

    [RoutePost]
    public ValueResult<bool> Create(HttpRequest request)
    {
        User fromBody = request.GetJsonContent<User>()!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

Con eso, ahora es necesario definir en el router cómo se tratará cada tipo de objeto. Los objetos son siempre el primer argumento del manejador y el tipo de salida debe ser un `HttpResponse` válido. Además, los objetos de salida de una ruta nunca deben ser nulos.

Para los tipos `ValueResult` no es necesario indicar que el objeto de entrada es un `ValueResult` y solo `T`, ya que `ValueResult` es un objeto reflejado de su componente original.

La asociación de tipos no compara lo que se registró con el tipo del objeto devuelto por el callback del router. En su lugar, verifica si el tipo del resultado del router es asignable al tipo registrado.

Registrar un manejador del tipo `Object` actuará como fallback para todos los tipos previamente no validados. El orden de inserción de los manejadores de valor también importa, por lo que registrar un manejador `Object` ignorará todos los demás manejadores específicos de tipo. Siempre registre primero los manejadores de valor específicos para asegurar el orden.

```cs
Router r = new Router();
r.MapInstance(new UsersController());

r.RegisterValueHandler<ApiResult>(apiResult =>
{
    return new HttpResponse() {
        Status = apiResult.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest,
        Content = apiResult.GetHttpContent(),
        Headers = apiResult.GetHeaders()
    };
});
r.RegisterValueHandler<bool>(bvalue =>
{
    return new HttpResponse() {
        Status = bvalue ? HttpStatusCode.OK : HttpStatusCode.BadRequest
    };
});
r.RegisterValueHandler<IEnumerable<object>>(enumerableValue =>
{
    return new HttpResponse(string.Join("\n", enumerableValue));
});

// registrar un manejador de valor de tipo object debe ser el último
// manejador de valor que se usará como fallback
r.RegisterValueHandler<object>(fallback =>
{
    return new HttpResponse() {
        Status = HttpStatusCode.OK,
        Content = JsonContent.Create(fallback)
    };
});
```

## Acciones diferidas

Cuando una solicitud llega al router, primero pasa por los [request handlers](https://docs.sisk-framework.org/es/docs/fundamentals/request-handlers.md), se procesa en la acción del router y luego por los manejadores de solicitud post‑ejecución. El resultado de la acción del router es lo que se pasa a los manejadores de valor, y el resultado del manejador de valor es lo que se envía al cliente como respuesta.

Este ciclo de vida ocurre dentro de un contexto asíncrono. Este contexto asíncrono expone variables que el usuario puede agregar al [HttpContext Bag](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.md) para compartir datos entre los manejadores y la acción del router. El valor devuelto por la acción del router se agrega a este contexto asíncrono y puede ser accedido por los manejadores de valor.

Las acciones diferidas son acciones que siempre se ejecutarán al final del ciclo, después de entregar la respuesta al cliente, pero aún dentro del mismo contexto asíncrono. Estas acciones pueden usarse para ejecutar tareas de larga duración que no necesitan completarse para enviar una respuesta al cliente, como guardar logs, actualizar la base de datos, enviar correos electrónicos, etc.

Las excepciones siguen siendo capturadas en las acciones diferidas y se manejarán de la misma forma que una excepción lanzada en cualquier punto del ciclo de vida de la solicitud. La diferencia es que el cliente ya habrá recibido una respuesta, por lo que la excepción se maneja mediante el manejo de errores predeterminado.

Aplazar la ejecución de una acción usando el método [HttpContext.EnqueueDeferredAction](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.EnqueueDeferredAction.md). El método recibe una función asíncrona que representa la acción a ejecutar y un tiempo de espera opcional para limitar el tiempo de ejecución de la acción. Si la acción no se completa dentro del límite de tiempo, será cancelada.

```csharp
[RoutePost("/send-mail")]
public HttpResponse SendMail(HttpRequest request)
{
    string to = request.Query["to"].GetString();
    string subject = request.Query["subject"].GetString();
    string body = request.Query["body"].GetString();
    if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject) || string.IsNullOrWhiteSpace(body))
    {
        throw new ApiException("Missing required parameters.");
    }

    // programa una acción de larga duración que se ejecutará después de enviar la respuesta al cliente, pero aún dentro del mismo contexto asíncrono de la solicitud
    request.Context.EnqueueDeferredAction(async (ct) =>
    {
        await EmailService.SendEmailAsync(to, subject, body);
    }, timeout: TimeSpan.FromSeconds(30));

    return new HttpResponse()
    {
        Status = 200,
        Content = new StringContent("Sending the email...")
    };
}
```

## Nota sobre objetos enumerables y matrices

Los objetos de respuesta implícitos que implementan [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) se leen en memoria mediante el método `ToArray()` antes de ser convertidos a través de un manejador de valor definido. Para que esto ocurra, el objeto `IEnumerable` se convierte en una matriz de objetos, y el convertidor de respuesta siempre recibirá un `Object[]` en lugar del tipo original.

Considere el siguiente escenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
    .UseRouter(r =>
    {
        r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
        {
            return new HttpResponse("String array:\n" + string.Join("\n", stringEnumerable));
        });
        r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
        {
            return new HttpResponse("Object array:\n" + string.Join("\n", stringEnumerable));
        });
        r.MapGet("/", request =>
        {
            return (IEnumerable<string>)["hello", "world"];
        });
    })
    .Build();
```

En el ejemplo anterior, el convertidor `IEnumerable<string>` **nunca será llamado**, porque el objeto de entrada siempre será un `Object[]` y no es convertible a `IEnumerable<string>`. Sin embargo, el convertidor que recibe un `IEnumerable<object>` sí recibirá su entrada, ya que su valor es compatible.

Si necesita manejar realmente el tipo del objeto que será enumerado, deberá usar reflexión para obtener el tipo del elemento de la colección. Todos los objetos enumerables (listas, matrices y colecciones) son convertidos a una matriz de objetos por el convertidor de respuestas HTTP.

Los valores que implementan [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) son manejados automáticamente por el servidor si la propiedad [ConvertIAsyncEnumerableIntoEnumerable](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable.md) está habilitada, de forma similar a lo que ocurre con `IEnumerable`. Esta opción está habilitada por defecto en `HttpServerConfiguration`; una enumeración asíncrona se convierte en un enumerador bloqueante y luego en una matriz síncrona de objetos. Desactívela solo cuando proporcione su propio manejador de valor o una estrategia de respuesta en streaming para secuencias asíncronas.
