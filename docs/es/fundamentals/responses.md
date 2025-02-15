# Respuestas

Las respuestas representan objetos que son respuestas HTTP a solicitudes HTTP. Se envían desde el servidor al cliente como indicación de la solicitud de un recurso, página, documento, archivo u otro objeto.

Una respuesta HTTP se compone de estado, encabezados y contenido.

En este documento, te enseñaremos cómo arquitectar respuestas HTTP con Sisk.

## Establecer un estado HTTP

La lista de estados HTTP es la misma desde HTTP/1.0, y Sisk admite todos ellos.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; // 202
```

O con sintaxis fluida:

```cs
new HttpResponse()
    .WithStatus(200) // o
    .WithStatus(HttpStatusCode.Ok) // o
    .WithStatus(HttpStatusInformation.Ok);
```

Puedes ver la lista completa de códigos de estado HTTP disponibles [aquí](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). También puedes proporcionar tu propio código de estado utilizando la estructura [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Cuerpo y tipo de contenido

Sisk admite objetos de contenido nativos de .NET para enviar el cuerpo en respuestas. Puedes utilizar la clase [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar una respuesta JSON, por ejemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

El servidor siempre intentará calcular la longitud del contenido (`Content-Length`) a partir de lo que hayas definido en el contenido, si no lo has definido explícitamente en un encabezado. Si el servidor no puede obtener implícitamente la longitud del contenido, la respuesta se enviará con codificación en bloques.

También puedes transmitir la respuesta enviando un [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) o utilizando el método `GetResponseStream`.

## Encabezados de respuesta

Puedes agregar, editar o eliminar encabezados que se envían en la respuesta. El ejemplo siguiente muestra cómo enviar una respuesta de redirección al cliente.

```cs
HttpResponse res = new HttpResponse();
res.Status = HttpStatusCode.Moved;
res.Headers.Add(HttpKnownHeaderNames.Location, "/login");
```

O con sintaxis fluida:

```cs
new HttpResponse(301)
    .WithHeader("Location", "/login");
```

Cuando utilizas el método [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) de HttpHeaderCollection, estás agregando un encabezado a la solicitud sin alterar los que ya se han enviado. El método [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) reemplaza los encabezados con el mismo nombre con el valor indicado. El indexador de HttpHeaderCollection llama internamente al método Set para reemplazar los encabezados.

## Enviar cookies

Sisk tiene métodos que facilitan la definición de cookies en el cliente. Las cookies establecidas por este método ya están codificadas en URL y cumplen con el estándar RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

O con sintaxis fluida:

```cs
new HttpResponse(301)
    .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Hay versiones más completas del mismo método [aquí](/api/Sisk.Core.Http.CookieHelper.SetCookie).

## Respuestas en bloques

Puedes establecer la codificación de transferencia en bloques para enviar respuestas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Al utilizar la codificación en bloques, el encabezado `Content-Length` se omite automáticamente.

## Flujo de respuesta

Los flujos de respuesta son una forma administrada de enviar respuestas de manera segmentada. Es una operación de nivel inferior que la utilización de objetos HttpResponse, ya que requiere que envíes los encabezados y el contenido manualmente y luego cierres la conexión.

Este ejemplo abre un flujo de lectura para el archivo, copia el flujo al flujo de salida de la respuesta y no carga el archivo completo en la memoria. Esto puede ser útil para servir archivos medianos o grandes.

```cs
// obtiene el flujo de salida de la respuesta
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// establece la codificación de la respuesta para utilizar la codificación en bloques
// también no debes enviar el encabezado de longitud del contenido cuando se utiliza
// la codificación en bloques
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia el flujo del archivo al flujo de salida de la respuesta
fileStream.CopyTo(responseStream.ResponseStream);

// cierra el flujo
return responseStream.Close();
```

## Compresión GZip, Deflate y Brotli

Puedes enviar respuestas con contenido comprimido en Sisk comprimiendo el contenido HTTP. Primero, encapsula tu objeto [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) dentro de uno de los compresores a continuación para enviar la respuesta comprimida al cliente.

```cs
router.MapGet("/hello.html", request => {
    string myHtml = "...";
    
    return new HttpResponse () {
        Content = new GZipContent(new HtmlContent(myHtml)),
        // o Content = new BrotliContent(new HtmlContent(myHtml)),
        // o Content = new DeflateContent(new HtmlContent(myHtml)),
    };
});
```

También puedes utilizar estos contenidos comprimidos con flujos.

```cs
router.MapGet("/archive.zip", request => {
    
    // no apliques "using" aquí. El HttpServer descartará tu contenido
    // después de enviar la respuesta.
    var archive = File.OpenRead("/path/to/big-file.zip");
    
    return new HttpResponse () {
        Content = new GZipContent(archive)
    }
});
```

Los encabezados `Content-Encoding` se establecen automáticamente al utilizar estos contenidos.

## Tipos de respuesta implícitos

Desde la versión 0.15, puedes utilizar otros tipos de retorno además de HttpResponse, pero es necesario configurar el enrutador para que sepa cómo manejar cada tipo de objeto.

El concepto es siempre devolver un tipo de referencia y convertirlo en un objeto HttpResponse válido. Las rutas que devuelven HttpResponse no se someten a ninguna conversión.

Los tipos de valor (estructuras) no se pueden utilizar como tipo de retorno porque no son compatibles con el [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), por lo que deben envolverse en un ValueResult para poder utilizarse en los controladores.

Considera el siguiente ejemplo de un módulo de enrutador que no utiliza HttpResponse en el tipo de retorno:

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
        User fromBody = JsonSerializer.Deserialize<User>(request.Body)!;
        Users.Add(fromBody);
        
        return true;
    }
}
```

Con eso, ahora es necesario definir en el enrutador cómo manejar cada tipo de objeto. Los objetos siempre son el primer argumento del controlador y el tipo de salida debe ser un objeto HttpResponse válido. También, los objetos de salida de una ruta nunca deben ser nulos.

Para los tipos ValueResult no es necesario indicar que el objeto de entrada es un ValueResult y solo T, ya que ValueResult es un objeto reflejado a partir de su componente original.

La asociación de tipos no compara lo que se registró con el tipo del objeto devuelto desde el callback del enrutador. En su lugar, verifica si el tipo del resultado del enrutador es asignable al tipo registrado.

Registrar un controlador de tipo Object hará que se ignoren todos los demás controladores de tipo específico. El orden de inserción de los controladores de valor también es importante, por lo que registrar un controlador de objeto debe ser el último controlador de valor que se utilizará como respaldo.

```cs
Router r = new Router();
r.SetObject(new UsersController());

r.RegisterValueHandler<bool>(bolVal =>
{
    HttpResponse res = new HttpResponse();
    res.Status = (bool)bolVal ? HttpStatusCode.OK : HttpStatusCode.BadRequest;
    return res;
});

r.RegisterValueHandler<IEnumerable>(enumerableValue =>
{
    return new HttpResponse();
    // haz algo con enumerableValue aquí
});

// registrar un controlador de valor de objeto debe ser el último
// controlador de valor que se utilizará como respaldo
r.RegisterValueHandler<object>(fallback =>
{
    HttpResponse res = new HttpResponse();
    res.Status = HttpStatusCode.OK;
    res.Content = JsonContent.Create(fallback);
    return res;
});
```