# Controladores de servidor HTTP

En la versión 0.16 de Sisk, se ha introducido la clase `HttpServerHandler`, que tiene como objetivo ampliar el comportamiento general de Sisk y proporcionar controladores de eventos adicionales a Sisk, como el manejo de solicitudes HTTP, enrutadores, bolsas de contexto y más.

La clase concentra los eventos que ocurren durante la vida útil de todo el servidor HTTP y también de una solicitud. El protocolo HTTP no tiene sesiones, y por lo tanto no es posible conservar información de una solicitud a otra. Sisk proporciona por ahora una forma de implementar sesiones, contextos, conexiones de base de datos y otros proveedores útiles para ayudar en su trabajo.

Consulte [esta página](/api/Sisk.Core.Http.Handlers.HttpServerHandler) para leer dónde se desencadena cada evento y cuál es su propósito. También puede ver el [ciclo de vida de una solicitud HTTP](/v1/advanced/request-lifecycle) para entender qué sucede con una solicitud y dónde se disparan los eventos. El servidor HTTP permite utilizar varios controladores al mismo tiempo. Cada llamada a un evento es síncrona, es decir, bloqueará el subproceso actual para cada solicitud o contexto hasta que todos los controladores asociados con esa función se ejecuten y completen.

A diferencia de los controladores de solicitudes, no se pueden aplicar a grupos de rutas o rutas específicas. En su lugar, se aplican a todo el servidor HTTP. Puede aplicar condiciones dentro de su controlador de servidor HTTP. Además, se definen singletones de cada `HttpServerHandler` para cada aplicación Sisk, por lo que solo se define una instancia por `HttpServerHandler`.

Un ejemplo práctico de uso de `HttpServerHandler` es para desechar automáticamente una conexión de base de datos al final de la solicitud.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    public override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // comprueba si la solicitud ha definido un DbContext
        // en su bolsa de contexto
        if (requestBag.IsSet<DbContext>())
        {
            var db = requestBag.Get<DbContext>();
            db.Dispose();
        }
    }
}

public static class DatabaseConnectionHandlerExtensions
{
    // permite al usuario crear un contexto de base de datos a partir de una solicitud HTTP
    // y almacenarlo en su bolsa de contexto
    public static DbContext GetDbContext(this HttpRequest request)
    {
        var db = new DbContext();
        return request.SetContextBag<DbContext>(db);
    }
}
```

Con el código anterior, la extensión `GetDbContext` permite crear un contexto de conexión directamente desde el objeto `HttpRequest`. Una conexión no desechar puede causar problemas al ejecutar con la base de datos, por lo que se termina en `OnHttpRequestClose`.

Puede registrar un controlador en un servidor HTTP en su constructor o directamente con [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.SetObject(new UserController());
        app.Start();
    }
}
```

Con esto, la clase `UsersController` puede utilizar el contexto de base de datos como:

```cs
// UserController.cs

[RoutePrefix("/users")]
public class UserController : ApiController
{
    [RouteGet()]
    public async Task<HttpResponse> List(HttpRequest request)
    {
        var db = request.GetDbContext();
        var users = db.Users.ToArray();

        return JsonOk(users);
    }

    [RouteGet("<id>")]
    public async Task<HttpResponse> View(HttpRequest request)
    {
        var db = request.GetDbContext();

        var userId = request.GetQueryValue<int>("id");
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = JsonSerializer.Deserialize<User>(request.Body);

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("Usuario agregado.");
    }
}
```

El código anterior utiliza métodos como `JsonOk` y `JsonMessage` que están integrados en `ApiController`, que hereda de `RouterController`:

```cs
// ApiController.cs

public class ApiController : RouterModule
{
    public HttpResponse JsonOk(object value)
    {
        return new HttpResponse(200)
            .WithContent(JsonContent.Create(value, null, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            }));
    }

    public HttpResponse JsonMessage(string message, int statusCode = 200)
    {
        return new HttpResponse(statusCode)
            .WithContent(JsonContent.Create(new
            {
                Message = message
            }));
    }
}
```

Los desarrolladores pueden implementar sesiones, contextos y conexiones de base de datos utilizando esta clase. El código proporcionado muestra un ejemplo práctico con el `DatabaseConnectionHandler`, automatizando el descarte de la conexión de base de datos al final de cada solicitud.

La integración es sencilla, con controladores registrados durante la configuración del servidor. La clase `HttpServerHandler` ofrece un conjunto de herramientas poderosas para administrar recursos y ampliar el comportamiento de Sisk en aplicaciones HTTP.