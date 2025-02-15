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

Para entender qué es capaz de hacer una ruta, debemos entender qué es capaz de hacer una solicitud. Un [HttpRequest](/api/Sisk.Core.Http.HttpRequest) contendrá todo lo que necesite. Sisk también incluye algunas características adicionales que aceleran el desarrollo en general.

Para cada acción recibida por el servidor, se llamará a un delegado de tipo [RouteAction](/api/Sisk.Core.Routing.RouteAction). Este delegado contiene un parámetro que contiene un [HttpRequest](/api/Sisk.Core.Http.HttpRequest) con toda la información necesaria sobre la solicitud recibida por el servidor. El objeto resultante de este delegado debe ser un [HttpResponse](/api/Sisk.Core.Http.HttpResponse) o un objeto que se asigna a él a través de [tipos de respuesta implícitos](/docs/fundamentals/responses#implicit-response-types).

## Coincidencia de rutas

Cuando se recibe una solicitud por el servidor HTTP, Sisk busca una ruta que satisfaga la expresión de la ruta recibida por la solicitud. La expresión siempre se prueba entre la ruta y la ruta de la solicitud, sin considerar la cadena de consulta.

Esta prueba no tiene prioridad y es exclusiva de una sola ruta. Cuando no se encuentra una ruta que coincida con la solicitud, se devuelve la respuesta [Router.NotFoundErrorHandler](/api/Sisk.Core.Routing.Router.NotFoundErrorHandler) al cliente. Cuando se coincide con el patrón de ruta, pero el método HTTP no coincide, se envía la respuesta [Router.MethodNotAllowedErrorHandler](/api/Sisk.Core.Routing.Router.MethodNotAllowedErrorHandler) al cliente.

Sisk verifica la posibilidad de colisiones de rutas para evitar estos problemas. Al definir rutas, Sisk buscará rutas posibles que puedan colisionar con la ruta que se está definiendo. Esta prueba incluye la comprobación de la ruta y el método que la ruta está configurada para aceptar.

### Creación de rutas utilizando patrones de ruta

Puedes definir rutas utilizando varios métodos `SetRoute`.

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
        // el contenido de StreamContent se descarta después de enviar
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

Cada ruta recibida por el servidor se normaliza antes de que se ejecute la prueba de patrón de ruta, siguiendo estas reglas:

- Todos los segmentos vacíos se eliminan de la ruta, por ejemplo: `////foo//bar` se convierte en `/foo/bar`.
- La coincidencia de ruta es **sensible a mayúsculas y minúsculas**, a menos que [Router.MatchRoutesIgnoreCase](/api/Sisk.Core.Routing.Router.MatchRoutesIgnoreCase) esté establecido en `true`.

Las propiedades [Query](/api/Sisk.Core.Http.HttpRequest.Query) y [RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters) de [HttpRequest](/api/Sisk.Core.Http.HttpRequest) devuelven un objeto [StringValueCollection](/api/Sisk.Core.Entity.StringValueCollection), donde cada propiedad indexada devuelve un [StringValue](/api/Sisk.Core.Entity.StringValue) no nulo, que se puede utilizar como una opción/monada para convertir su valor raw en un objeto administrado.

El ejemplo siguiente lee el parámetro de ruta "id" y obtiene un `Guid` de él. Si el parámetro no es un Guid válido, se lanza una excepción y se devuelve un error 500 al cliente si el servidor no está manejando [Router.CallbackErrorHandler](/api/Sisk.Core.Routing.Router.CallbackErrorHandler).

```cs
mainRouter.SetRoute(RouteMethod.Get, "/user/<id>", (request) =>
{
    Guid id = request.RouteParameters["id"].GetGuid();
});
```

> [!NOTA]
> Las rutas tienen su `/` final ignorado en ambas rutas de solicitud y ruta, es decir, si intentas acceder a una ruta definida como `/index/page` podrás acceder utilizando `/index/page/` también.
>
> También puedes forzar las URLs a terminar con `/` habilitando la bandera [ForceTrailingSlash](/api/Sisk.Core.Http.HttpServerFlags.ForceTrailingSlash).

### Creación de rutas utilizando instancias de clase

También puedes definir rutas dinámicamente utilizando reflexión con el atributo [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute). De esta manera, la instancia de una clase en la que sus métodos implementan este atributo tendrá sus rutas definidas en el router de destino.

Para que un método se defina como una ruta, debe estar marcado con un [RouteAttribute](/api/Sisk.Core.Routing.RouteAttribute), como el atributo en sí o un [RouteGetAttribute](/api/Sisk.Core.Routing.RouteGetAttribute). El método puede ser estático, de instancia, público o privado. Cuando se utiliza el método `SetObject(type)` o `SetObject<TType>()`, se ignoran los métodos de instancia.

```cs
public class MyController
{
    // coincidirá con GET /
    [RouteGet]
    HttpResponse Index(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Índice!");
        return res;
    }

    // los métodos estáticos también funcionan
    [RouteGet("/hola")]
    static HttpResponse Hello(HttpRequest request)
    {
        HttpResponse res = new HttpResponse();
        res.Content = new StringContent("Hola mundo!");
        return res;
    }
}
```

La línea siguiente definirá tanto el método `Index` como el método `Hello` de `MyController` como rutas, ya que ambos están marcados como rutas, y se ha proporcionado una instancia de la clase, no su tipo. Si se hubiera proporcionado su tipo en lugar de una instancia, solo se habrían definido los métodos estáticos.

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

En lugar de utilizar los métodos de coincidencia de ruta HTTP predeterminados, puedes marcar una ruta para que se interprete con Regex.

```cs
Route indexRoute = new Route(RouteMethod.Get, @"\/[a-z]+\/", "Mi ruta", IndexPage, null);
indexRoute.UseRegex = true;
mainRouter.SetRoute(indexRoute);
```

O con la clase [RegexRoute](/api/Sisk.Core.Routing.RegexRoute):

```cs
RegexRoute indexRoute = new RegexRoute(RouteMethod.Get, @"\/[a-z]+\/", request =>
{
    return new HttpResponse("hola, mundo");
});
mainRouter.SetRoute(indexRoute);
```

También puedes capturar grupos de la expresión regular en el contenido de [HttpRequest.RouteParameters](/api/Sisk.Core.Http.HttpRequest.RouteParameters):

```cs
[RegexRoute(RouteMethod.Get, @"/uploads/(?<filename>.*\.(jpeg|jpg|png))")]
static HttpResponse RegexRoute(HttpRequest request)
{
    string filename = request.RouteParameters["filename"].GetString();
    return new HttpResponse().WithContent($"Accediendo al archivo {filename}");
}
```

## Rutas de cualquier método

Puedes definir una ruta para que se ajuste solo por su ruta y omitir el método HTTP. Esto puede ser útil para que realices la validación de método dentro de la devolución de llamada de la ruta.

```cs
// coincidirá con / en cualquier método HTTP
mainRouter.SetRoute(RouteMethod.Any, "/", callbackFunction);
```

## Rutas de cualquier ruta

Las rutas de cualquier ruta prueban cualquier ruta recibida por el servidor HTTP, sujeto al método de ruta que se está probando. Si el método de ruta es RouteMethod.Any y la ruta utiliza [Route.AnyPath](/api/Sisk.Core.Routing.Route.AnyPath) en su expresión de ruta, esta ruta escuchará todas las solicitudes del servidor HTTP, y no se pueden definir otras rutas.

```cs
// la siguiente ruta coincidirá con todas las solicitudes POST
mainRouter.SetRoute(RouteMethod.Post, Route.AnyPath, callbackFunction);
```

## Coincidencia de ruta sin distinguir mayúsculas y minúsculas

De forma predeterminada, la interpretación de rutas con solicitudes es sensible a mayúsculas y minúsculas. Para hacer que ignore mayúsculas y minúsculas, habilita esta opción:

```cs
mainRouter.MatchRoutesIgnoreCase = true;
```

Esto también habilitará la opción `RegexOptions.IgnoreCase` para rutas donde se realice la coincidencia con regex.

## Controlador de errores de no encontrado (404)

Puedes crear un controlador de errores personalizado para cuando una solicitud no coincida con ninguna ruta conocida.

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

También puedes crear un controlador de errores personalizado para cuando una solicitud coincida con su ruta, pero no coincida con el método.

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

Las devoluciones de llamada de ruta pueden generar errores durante la ejecución del servidor. Si no se manejan correctamente, el funcionamiento general del servidor HTTP puede interrumpirse. El router tiene una devolución de llamada para cuando una devolución de llamada de ruta falla y evita la interrupción del servicio.

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