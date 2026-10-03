# Enrutamiento

Source: https://docs.sisk-framework.org/es/docs/fundamentals/routing.html

El [Router](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.md) es el primer paso al construir el servidor. Es responsable de albergar objetos [Route](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.md), que son puntos finales que asignan URLs y sus métodos a acciones ejecutadas por el servidor. Cada acción se encarga de recibir una solicitud y entregar una respuesta al cliente.

Las rutas son pares de expresiones de ruta ("patrón de ruta") y el método HTTP al que pueden escuchar. Cuando se realiza una solicitud al servidor, éste intentará encontrar una ruta que coincida con la solicitud recibida, luego llamará a la acción de esa ruta y entregará la respuesta resultante al cliente.

Hay múltiples formas de definir rutas en Sisk: pueden ser estáticas, dinámicas o auto‑escaneadas, definidas por atributos, o directamente en el objeto Router.

```cs
Router mainRouter = new Router();

// asigna la ruta GET / a la siguiente acción
mainRouter.MapGet("/", request => {
    return new HttpResponse("Hello, world!");
});
```

Para entender lo que una ruta es capaz de hacer, necesitamos entender lo que una solicitud es capaz de hacer. Un [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) contendrá todo lo que necesitas. Sisk también incluye algunas características extra que aceleran el desarrollo en general.

Para cada acción recibida por el servidor, se llamará a un delegado del tipo [RouteAction](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAction.md). Este delegado contiene un parámetro que lleva un [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) con toda la información necesaria sobre la solicitud recibida por el servidor. El objeto resultante de este delegado debe ser un [HttpResponse](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpResponse.md) o un objeto que se mapee a él mediante [implicit response types](https://docs.sisk-framework.org/es/docs/fundamentals/responses.md#implicit-response-types).

## Coincidencia de rutas

Cuando una solicitud es recibida por el servidor HTTP, Sisk busca una ruta que satisfaga la expresión del camino recibido por la solicitud. La expresión siempre se prueba entre la ruta y el camino de la solicitud, sin considerar la cadena de consulta.

Esta prueba no tiene prioridad y es exclusiva a una única ruta. Cuando no se encuentra ninguna ruta que coincida con esa solicitud, se devuelve la respuesta de [Router.NotFoundErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.NotFoundErrorHandler.md) al cliente. Cuando el patrón de ruta coincide, pero el método HTTP no, se envía la respuesta de [Router.MethodNotAllowedErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler.md) al cliente.

Sisk verifica la posibilidad de colisiones de rutas para evitar estos problemas. Al definir rutas, Sisk buscará posibles rutas que puedan colisionar con la ruta que se está definiendo. Esta prueba incluye comprobar el camino y el método que la ruta está configurada para aceptar.

### Creación de rutas usando patrones de ruta

Para nuevas aplicaciones, prefiere los métodos `Map*`. Mantienen el método HTTP visible en el sitio de llamada y coinciden con la API actual de `Router`. Los métodos más antiguos `SetRoute` siguen existiendo como envoltorios de compatibilidad, pero los nuevos ejemplos deberían usar `Map`, `MapGet`, `MapPost`, `MapPut`, `MapDelete`, `MapPatch`, `MapAny`, `MapOptions` o `MapHead`.

```cs
// Los métodos Map* son la forma habitual de definir rutas específicas por método.
mainRouter.MapGet("/hey/<name>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    return new HttpResponse($"Hello, {name}");
});

mainRouter.MapPost("/form", (request) =>
{
    var formData = request.GetFormContent();
    return new HttpResponse(); // 200 ok vacío
});

// Map también puede recibir una instancia de Route cuando necesitas opciones de ruta.
mainRouter.Map(Route.Get("/image.png", (request) =>
{
    var imageStream = File.OpenRead("image.png");
    
    return new HttpResponse()
    {
        // el interior de StreamContent
        // el stream se libera después de enviar
        // la respuesta.
        Content = new StreamContent(imageStream)
    };
}));

// múltiples parámetros
mainRouter.MapGet("/hey/<name>/surname/<surname>", (request) =>
{
    string name = request.RouteParameters["name"].GetString();
    string surname = request.RouteParameters["surname"].GetString();

    return new HttpResponse($"Hello, {name} {surname}!");
});
```

La propiedad [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) de HttpRequest contiene toda la información sobre las variables de ruta de la solicitud recibida.

Cada camino recibido por el servidor se normaliza antes de ejecutar la prueba del patrón de ruta, siguiendo estas reglas:

- Todos los segmentos vacíos se eliminan del camino, por ejemplo: `////foo//bar` se convierte en `/foo/bar`.
- La coincidencia de caminos es **sensible a mayúsculas y minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase.md) esté configurado en `true`.

Las propiedades [Query](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.Query.md) y [RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md) de [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) devuelven un objeto [StringValueCollection](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValueCollection.md), donde cada propiedad indexada devuelve un [StringValue](https://docs.sisk-framework.org/api/Sisk.Core.Entity.StringValue.md) no nulo, que puede usarse como una opción/monada para convertir su valor bruto en un objeto gestionado.

El ejemplo a continuación lee el parámetro de ruta "id" y obtiene un `Guid` a partir de él. Si el parámetro no es un Guid válido, se lanza una excepción, y se devuelve un error 500 al cliente si el servidor no está manejando [Router.CallbackErrorHandler](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Router.CallbackErrorHandler.md).

```cs
mainRouter.MapGet("/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
    return new HttpResponse($"User id: {id}");
});
```

> [!NOTE]
> Los caminos tienen su `/` final ignorado tanto en la solicitud como en la ruta, es decir, si intentas acceder a una ruta definida como `/index/page` también podrás acceder usando `/index/page/`.
>
> También puedes forzar que las URLs terminen con `/` habilitando [HttpServerConfiguration.ForceTrailingSlash](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ForceTrailingSlash.md).

### Creación de rutas usando instancias de clase

También puedes definir rutas dinámicamente usando reflexión con el atributo [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md). De esta forma, la instancia de una clase cuyas métodos implementan este atributo tendrá sus rutas definidas en el router de destino.

Para que un método sea definido como ruta, debe estar marcado con un [RouteAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteAttribute.md), como el propio atributo o un [RouteGetAttribute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RouteGetAttribute.md). El método puede ser estático, de instancia, público o privado. Usa `MapInstance` cuando quieras mapear métodos de ruta de instancia y estáticos de un objeto. Usa `MapType` cuando quieras mapear solo métodos de ruta estáticos de un tipo.

```cs {title="Controller/MyController.cs"}
public class MyController
{
    // coincidirá con GET /
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
        res.Content = new StringContent("Hello world!");
        return res;
    }
}
```

La línea siguiente definirá tanto los métodos `Index` como `Hello` de `MyController` como rutas, ya que ambos están marcados como rutas, y se ha proporcionado una instancia de la clase, no su tipo. Si se hubiera proporcionado su tipo en lugar de una instancia, solo se definirían los métodos estáticos.

```cs
var myController = new MyController();
mainRouter.MapInstance(myController);
```

Para mapear solo métodos de ruta estáticos de un tipo, usa:

```cs
mainRouter.MapType<MyController>();
```

Desde la versión 0.16 de Sisk, es posible habilitar AutoScan, que buscará clases definidas por el usuario que implementen `RouterModule` y las asociará automáticamente con el router. Esto no es compatible con compilación AOT.

```cs
mainRouter.AutoScanModules<ApiController>();
```

La instrucción anterior buscará todos los tipos que implementen `ApiController` pero **no el propio tipo**. Los dos parámetros opcionales indican cómo el método buscará esos tipos. El primer argumento implica el Assembly donde se buscarán los tipos y el segundo indica la forma en que los tipos serán definidos.

## Rutas Regex

En lugar de usar los métodos predeterminados de coincidencia de caminos HTTP, puedes marcar una ruta para que sea interpretada con Regex.

```cs
Route indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", IndexPage);
mainRouter.Map(indexRoute);
```

O con la clase [RegexRoute](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RegexRoute.md):

```cs
mainRouter.Map(new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hello, world");
}));
```

También puedes capturar grupos del patrón regex en el contenido de [HttpRequest.RouteParameters](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.RouteParameters.md):

```cs {title="Controller/MyController.cs"}
public class MyController
{
    [RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
    static HttpResponse RegexRoute(HttpRequest request)
    {
        string filename = request.RouteParameters["filename"].GetString();
        return new HttpResponse().WithContent($"Acessing file {filename}");
    }
}
```

## Prefijado de rutas

Puedes prefijar todas las rutas en una clase o módulo con el atributo [RoutePrefix](https://docs.sisk-framework.org/api/Sisk.Core.Routing.RoutePrefixAttribute.md) y establecer el prefijo como una cadena.

Mira el ejemplo siguiente usando la arquitectura BREAD (Browse, Read, Edit, Add and Delete):

```cs {title="Controller/Api/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController
{
    // GET /api/users
    [RouteGet]
    public async Task<HttpResponse> Browse()
    {
        ...
    }
    
    // GET /api/users/<id>
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

En el ejemplo anterior, el parámetro HttpResponse se omite a favor de ser usado a través del contexto global [HttpContext.Current](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpContext.Current.md). Lee más en la sección que sigue.

## Rutas sin parámetro de solicitud

Las rutas pueden definirse sin el parámetro [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) y aún así ser posibles de obtener la solicitud y sus componentes en el contexto de la solicitud. Consideremos una abstracción `ControllerBase` que sirve como base para todos los controladores de una API, y esa abstracción provee la propiedad `Request` para obtener el [HttpRequest](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpRequest.md) actual.

```cs {title="Controller/ControllerBase.cs"}
public abstract class ControllerBase
{
    // obtiene la solicitud del hilo actual
    public HttpRequest Request { get => HttpContext.Current.Request; }
    
    // la línea siguiente, al llamarse, obtiene la base de datos de la sesión HTTP actual,
    // o crea una nueva si no existe
    public DbContext Database { get => HttpContext.Current.RequestBag.GetOrAdd<DbContext>(); }
}
```

Y para que todos sus descendientes puedan usar la sintaxis de ruta sin el parámetro de solicitud:

```cs {title="Controller/UsersController.cs"}
[RoutePrefix("/api/users")]
public class UsersController : ControllerBase
{    
    [RoutePost]
    public async Task<HttpResponse> Create()
    {
        // reads the JSON data from the current request
        UserCreationDto? user = await Request.GetJsonContentAsync<UserCreationDto>();
        ...
        Database.Users.Add(user);
        
        return new HttpResponse(201);
    }
}
```

Más detalles sobre el contexto actual y la inyección de dependencias pueden encontrarse en el tutorial de [dependency injection](https://docs.sisk-framework.org/es/docs/features/instancing.md).

## Rutas de cualquier método

Puedes definir una ruta que se empareje solo por su camino y omita el método HTTP. Esto puede ser útil para que realices la validación del método dentro del callback de la ruta.

```cs
// will match / on any HTTP method
mainRouter.MapAny("/", callbackFunction);
```

## Rutas de cualquier camino

Las rutas de cualquier camino prueban cualquier camino recibido por el servidor HTTP, sujeto al método de la ruta que se está probando. Si el método de la ruta es RouteMethod.Any y la ruta usa [Route.AnyPath](https://docs.sisk-framework.org/api/Sisk.Core.Routing.Route.AnyPath.md) en su expresión de camino, esta ruta escuchará todas las solicitudes del servidor HTTP, y no se podrán definir otras rutas.

```cs
// the following route will match all POST requests
mainRouter.Map(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Ignorar coincidencia de rutas con mayúsculas/minúsculas

Por defecto, la interpretación de rutas con solicitudes es sensible a mayúsculas y minúsculas. Para hacer que ignore mayúsculas/minúsculas, habilita esta opción:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Esto también habilitará la opción `RegexOptions.IgnoreCase` para rutas donde se use coincidencia regex.

## Manejador de callback Not Found (404)

Puedes crear un callback personalizado para cuando una solicitud no coincida con ninguna ruta conocida.

```cs
mainRouter.NotFoundErrorHandler = () =>
{
    return new HttpResponse(404)
    {
        // Desde v0.14
        Content = new HtmlContent("<h1>Not found</h1>")
        // versiones anteriores
        Content = new StringContent("<h1>Not found</h1>", Encoding.UTF8, "text/html")
    };
};
```

## Manejador de callback Method not allowed (405)

También puedes crear un callback personalizado para cuando una solicitud coincida con su camino, pero no coincida con el método.

```cs
mainRouter.MethodNotAllowedErrorHandler = (context) =>
{
    return new HttpResponse(405)
    {
        Content = new StringContent($"Method not allowed for this route.")
    };
};
```

## Manejo de errores

Las excepciones pueden lanzarse dentro del ciclo de vida de una solicitud, que abarca desde el manejador de solicitud previo a la ejecución, pasando por la acción del router, hasta los manejadores de solicitud posteriores a la ejecución y los manejadores de valor. Estas excepciones son gestionadas por el mecanismo:

- Si [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) es `true`, las excepciones se lanzarán normalmente y no serán capturadas por Sisk, y el servidor HTTP puede interrumpirse si la excepción no es capturada.
- Si [HttpServerConfiguration.ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) es `false`, las excepciones serán capturadas y manejadas por Sisk. Después de eso, si `Router.CallbackErrorHandler` está definido, se llamará con la excepción capturada y el contexto de la solicitud, y **no** será reenviada a la salida de error estándar. Si `Router.CallbackErrorHandler` no está definido, la excepción será reenviada a la salida de error estándar, y el cliente recibirá una respuesta HTTP 500. Si la salida de error estándar no está definida, el error será ignorado silenciosamente.

Nota: dentro de `Router.CallbackErrorHandler`, puedes establecer el modo de registro para errores, registro de acceso, ambos o ninguno, y alterar el comportamiento predeterminado de escritura de logs:

```csharp
router.CallbackErrorHandler = (ex, ctx) =>
{
    ctx.LogMode = LogOutput.Both; // sobrescribe el modo de registro para registrar el error tanto en el log de acceso como en el de errores
}
```

## Manejador interno de errores

Los callbacks de ruta pueden lanzar errores durante la ejecución del servidor. Si no se manejan correctamente, el funcionamiento general del servidor HTTP puede terminar. El router tiene un callback para cuando un callback de ruta falla y evita la interrupción del servicio.

Este método solo es accesible cuando [ThrowExceptions](https://docs.sisk-framework.org/api/Sisk.Core.Http.HttpServerConfiguration.ThrowExceptions.md) está configurado en false.

```cs
mainRouter.CallbackErrorHandler = (ex, context) =>
{
    return new HttpResponse(500)
    {
        Content = new StringContent($"Error: {ex.Message}")
    };
};
```
