# Manejo de solicitudes

Los manejadores de solicitudes, también conocidos como "middlewares", son funciones que se ejecutan antes o después de que una solicitud sea procesada por el router. Pueden definirse por ruta o por router.

Existen dos tipos de manejadores de solicitudes:

- **BeforeResponse**: define que el manejador de solicitudes se ejecutará antes de llamar a la acción del router.
- **AfterResponse**: define que el manejador de solicitudes se ejecutará después de llamar a la acción del router. Enviar una respuesta HTTP en este contexto sobrescribirá la respuesta de la acción del router.

Ambos manejadores de solicitudes pueden sobrescribir la respuesta real de la función de devolución de llamada del router. Por cierto, los manejadores de solicitudes pueden ser útiles para validar una solicitud, como autenticación, contenido, u otra información, como almacenar datos, registros, u otros pasos que pueden realizarse antes o después de una respuesta.

![](/assets/img/requesthandlers1.png)

De esta manera, un manejador de solicitudes puede interrumpir toda esta ejecución y devolver una respuesta antes de que finalice el ciclo, descartando todo lo demás en el proceso.

Ejemplo: supongamos que un manejador de solicitudes de autenticación de usuario no lo autentica. Impedirá que el ciclo de vida de la solicitud continúe y se quedará colgado. Si esto ocurre en el manejador de solicitudes en la posición dos, el tercero y los siguientes no se evaluarán.

![](/assets/img/requesthandlers2.png)

## Creando un manejador de solicitudes

Para crear un manejador de solicitudes, podemos crear una clase que herede la interfaz [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), con el siguiente formato:

<div class="script-header">
    <span>
        Middleware/AuthenticateUserRequestHandler.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Returning null indicates that the request cycle can be continued
            return null;
        }
        else
        {
            // Returning an HttpResponse object indicates that this response will overwrite adjacent responses.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

En el ejemplo anterior, indicamos que si el encabezado `Authorization` está presente en la solicitud, debe continuar y se debe llamar al siguiente manejador de solicitudes o a la devolución de llamada del router, lo que sea que venga después. Si un manejador de solicitudes se ejecuta después de la respuesta mediante su propiedad [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) y devuelve un valor no nulo, sobrescribirá la respuesta del router.

Siempre que un manejador de solicitudes devuelve `null`, indica que la solicitud debe continuar y se debe llamar al siguiente objeto o que el ciclo debe terminar con la respuesta del router.

Si heredas de la clase incorporada [RequestHandler](/api/Sisk.Core.Routing.RequestHandler), puedes devolver `Next()` para hacer explícita esa intención:

```cs
public class AuthenticateUserRequestHandler : RequestHandler
{
    public override HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization is not null)
            return Next();

        return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

Para manejadores que necesiten I/O, hereda de [AsyncRequestHandler](/api/Sisk.Core.Routing.AsyncRequestHandler):

```cs
public class LoadUserRequestHandler : AsyncRequestHandler
{
    public override async Task<HttpResponse?> ExecuteAsync(HttpRequest request, HttpContext context)
    {
        var user = await UserRepository.FindAsync(request.Headers.Authorization, request.DisconnectToken);
        if (user is null)
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);

        request.Bag.Set(user);
        return Next();
    }
}
```

Pequeños manejadores en línea también pueden crearse con `RequestHandler.Create` o `AsyncRequestHandler.Create`:

```cs
var requireJson = RequestHandler.Create((request, context) =>
{
    if (request.Headers.ContentType?.Contains("application/json") == true)
        return null;

    return new HttpResponse(System.Net.HttpStatusCode.UnsupportedMediaType);
});
```

## Asociando un manejador de solicitudes con una única ruta

Puedes definir uno o más manejadores de solicitudes para una ruta.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.Map(RouteMethod.Get, "/", IndexPage, new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // before request handler
    new ValidateJsonContentRequestHandler(),  // before request handler
    //                                        -- method IndexPage will be executed here
    new WriteToLogRequestHandler()            // after request handler
});
```

O creando un objeto [Route](/api/Sisk.Core.Routing.Route):

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
Route indexRoute = Route.Get("/", IndexPage);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.Map(indexRoute);
```

## Asociando un manejador de solicitudes con un router

Puedes definir un manejador de solicitudes global que se ejecutará en todas las rutas de un router.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Asociando un manejador de solicitudes con un atributo

Puedes definir un manejador de solicitudes en un atributo de método junto con un atributo de ruta.

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
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse() {
            Content = new StringContent("Hello world!")
        };
    }
}
```

Ten en cuenta que es necesario pasar el tipo de manejador de solicitudes deseado y no una instancia de objeto. De esta forma, el manejador de solicitudes será instanciado por el analizador del router. Puedes pasar argumentos en el constructor de la clase mediante la propiedad [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Ejemplo:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
public HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

También puedes crear tu propio atributo que implemente RequestHandler:

<div class="script-header">
    <span>
        Middleware/Attributes/AuthenticateAttribute.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

Y usarlo así:

<div class="script-header">
    <span>
        Controller/MyController.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    return res = new HttpResponse() {
        Content = new StringContent("Hello world!")
    };
}
```

## Omitiendo un manejador de solicitudes global

Después de definir un manejador de solicitudes global en una ruta, puedes ignorar este manejador de solicitudes en rutas específicas.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

Route publicRoute = Route.Get("/", IndexPage);
publicRoute.Name = "My route";
publicRoute.BypassGlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler,                    // ok: the same instance of what is in the global request handlers
    new AuthenticateUserRequestHandler() // wrong: will not skip the global request handler
};

mainRouter.Map(publicRoute);
```

> [!NOTE]
> Si estás omitiendo un manejador de solicitudes, debes usar la misma referencia de la instancia que creaste antes para saltarlo. Crear otra instancia de manejador de solicitudes no omitirá el manejador global ya que su referencia cambiará. Recuerda usar la misma referencia del manejador de solicitudes tanto en GlobalRequestHandlers como en BypassGlobalRequestHandlers.