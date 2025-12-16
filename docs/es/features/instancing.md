# Inyección de dependencias

Es común dedicar miembros y instancias que duran toda la vida de una solicitud, como una conexión a una base de datos, un usuario autenticado o un token de sesión. Una de las posibilidades es a través de [HttpContext.RequestBag](/api/Sisk.Core.Http.HttpContext), que crea un diccionario que dura toda la vida de una solicitud.

Este diccionario puede ser accedido por [manejadores de solicitudes](/docs/es/fundamentals/request-handlers) y definir variables a lo largo de esa solicitud. Por ejemplo, un manejador de solicitud que autentica a un usuario establece este usuario dentro del `HttpContext.RequestBag`, y dentro de la lógica de la solicitud, este usuario puede ser recuperado con `HttpContext.RequestBag.Get<User>()`.

Los objetos definidos en este diccionario están limitados al ciclo de vida de la solicitud. Se eliminan al final de la solicitud. No necesariamente, el envío de una respuesta define el final del ciclo de vida de la solicitud. Cuando se ejecutan [manejadores de solicitudes](/docs/es/fundamentals/request-handlers) que se ejecutan después de enviar una respuesta, los objetos `RequestBag` todavía existen y no han sido eliminados.

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
        return null; // avanzar al siguiente manejador de solicitud o lógica de solicitud
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
public HttpResponse SayHello(HttpRequest request)
{
    var authenticatedUser = request.Bag.Get<User>();
    return new HttpResponse()
    {
        Content = new StringContent($"Hola {authenticatedUser.Name}!")
    };
}
```

Este es un ejemplo preliminar de esta operación. La instancia de `User` se creó dentro del manejador de solicitud dedicado a la autenticación, y todas las rutas que utilizan este manejador de solicitud tendrán la garantía de que habrá un `User` en su instancia de `HttpContext.RequestBag`.

Es posible definir lógica para obtener instancias cuando no se han definido previamente en el `RequestBag` a través de métodos como [GetOrAdd](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAdd) o [GetOrAddAsync](/api/Sisk.Core.Entity.TypedValueDictionary.GetOrAddAsync).

Desde la versión 1.3, se introdujo la propiedad estática [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current), que permite acceder al `HttpContext` actualmente en ejecución del contexto de la solicitud. Esto permite exponer miembros del `HttpContext` fuera de la solicitud actual y definir instancias en objetos de ruta.

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
    // Obtener la instancia existente o crear una nueva instancia de base de datos para esta solicitud
    protected DbContext Database => HttpContext.Current.RequestBag.GetOrAdd(() => new DbContext());

    // La carga diferida de repositorios también es común
    protected IUserRepository Users => HttpContext.Current.RequestBag.GetOrAdd(() => new UserRepository(Database));
    protected IBlogRepository Blogs => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogRepository(Database));
    protected IBlogPostRepository BlogPosts => HttpContext.Current.RequestBag.GetOrAdd(() => new BlogPostRepository(Database));

    // La siguiente línea lanzará una excepción si la propiedad se accede cuando el Usuario no
    // está definido en la bolsa de solicitudes
    protected User AuthenticatedUser => => HttpContext.Current.RequestBag.Get<User>();

    // Exponer la instancia de HttpRequest también es compatible
    protected HttpRequest Request => HttpContext.Current.Request
}
```

Y definir tipos que hereden del controlador:

<div class="script-header">
    <span>
        Controllers/PostsController.cs
    </span>
    <span>
        C#
    </span>
</div>

```csharp
[RoutePrefix("/api/posts/{author}")]
sealed class PostsController : Controller
{
    protected Guid AuthorId => Request.RouteParameters["author"].GetInteger();

    [RouteGet]
    public IAsyncEnumerable<BlogPost> ListPosts()
    {
        return BlogPosts.GetPostsAsync(authorId: AuthorId);
    }

    [RouteGet("<id>")]
    public async Task<BlogPost?> GetPost()
    {
        int postId = Request.RouteParameters["id"].GetInteger();

        Post? post = await BlogPosts
            .FindPostAsync(post => post.Id == postId && post.AuthorId == AuthorId);

        return post;
    }
}
```

Para el ejemplo anterior, necesitarás configurar un [manejador de valor](/docs/es/fundamentals/responses.html#implicit-response-types) en tu enrutador para que los objetos devueltos por el enrutador se transformen en una respuesta [HttpResponse](/api/Sisk.Core.Http.HttpResponse) válida.

Tenga en cuenta que los métodos no tienen un argumento `HttpRequest request` como está presente en otros métodos. Esto se debe a que, desde la versión 1.3, el enrutador admite dos tipos de delegados para respuestas de enrutamiento: [RouteAction](/api/Sisk.Core.Routing.RouteAction), que es el delegado predeterminado que recibe un argumento `HttpRequest`, y [ParameterlessRouteAction](/api/Sisk.Core.Routing.ParameterlessRouteAction). El objeto `HttpRequest` todavía se puede acceder a través de la propiedad [Request](/api/Sisk.Core.Http.HttpContext.Request) de la propiedad estática `HttpContext` en el subproceso.

En el ejemplo anterior, definimos un objeto desechable, el `DbContext`, y necesitamos asegurarnos de que todas las instancias creadas en un `DbContext` se eliminen cuando la sesión HTTP finalice. Para esto, podemos utilizar dos formas de lograrlo. Una es crear un [manejador de solicitud](/docs/es/fundamentals/request-handlers) que se ejecute después de la acción del enrutador, y la otra forma es a través de un [manejador de servidor personalizado](/docs/es/advanced/http-server-handlers).

Para el primer método, podemos crear el manejador de solicitud directamente en el método [OnSetup](/api/Sisk.Core.Routing.RouterModule.OnSetup) heredado de `RouterModule`:

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
                // obtener una instancia de DbContext definida en el contexto del manejador de solicitud y
                // eliminarla
                ctx.RequestBag.GetOrDefault<DbContext>()?.Dispose();
                return null;
            },
            executionMode: RequestHandlerExecutionMode.AfterResponse));
    }
}
```

> [!TIP]
>
> Desde la versión 1.4 de Sisk, se introduce la propiedad [HttpServerConfiguration.DisposeDisposableContextValues](/api/Sisk.Core.Http.HttpServerConfiguration.DisposeDisposableContextValues) y se habilita de forma predeterminada, que define si el servidor HTTP debe eliminar todos los valores `IDisposable` en la bolsa de contexto cuando se cierra una sesión HTTP.

El método anterior garantizará que el `DbContext` se elimine cuando se finalice la sesión HTTP. Puedes hacer esto para más miembros que necesitan ser eliminados al final de una respuesta.

Para el segundo método, puedes crear un [manejador de servidor personalizado](/docs/es/advanced/http-server-handlers) que eliminará el `DbContext` cuando se finalice la sesión HTTP.

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

Y utilízalo en tu constructor de aplicaciones:

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

Esta es una forma de controlar la limpieza de código y mantener las dependencias de una solicitud separadas por el tipo de módulo que se utilizará, reduciendo la cantidad de código duplicado dentro de cada acción de un enrutador. Es una práctica similar a la que se utiliza la inyección de dependencias en frameworks como ASP.NET.