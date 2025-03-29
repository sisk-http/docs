# Enrutamiento

El [Router](/api/Sisk.Core.Routing.Router) es el primer paso en la construcción del servidor. Es responsable de contener objetos [Route](/api/Sisk.Core.Routing.Route), que son puntos de conexión que asignan URLs y sus métodos a acciones ejecutadas por el servidor. Cada acción es responsable de recibir una solicitud y entregar una respuesta al cliente.

Las rutas son pares de expresiones de ruta ("patrón de ruta") y el método HTTP que pueden escuchar. Cuando se realiza una solicitud al servidor, intentará encontrar una ruta que coincida con la solicitud recibida, luego llamará a la acción de esa ruta y entregará la respuesta resultante al cliente.

Hay varias formas de definir rutas en Sisk: pueden ser estáticas, dinámicas o auto-escaneadas, definidas por atributos o directamente en el objeto Router.

```cs
Router mainRouter = new Router();

// asigna la ruta GET / a la siguiente acción
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hola, mundo!");
});
```

Para entender qué es capaz de hacer una ruta, necesitamos entender qué es capaz de hacer una solicitud. Un [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contendrá todo lo que necesite. Sisk también incluye algunas características adicionales que aceleran el desarrollo en general.

Para cada acción recibida por el servidor, se llamará a un delegado de tipo [RouteAction](/api/Sisk.Core.Routing.RouteAction). Este delegado contiene un parámetro que contiene un [HttpRequest](/api/Sisk.Core.Http.HttpRequest) con toda la información necesaria sobre la solicitud recibida por el servidor. El objeto resultante de este delegado debe ser un [HttpResponse](/api/Sisk.Core.Http.HttpResponse) o un objeto que se asigna a él a través de [tipos de respuesta implícitos](/docs/es/fundamentals/responses#implicit-response-types).

## Coincidencia de rutas

Cuando se recibe una solicitud por el servidor HTTP, Sisk busca una ruta que satisfaga la expresión de la ruta recibida por la solicitud. La expresión siempre se prueba entre la ruta y la ruta de la solicitud, sin considerar la cadena de consulta.

Esta prueba no tiene prioridad y es exclusiva de una sola ruta. Cuando no se encuentra una ruta que coincida con la solicitud, se devuelve la respuesta [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) al cliente. Cuando se coincide con el patrón de ruta, pero el método HTTP no coincide, se envía la respuesta [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) al cliente.

Sisk verifica la posibilidad de colisiones de rutas para evitar estos problemas. Cuando se definen rutas, Sisk buscará rutas posibles que puedan colisionar con la ruta que se está definiendo. Esta prueba incluye la comprobación de la ruta y el método que la ruta está configurada para aceptar.

### Creación de rutas usando patrones de ruta

Puedes definir rutas usando varios métodos `SetRoute`.

```cs
// forma SetRoute
mainRouter.SetRoute(RouteMethod.Get, "/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hola, {name}");
});

// forma Map*
mainRouter.MapGet("/form", (request) =>
{
    var formData = request.GetFormData();
    return new HttpResponse(); // 200 ok vacío
});

// métodos de ayuda Route.*
mainRouter += Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // el StreamContent interno
        // se desecha después de enviar
        // la respuesta.
        Content = new StreamContent(imageStream)
    };
});

// varios parámetros
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hola, {name} {surname}!");
});
```

La propiedad [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) de HttpResponse contiene toda la información sobre las variables de ruta de la solicitud recibida.

Cada ruta recibida por el servidor se normaliza antes de que se ejecute la prueba del patrón de ruta, siguiendo estas reglas:

- Todos los segmentos vacíos se eliminan de la ruta, por ejemplo: `////foo//bar` se convierte en `/foo/bar`.
- La coincidencia de ruta es **sensible a mayúsculas y minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) esté establecido en `true`.

Las propiedades [Query](/api/Sisk.Core.Http.HttpRequest.Query) y [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) de [HttpRequest](/api/Sisk.Core.Http.HttpRequest) devuelven un objeto [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), donde cada propiedad indexada devuelve un [StringValue](/api/Sisk.Core.Entity.StringValue) no nulo, que se puede usar como una opción/monada para convertir su valor raw en un objeto administrado.

El ejemplo siguiente lee el parámetro de ruta "id" y obtiene un `Guid` de él. Si el parámetro no es un Guid válido, se lanza una excepción y se devuelve un error 500 al cliente si el servidor no está manejando [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTA]
> Las rutas ignoran el `/` final en ambas rutas de solicitud y ruta, es decir, si intentas acceder a una ruta definida como `/index/page` podrás acceder usando `/index/page/` también.
>
> También puedes forzar a las URLs a terminar con `/` habilitando la bandera [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Creación de rutas usando instancias de clase

También puedes definir rutas dinámicamente usando reflexión con el atributo [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). De esta manera, la instancia de una clase en la que sus métodos implementan este atributo tendrá sus rutas definidas en el router de destino.

Para que un método se defina como una ruta, debe estar marcado con un [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), como el atributo en sí o un [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). El método puede ser estático, de instancia, público o privado. Cuando se usa el método `SetObject(type)` o `SetObject<TType>()`, se ignoran los métodos de instancia.

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
    // coincide con GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Index!");
        return res;
    }
    
    // los métodos estáticos también funcionan
    [RouteGet("/hello")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hola mundo!");
        return res;
    }
}
```

La línea siguiente definirá tanto el método `Index` como el método `Hello` de `MyController` como rutas, ya que ambos están marcados como rutas y se ha proporcionado una instancia de la clase, no su tipo. Si se hubiera proporcionado su tipo en lugar de una instancia, solo se habrían definido los métodos estáticos.

```cs
var myController = new MyController();
mainRouter.SetObject(myController);
```

Desde la versión 0.16 de Sisk, es posible habilitar AutoScan, que buscará clases definidas por el usuario que implementen `RouterModule` y las asociará automáticamente con el router. Esto no es compatible con la compilación AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

La instrucción anterior buscará todos los tipos que implementan `ApiController`, pero no el tipo en sí. Los dos parámetros opcionales indican cómo se buscarán estos tipos. El primer argumento implica el ensamblado donde se buscarán los tipos y el segundo indica la forma en que se definirán los tipos.

## Rutas de regex

En lugar de usar los métodos de coincidencia de ruta HTTP predeterminados, puedes marcar una ruta para que se interprete con Regex.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "Mi ruta", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

O con la clase [RegexRoute](/api/Sisk.Core.Routing.RegexRoute):

```cs
mainRouter.SetRoute(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hola, mundo");
}));
```

También puedes capturar grupos de la expresión regular en el contenido de [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters):

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
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Accediendo al archivo {filename}");
    }
}
```

## Prefijo de rutas

Puedes prefijar todas las rutas en una clase o módulo con el atributo [RoutePrefix](/api/Sisk.Core.Routing.RoutePrefixAttribute) y establecer el prefijo como una cadena.

Vea el ejemplo siguiente usando la arquitectura BREAD (Buscar, Leer, Editar, Agregar y Eliminar):

<div class="script-header">
    <span>
        Controller/Api/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users/<id>
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users
    [RouteGet("/<id>")]
    public async Task<HttpResponse> Read()
    {
        ...
    }
    
    // PATCH /api/users/<id>
    [RoutePatch("/<id>")]
    public async Task<HttpResponse> Edit()
    {
        ...
    }
    
    // POST /api/users
    [RoutePost]
    public async Task<HttpResponse> Add()
    {
        ...
    }
    
    // DELETE /api/users/<id>
    [RouteDelete("/<id>")]
    public async Task<HttpResponse> Delete()
    {
        ...
    }
}
```

En el ejemplo anterior, el parámetro HttpResponse se omite a favor de ser utilizado a través del contexto global [HttpContext.Current](/api/Sisk.Core.Http.HttpContext.Current). Lea más en la sección que sigue.

## Rutas sin parámetro de solicitud

Las rutas se pueden definir sin el parámetro [HttpRequest](/api/Sisk.Core.Http.HttpRequest) y aún es posible obtener la solicitud y sus componentes en el contexto de la solicitud. Consideremos una abstracción `ControllerBase` que sirve como base para todos los controladores de una API y que proporciona la propiedad `Request` para obtener la [HttpRequest](/api/Sisk.Core.Http.HttpRequest) actualmente.

<div class="script-header">
    <span>
        Controller/ControllerBase.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public abstract class ControllerBase
{
    // obtiene la solicitud del subproceso actual
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // la línea siguiente, cuando se llama, obtiene la base de datos del subproceso HTTP actual,
    // o crea una nueva si no existe
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

Y para que todos sus descendientes puedan usar la sintaxis de ruta sin el parámetro de solicitud:

<div class="script-header">
    <span>
        Controller/UsersController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // lee los datos JSON de la solicitud actual
        UserCreationDto? user = JsonSerializer.DeserializeAsync<UserCreationDto>(Request.Body);
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Más detalles sobre el contexto actual y la inyección de dependencias se pueden encontrar en el tutorial de [inyección de dependencias](/docs/es/features/instancing).

## Rutas de cualquier método

Puedes definir una ruta para que coincida solo con su ruta y omitir el método HTTP. Esto puede ser útil para que valides el método dentro de la acción de la ruta.

```cs
// coincide con / en cualquier método HTTP
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Rutas de cualquier ruta

Las rutas de cualquier ruta prueban cualquier ruta recibida por el servidor HTTP, sujeta al método de ruta que se está probando. Si el método de ruta es RouteMethod.Any y la ruta usa [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) en su expresión de ruta, esta ruta escuchará todas las solicitudes del servidor HTTP, y no se pueden definir otras rutas.

```cs
// la siguiente ruta coincide con todas las solicitudes POST
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Coincidencia de ruta sin distinguir mayúsculas y minúsculas

Por defecto, la interpretación de rutas con solicitudes es sensible a mayúsculas y minúsculas. Para hacer que ignore mayúsculas y minúsculas, habilita esta opción:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Esto también habilitará la opción `RegexOptions.IgnoreCase` para rutas que usan coincidencia de regex.

## Controlador de errores de no encontrado (404)

Puedes crear un controlador de errores personalizado para cuando una solicitud no coincide con ninguna ruta conocida.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Desde la versión v0.14
        Content = new HtmlContent("<h1>No encontrado</h1>")
        // versiones anteriores
        Content = new StringContent("<h1>No encontrado</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Controlador de errores de método no permitido (405)

También puedes crear un controlador de errores personalizado para cuando una solicitud coincide con su ruta, pero no coincide con el método.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Método no permitido para esta ruta.")
    };
};
```

## Controlador de errores internos

Las acciones de ruta pueden lanzar errores durante la ejecución del servidor. Si no se manejan correctamente, el funcionamiento general del servidor HTTP puede interrumpirse. El router tiene un controlador de errores para cuando una acción de ruta falla y evita la interrupción del servicio.

Este método solo es accesible cuando [ThrowExceptions](/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions) está establecido en `false`.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```