---
title: "Manejadores del servidor Http"
linkTitle: "Manejadores del servidor HTTP"
weight: 40
aliases:
  - "/docs/es/advanced/http-server-handlers.html"
sourceHash: "5276d37696621afa"
---

En la versión 0.16 de Sisk, hemos introducido la clase `HttpServerHandler`, que tiene como objetivo ampliar el comportamiento general de Sisk y proporcionar manejadores de eventos adicionales a Sisk, como el manejo de solicitudes Http, routers, bolsas de contexto y más.

Esta clase concentra los eventos que ocurren durante la vida útil de todo el servidor HTTP y también de una solicitud. El protocolo Http no tiene sesiones, por lo que no es posible conservar información de una solicitud a otra. Por ahora, Sisk ofrece una forma de que implementes sesiones, contextos, conexiones a bases de datos y otros proveedores útiles para ayudar en tu trabajo.

Por favor, consulta [esta página](/api/Sisk.Core.Http.Handlers.HttpServerHandler) para leer dónde se dispara cada evento y cuál es su propósito. También puedes ver el [ciclo de vida de una solicitud HTTP](/docs/advanced/request-lifecycle) para entender qué ocurre con una solicitud y dónde se disparan los eventos. El servidor HTTP permite usar varios manejadores al mismo tiempo. Cada llamada a un evento es síncrona, es decir, bloqueará el hilo actual para cada solicitud o contexto hasta que todos los manejadores asociados a esa función se ejecuten y completen.

A diferencia de los RequestHandlers, no pueden aplicarse a algunos grupos de rutas o rutas específicas. En su lugar, se aplican a todo el servidor HTTP. Puedes aplicar condiciones dentro de tu Http Server Handler. Además, los singletons de cada HttpServerHandler se definen para cada aplicación Sisk, de modo que solo existe una instancia por `HttpServerHandler`.

Un ejemplo práctico de uso de HttpServerHandler es disponer automáticamente una conexión a la base de datos al final de la solicitud.

```cs
// DatabaseConnectionHandler.cs

public class DatabaseConnectionHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        var requestBag = result.Request.Context.RequestBag;

        // verifica si la solicitud ha definido un DbContext
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
    public static DbContext GetDbContext(this HttpRequest request)
    {
        return request.Bag.GetOrAdd(() => new DbContext());
    }
}
```

Con el código anterior, la extensión `GetDbContext` permite crear un contexto de conexión directamente desde el objeto HttpRequest. Una conexión no liberada puede causar problemas al trabajar con la base de datos, por lo que se termina en `OnHttpRequestClose`.

Puedes registrar un manejador en un servidor Http en tu constructor o directamente con [HttpServer.RegisterHandler](/api/Sisk.Core.Http.HttpServer.RegisterHandler).

```cs
// Program.cs

class Program
{
    static void Main(string[] args)
    {
        using var app = HttpServer.CreateBuilder()
            .UseHandler<DatabaseConnectionHandler>()
            .Build();

        app.Router.MapInstance(new UserController());
        app.Start();
    }
}
```

Con esto, la clase `UsersController` puede utilizar el contexto de base de datos de la siguiente manera:

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

        int userId = request.RouteParameters["id"].GetInteger();
        var user = db.Users.FirstOrDefault(u => u.Id == userId);

        return JsonOk(user);
    }

    [RoutePost]
    public async Task<HttpResponse> Create(HttpRequest request)
    {
        var db = request.GetDbContext();
        var user = await request.GetJsonContentAsync<User>();

        ArgumentNullException.ThrowIfNull(user);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return JsonMessage("User added.");
    }
}
```

El código anterior utiliza métodos como `JsonOk` y `JsonMessage` que están incorporados en `ApiController`, el cual hereda de un `RouterController`:

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

Los desarrolladores pueden implementar sesiones, contextos y conexiones a bases de datos usando esta clase. El código proporcionado muestra un ejemplo práctico con el DatabaseConnectionHandler, automatizando la liberación de la conexión a la base de datos al final de cada solicitud.

La integración es sencilla, con los manejadores registrados durante la configuración del servidor. La clase HttpServerHandler ofrece un conjunto de herramientas potente para gestionar recursos y ampliar el comportamiento de Sisk en aplicaciones HTTP.
