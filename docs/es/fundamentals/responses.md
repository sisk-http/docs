# Respuestas

Las respuestas representan objetos que son respuestas HTTP a solicitudes HTTP. Son enviadas por el servidor al cliente como una indicación de la solicitud de un recurso, página, documento, archivo u otro objeto.

Una respuesta HTTP se compone de estado, encabezados y contenido.

En este documento, te enseñaremos a arquitecturar respuestas HTTP con Sisk.

## Establecer un estado HTTP

La lista de estados HTTP es la misma desde HTTP/1.0, y Sisk los admite todos.

```cs
HttpResponse res = new HttpResponse();
res.Status = System.Net.HttpStatusCode.Accepted; //202
```

O con sintaxis fluida:

```cs
new HttpResponse()
 .WithStatus(200) // o
 .WithStatus(HttpStatusCode.Ok) // o
 .WithStatus(HttpStatusInformation.Ok);
```

Puedes ver la lista completa de HttpStatusCode disponibles [aquí](https://learn.microsoft.com/pt-br/dotnet/api/system.net.httpstatuscode). También puedes proporcionar tu propio código de estado utilizando la estructura [HttpStatusInformation](/api/Sisk.Core.Http.HttpStatusInformation).

## Cuerpo y tipo de contenido

Sisk admite objetos de contenido .NET nativos para enviar el cuerpo en las respuestas. Puedes utilizar la clase [StringContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.stringcontent) para enviar una respuesta JSON, por ejemplo:

```cs
HttpResponse res = new HttpResponse();
res.Content = new StringContent(myJson, Encoding.UTF8, "application/json");
```

El servidor siempre intentará calcular el `Content-Length` a partir de lo que has definido en el contenido si no lo has definido explícitamente en un encabezado. Si el servidor no puede obtener implícitamente el encabezado Content-Length del contenido de la respuesta, la respuesta se enviará con Chunked-Encoding.

También puedes transmitir la respuesta enviando un [StreamContent](https://learn.microsoft.com/pt-br/dotnet/api/system.net.http.streamcontent) o utilizando el método [GetResponseStream](/api/Sisk.Core.Http.HttpRequest.GetResponseStream).

## Encabezados de respuesta

Puedes agregar, editar o eliminar encabezados que estás enviando en la respuesta. El ejemplo siguiente muestra cómo enviar una respuesta de redirección al cliente.

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

Cuando utilices el método [Add](/api/Sisk.Core.Entity.HttpHeaderCollection.Add) de HttpHeaderCollection, estás agregando un encabezado a la solicitud sin alterar los que ya se han enviado. El método [Set](/api/Sisk.Core.Entity.HttpHeaderCollection.Set) reemplaza los encabezados con el mismo nombre con el valor indicado. El indexador de HttpHeaderCollection llama internamente al método Set para reemplazar los encabezados.

## Enviar cookies

Sisk tiene métodos que facilitan la definición de cookies en el cliente. Las cookies establecidas por este método ya están codificadas en URL y se ajustan al estándar RFC-6265.

```cs
HttpResponse res = new HttpResponse();
res.SetCookie("cookie-name", "cookie-value");
```

O con sintaxis fluida:

```cs
new HttpResponse(301)
 .WithCookie("cookie-name", "cookie-value", expiresAt: DateTime.Now.Add(TimeSpan.FromDays(7)));
```

Hay otras [versiones más completas](/api/Sisk.Core.Http.CookieHelper.SetCookie) del mismo método.

## Respuestas fragmentadas

Puedes establecer la codificación de transferencia en fragmentada para enviar respuestas grandes.

```cs
HttpResponse res = new HttpResponse();
res.SendChunked = true;
```

Cuando utilices codificación fragmentada, el encabezado Content-Length se omite automáticamente.

## Flujo de respuesta

Los flujos de respuesta son una forma administrada que te permiten enviar respuestas de manera segmentada. Es una operación de nivel inferior que utilizar objetos HttpResponse, ya que requieren que envíes los encabezados y el contenido manualmente, y luego cierres la conexión.

Este ejemplo abre un flujo de lectura solo para el archivo, copia el flujo en el flujo de salida de la respuesta y no carga todo el archivo en la memoria. Esto puede ser útil para servir archivos medianos o grandes.

```cs
// obtiene el flujo de salida de la respuesta
using var fileStream = File.OpenRead("my-big-file.zip");
var responseStream = request.GetResponseStream();

// establece la codificación de la respuesta para utilizar codificación fragmentada
// también no deberías enviar el encabezado content-length cuando utilices
// codificación fragmentada
responseStream.SendChunked = true;
responseStream.SetStatus(200);
responseStream.SetHeader(HttpKnownHeaderNames.ContentType, contentType);

// copia el flujo del archivo en el flujo de salida de la respuesta
fileStream.CopyTo(responseStream.ResponseStream);

// cierra el flujo
return responseStream.Close();
```

## Compresión GZip, Deflate y Brotli

Puedes enviar respuestas con contenido comprimido en Sisk con contenidos HTTP comprimidos. Primero, encapsula tu objeto [HttpContent](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpcontent) dentro de uno de los compresores siguientes para enviar la respuesta comprimida al cliente.

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
    
 // no apliques "using" aquí. el HttpServer descartará tu contenido
 // después de enviar la respuesta.
 var archive = File.OpenRead("/path/to/big-file.zip");
    
 return new HttpResponse () {
 Content = new GZipContent(archive)
 }
});
```

Los encabezados Content-Encoding se establecen automáticamente cuando se utilizan estos contenidos.

## Compresión automática

Es posible comprimir automáticamente las respuestas HTTP con la propiedad [EnableAutomaticResponseCompression](/api/Sisk.Core.Http.HttpServerConfiguration.EnableAutomaticResponseCompression). Esta propiedad encapsula automáticamente el contenido de la respuesta del enrutador en un contenido compressible que es aceptado por la solicitud, siempre y cuando la respuesta no sea heredada de un [CompressedContent](/api/Sisk.Core.Http.CompressedContent).

Solo se elige un contenido compressible para una solicitud, elegido según el encabezado Accept-Encoding, que sigue el orden:

- [BrotliContent](/api/Sisk.Core.Http.BrotliContent) (br)
- [GZipContent](/api/Sisk.Core.Http.GZipContent) (gzip)
- [DeflateContent](/api/Sisk.Core.Http.DeflateContent) (deflate)

Si la solicitud especifica que acepta cualquiera de estos métodos de compresión, la respuesta se comprimirá automáticamente.

## Tipos de respuesta implícitos

Puedes utilizar otros tipos de retorno además de HttpResponse, pero es necesario configurar el enrutador para que sepa cómo manejará cada tipo de objeto.

El concepto es siempre devolver un tipo de referencia y convertirlo en un objeto HttpResponse válido. Las rutas que devuelven HttpResponse no se someten a conversión.

Los tipos de valor (estructuras) no se pueden utilizar como tipo de retorno porque no son compatibles con el [RouterCallback](/api/Sisk.Core.Routing.RouterCallback), por lo que deben estar envueltos en un ValueResult para poder ser utilizados en controladores.

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

Con esto, ahora es necesario definir en el enrutador cómo manejará cada tipo de objeto. Los objetos siempre son el primer argumento del controlador y el tipo de salida debe ser un HttpResponse válido. Además, los objetos de salida de una ruta nunca deben ser nulos.

Para tipos ValueResult no es necesario indicar que el objeto de entrada es un ValueResult y solo T, ya que ValueResult es un objeto reflejado de su componente original.

La asociación de tipos no compara lo que se registró con el tipo del objeto devuelto del controlador de enrutador. En su lugar, verifica si el tipo del resultado del enrutador es asignable al tipo registrado.

Registrar un controlador de tipo Object actuará como una reserva para todos los tipos no validados previamente. El orden de inserción de los controladores de valor también importa, por lo que registrar un controlador de Object ignorará todos los controladores específicos de tipo. Siempre registre controladores de valor específicos primero para asegurarse del orden.

```cs
Router r = new Router();
r.SetObject(new UsersController());

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

// registrar un controlador de valor de objeto debe ser el último
// controlador de valor que se utilizará como una reserva
r.RegisterValueHandler<object>(fallback =>
{
 return new HttpResponse() {
 Status = HttpStatusCode.OK,
 Content = JsonContent.Create(fallback)
 };
});
```

## Nota sobre objetos enumerables y matrices

Los objetos de respuesta implícitos que implementan [IEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.ienumerable?view=net-8.0) se leen en la memoria a través del método `ToArray()` antes de ser convertidos a través de un controlador de valor definido. Para que esto ocurra, el objeto `IEnumerable` se convierte en una matriz de objetos, y el convertidor de respuesta siempre recibirá un `Object[]` en lugar del tipo original.

Considera el siguiente escenario:

```csharp
using var host = HttpServer.CreateBuilder(12300)
 .UseRouter(r =>
 {
 r.RegisterValueHandler<IEnumerable<string>>(stringEnumerable =>
 {
 return new HttpResponse("Matriz de cadenas:\n" + string.Join("\n", stringEnumerable));
 });
 r.RegisterValueHandler<IEnumerable<object>>(stringEnumerable =>
 {
 return new HttpResponse("Matriz de objetos:\n" + string.Join("\n", stringEnumerable));
 });
 r.MapGet("/", request =>
 {
 return (IEnumerable<string>)["hola", "mundo"];
 });
 })
 .Build();
```

En el ejemplo anterior, el convertidor `IEnumerable<string>` **nunca se llamará**, porque el objeto de entrada siempre será un `Object[]` y no es convertible a un `IEnumerable<string>`. Sin embargo, el convertidor siguiente que recibe un `IEnumerable<object>` recibirá su entrada, ya que su valor es compatible.

Si necesitas manejar realmente el tipo de objeto que se enumerará, necesitarás utilizar reflexión para obtener el tipo del elemento de la colección. Todos los objetos enumerables (listas, matrices y colecciones) se convierten en una matriz de objetos por el convertidor de respuesta HTTP.

Los valores que implementan [IAsyncEnumerable](https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.iasyncenumerable-1?view=net-8.0) se manejan automáticamente por el servidor si la propiedad [ConvertIAsyncEnumerableIntoEnumerable](/api/Sisk.Core.Http.HttpServerConfiguration.ConvertIAsyncEnumerableIntoEnumerable) está habilitada, de manera similar a lo que sucede con `IEnumerable`. Una enumeración asincrónica se convierte en un enumerador bloqueante y luego se convierte en una matriz de objetos sincrónica.