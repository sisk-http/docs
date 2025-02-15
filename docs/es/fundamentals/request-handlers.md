# Manejo de solicitudes

Los controladores de solicitudes, también conocidos como "middlewares", son funciones que se ejecutan antes o después de que se ejecute una solicitud en el enrutador. Pueden definirse por ruta o por enrutador.

Existen dos tipos de controladores de solicitudes:

- **BeforeResponse**: define que el controlador de solicitudes se ejecutará antes de llamar a la acción del enrutador.
- **AfterResponse**: define que el controlador de solicitudes se ejecutará después de llamar a la acción del enrutador. Enviar una respuesta HTTP en este contexto sobrescribirá la respuesta de la acción del enrutador.

Ambos controladores de solicitudes pueden anular la respuesta real de la función de devolución de llamada del enrutador. Además, los controladores de solicitudes pueden ser útiles para validar una solicitud, como la autenticación, el contenido o cualquier otra información, como almacenar información, registros o otros pasos que se pueden realizar antes o después de una respuesta.

![](/assets/img/requesthandlers1.png)

De esta manera, un controlador de solicitudes puede interrumpir toda esta ejecución y devolver una respuesta antes de terminar el ciclo, descartando todo lo demás en el proceso.

Ejemplo: supongamos que un controlador de solicitudes de autenticación de usuario no autentica al usuario. Evitará que el ciclo de vida de la solicitud continúe y se suspenderá. Si esto sucede en el controlador de solicitudes en la posición dos, el tercero y siguientes no se evaluarán.

![](/assets/img/requesthandlers2.png)

## Crear un controlador de solicitudes

Para crear un controlador de solicitudes, podemos crear una clase que herede de la interfaz [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), en este formato:

```cs
public class AuthenticateUserRequestHandler : IRequestHandler
{
    public RequestHandlerExecutionMode ExecutionMode { get; init; } = RequestHandlerExecutionMode.BeforeResponse;

    public HttpResponse? Execute(HttpRequest request, HttpContext context)
    {
        if (request.Headers.Authorization != null)
        {
            // Devolver null indica que el ciclo de la solicitud puede continuar
            return null;
        }
        else
        {
            // Devolver un objeto HttpResponse indica que esta respuesta sobrescribirá las respuestas adyacentes.
            return new HttpResponse(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}
```

En el ejemplo anterior, indicamos que si el encabezado `Authorization` está presente en la solicitud, debe continuar y llamar al siguiente controlador de solicitudes o a la función de devolución de llamada del enrutador, lo que sea que venga a continuación. Si un controlador de solicitudes se ejecuta después de la respuesta por su propiedad [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) y devuelve un valor no nulo, sobrescribirá la respuesta del enrutador.

Siempre que un controlador de solicitudes devuelva `null`, indica que la solicitud debe continuar y el siguiente objeto debe ser llamado o el ciclo debe terminar con la respuesta del enrutador.

## Asociar un controlador de solicitudes con una sola ruta

Puedes definir uno o más controladores de solicitudes para una ruta.

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // controlador de solicitudes antes de la solicitud
    new ValidateJsonContentRequestHandler(),  // controlador de solicitudes antes de la solicitud
    //                                        -- el método IndexPage se ejecutará aquí
    new WriteToLogRequestHandler()            // controlador de solicitudes después de la solicitud
});
```

O creando un objeto [Route](/api/Sisk.Core.Routing.Route):

```cs
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Asociar un controlador de solicitudes con un enrutador

Puedes definir un controlador de solicitudes global que se ejecutará en todas las rutas del enrutador.

```cs
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
```

## Asociar un controlador de solicitudes con un atributo

Puedes definir un controlador de solicitudes en un atributo de método junto con un atributo de ruta.

```cs
public class MyController
{
    [RouteGet("/")]
    [RequestHandler<AuthenticateUserRequestHandler>]
    static HttpResponse Index(HttpRequest request)
    {
        return new HttpResponse()
            .WithContent(new StringContent("Hello world!"));
    }
}
```

Ten en cuenta que es necesario pasar el tipo de controlador de solicitudes deseado y no una instancia del objeto. De esta manera, el controlador de solicitudes se instanciará mediante el analizador del enrutador. Puedes pasar argumentos en el constructor de la clase con la propiedad [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

Ejemplo:

```cs
[RequestHandler<AuthenticateUserRequestHandler>("arg1", 123, ...)]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

También puedes crear tu propio atributo que implemente RequestHandler:

```cs
public class AuthenticateAttribute : RequestHandlerAttribute
{
    public AuthenticateAttribute() : base(typeof(AuthenticateUserRequestHandler), ConstructorArguments = new object?[] { "arg1", 123, ... })
    {
        ;
    }
}
```

Y utilizarlo de la siguiente manera:

```cs
[Authenticate]
static HttpResponse Index(HttpRequest request)
{
    HttpResponse res = new HttpResponse();
    res.Content = new StringContent("Hello world!");
    return res;
}
```

## Saltar un controlador de solicitudes global

Después de definir un controlador de solicitudes global en una ruta, puedes ignorar este controlador de solicitudes en rutas específicas.

```cs
var myRequestHandler = new AuthenticateUserRequestHandler();
mainRouter.GlobalRequestHandlers = new IRequestHandler[]
{
    myRequestHandler
};

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "My route", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: la misma instancia de lo que está en los controladores de solicitudes globales
        new AuthenticateUserRequestHandler() // incorrecto: no saltará el controlador de solicitudes global
    }
});
```

> [!NOTE]
> Si estás saltando un controlador de solicitudes, debes utilizar la misma referencia de lo que instanciaste antes para saltar. Crear otra instancia de controlador de solicitudes no saltará el controlador de solicitudes global, ya que su referencia cambiará. Recuerda utilizar la misma referencia del controlador de solicitudes utilizada en ambos GlobalRequestHandlers y BypassGlobalRequestHandlers.