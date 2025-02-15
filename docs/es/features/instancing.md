# Inyección de dependencias

Es común dedicar miembros e instancias que duran toda la vida de una solicitud, como una conexión a una base de datos, un usuario autenticado o un token de sesión. Una de las posibilidades es a través de [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), que crea un diccionario que dura toda la vida de una solicitud.

Este diccionario se puede acceder desde [manejadores de solicitudes](/docs/fundamentals/request-handlers) y definir variables a lo largo de esa solicitud. Por ejemplo, un manejador de solicitudes que autentica a un usuario establece este usuario dentro de `HttpContext.RequestBag`, y dentro de la lógica de la solicitud, este usuario se puede recuperar con `HttpContext.RequestBag.Get<User>()`.

Aquí hay un ejemplo:

<div class="script-header">
    <span>
        RequestHandlers/AuthenticateUser.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class AuthenticateUser : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;
    
    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        User authenticatedUser = AuthenticateUser(request);
        context.RequestBag.Set(authenticatedUser);
        return null; // avanzar a la siguiente solicitud de manejo o lógica de solicitud
    }
}
```

<div class="script-header">
    <span>
        Controllers/HelloController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RouteGet("/hello")]
[RequestHandler<AuthenticateUser>]
public static HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hola {authenticatedUser.Name}!")
    };
}
```

Este es un ejemplo preliminar de esta operación. La instancia de `User` se creó dentro del manejador de solicitudes dedicado a la autenticación, y todas las rutas que utilizan este manejador de solicitudes tendrán la garantía de que habrá un `User` en su instancia de `HttpContext.RequestBag`.

Es posible definir lógica para obtener instancias cuando no se han definido previamente en `RequestBag` a través de métodos como [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) o [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Desde la versión 1.3, se introdujo la propiedad estática [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current), que permite acceder al `HttpContext` actualmente en ejecución del contexto de la solicitud. Esto permite exponer miembros del `HttpContext` fuera de la solicitud actual y definir instancias en objetos de rutas.

El ejemplo siguiente define un controlador que tiene miembros comúnmente accedidos por el contexto de una solicitud.

<div class="script-header">
    <span>
        Controllers/Controller.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    public DbContext Database
    {
        get
        {
            // crear un DbContext o obtener el existente
            return HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());
        }
    }

    // la siguiente línea lanzará una excepción si la propiedad se accede cuando el Usuario no
    // está definido en la bolsa de solicitudes
    public User AuthenticatedUser { get => HttpContext.Current.RequestBag.Get<User>(); }

    // También se admite la exposición de la instancia de HttpRequest
    public HttpRequest Request { get => HttpContext.Current.Request; }
}
```

Y define tipos que heredan del controlador:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts")]
public class PostsController : Controller
{
    [RouteGet]
    public IEnumerable<Blog> ListPosts()
    {
        return Database.Posts
            .Where(post => post.AuthorId == AuthenticatedUser.Id)
            .ToList();
    }

    [RouteGet("<id>")]
    public Post GetPost()
    {
        int blogId = Request.RouteParameters["id"].GetInteger();

        Post? post = Database.Posts
            .FirstOrDefault(post => post.Id == blogId && post.AuthorId == AuthenticatedUser.Id);

        return post ?? new HttpResponse(404);
    }
}
```

Para el ejemplo anterior, necesitarás configurar un [manejador de valores](/docs/fundamentals/responses.html#implicit-response-types) en tu enrutador para que los objetos devueltos por el enrutador se transformen en un [HttpResponse](/api/Sisk.Core.Http.HttpResponse) válido.

Tenga en cuenta que los métodos no tienen un argumento `HttpRequest request` como está presente en otros métodos. Esto se debe a que, desde la versión 1.3, el enrutador admite dos tipos de delegados para respuestas de enrutamiento: [RouteAction](/api/Sisk.Core.Routing.RouteAction), que es el delegado predeterminado que recibe un argumento `HttpRequest`, y [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). El objeto `HttpRequest` aún se puede acceder desde ambos delegados a través de la propiedad [Request](/api/Sisk.Core.Http.HttpContext.Request) del `HttpContext` estático en el subproceso.

En el ejemplo anterior, definimos un objeto desechable, el `DbContext`, y necesitamos asegurarnos de que todas las instancias creadas en un `DbContext` se desechen cuando la sesión HTTP finalice. Para ello, podemos utilizar dos formas de lograrlo. Una es crear un [manejador de solicitudes](/docs/fundamentals/request-handlers) que se ejecute después de la acción del enrutador, y la otra forma es a través de un [manejador de servidor personalizado](/docs/advanced/http-server-handlers).

Para el primer método, podemos crear el manejador de solicitudes directamente en el método [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) heredado de `RouterModule`:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public abstract class Controller : RouterModule
{
    ...

    protected override void OnSetup(Router parentRouter)
    {
        base.OnSetup(parentRouter);

        HasRequestHandler(RequestHandler.Create(
            execute: (req, ctx) =>
            {
                // obtener un DbContext definido en el contexto del manejador de solicitudes y
                // desecharlo
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Desde Sisk versión 1.4, la propiedad [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) se introdujo y se habilitó de forma predeterminada, lo que define si el servidor HTTP debe desechar todos los valores `IDisposable` en la bolsa de contexto cuando se cierra una sesión HTTP.

El método anterior garantizará que el `DbContext` se deseché cuando la sesión HTTP se finalice. Puedes hacer esto para más miembros que necesitan desecharse al final de una respuesta.

Para el segundo método, puedes crear un [manejador de servidor personalizado](/docs/advanced/http-server-handlers) que desechará el `DbContext` cuando la sesión HTTP se finalice.

<div class="script-header">
    <span>
        Server/Handlers/ObjectDisposerHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
public class ObjectDisposerHandler : HttpServerHandler
{
    protected override void OnHttpRequestClose(HttpServerExecutionResult result)
    {
        result.Context.RequestBag.GetOrDefault<DbContext>()?.Dispose();
    }
}
```

Y usarlo en tu constructor de aplicaciones:

<div class="script-header">
    <span>
        Program.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
using var host = HttpServer.CreateBuilder()
    .UseHandler<ObjectDisposerHandler>()
    .Build();
```

Esta es una forma de manejar la limpieza de código y mantener las dependencias de una solicitud separadas por el tipo de módulo que se utilizará, reduciendo la cantidad de código duplicado dentro de cada acción de un enrutador. Es una práctica similar a la que se utiliza la inyección de dependencias en frameworks como ASP.NET.