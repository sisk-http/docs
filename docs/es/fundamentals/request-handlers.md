# Manejo de solicitudes

Los controladores de solicitudes, también conocidos como "middlewares", son funciones que se ejecutan antes o después de que se ejecute una solicitud en el enrutador. Pueden definirse por ruta o por enrutador.

Existen dos tipos de controladores de solicitudes:

- **BeforeResponse**: define que el controlador de solicitudes se ejecutará antes de llamar a la acción del enrutador.
- **AfterResponse**: define que el controlador de solicitudes se ejecutará después de llamar a la acción del enrutador. Enviar una respuesta HTTP en este contexto sobrescribirá la respuesta de la acción del enrutador.

Ambos controladores de solicitudes pueden anular la respuesta real de la función de devolución de llamada del enrutador. Además, los controladores de solicitudes pueden ser útiles para validar una solicitud, como la autenticación, el contenido o cualquier otra información, como almacenar información, registros o otros pasos que se pueden realizar antes o después de una respuesta.

![](/assets/img/requesthandlers1.png)

De esta manera, un controlador de solicitudes puede interrumpir toda esta ejecución y devolver una respuesta antes de terminar el ciclo, descartando todo lo demás en el proceso.

Ejemplo: supongamos que un controlador de solicitudes de autenticación de usuario no autentica al usuario. Evitará que el ciclo de solicitud continúe y se suspenderá. Si esto sucede en el controlador de solicitudes en la posición dos, el tercero y siguientes no se evaluarán.

![](/assets/img/requesthandlers2.png)

## Creación de un controlador de solicitudes

Para crear un controlador de solicitudes, podemos crear una clase que herede de la interfaz [IRequestHandler](/api/Sisk.Core.Routing.IRequestHandler), en este formato:

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
            // Devolver null indica que el ciclo de solicitud puede continuar
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

En el ejemplo anterior, indicamos que si el encabezado `Authorization` está presente en la solicitud, debe continuar y la siguiente solicitud de controlador o la devolución de llamada del enrutador debe ser llamada, lo que sea que venga a continuación. Si es un controlador de solicitudes que se ejecuta después de la respuesta por su propiedad [ExecutionMode](/api/Sisk.Core.Routing.IRequestHandler.ExecutionMode) y devuelve un valor no nulo, sobrescribirá la respuesta del enrutador.

Siempre que un controlador de solicitudes devuelva `null`, indica que la solicitud debe continuar y el siguiente objeto debe ser llamado o el ciclo debe terminar con la respuesta del enrutador.

## Asociación de un controlador de solicitudes con una sola ruta

Puedes definir uno o más controladores de solicitudes para una ruta.

<div class="script-header">
    <span>
        Router.cs
    </span>
    <span>
        C#
    </span>
</div>

```cs
mainRouter.SetRoute(RouteMethod.Get, "/", IndexPage, "", new IRequestHandler[]
{
    new AuthenticateUserRequestHandler(),     // antes de la solicitud
    new ValidateJsonContentRequestHandler(),  // antes de la solicitud
    //                                        -- el método IndexPage se ejecutará aquí
    new WriteToLogRequestHandler()            // después de la solicitud
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
Route indexRoute = new Route(RouteMethod.Get, "/", "", IndexPage, null);
indexRoute.RequestHandlers = new IRequestHandler[]
{
    new AuthenticateUserRequestHandler()
};
mainRouter.SetRoute(indexRoute);
```

## Asociación de un controlador de solicitudes con un enrutador

Puedes definir un controlador de solicitudes global que se ejecutará en todas las rutas del enrutador.

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

## Asociación de un controlador de solicitudes con un atributo

Puedes definir un controlador de solicitudes en un atributo junto con un atributo de ruta.

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
            Content = new StringContent("Hola mundo!")
        };
    }
}
```

Ten en cuenta que es necesario pasar el tipo de controlador de solicitudes deseado y no una instancia del objeto. De esta manera, el controlador de solicitudes será instanciado por el analizador del enrutador. Puedes pasar argumentos en el constructor de la clase con la propiedad [ConstructorArguments](/api/Sisk.Core.Routing.RequestHandlerAttribute.ConstructorArguments).

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
        Content = new StringContent("Hola mundo!")
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

Y usarlo como:

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
        Content = new StringContent("Hola mundo!")
    };
}
```

## Omisión de un controlador de solicitudes global

Después de definir un controlador de solicitudes global en una ruta, puedes ignorar este controlador de solicitudes en rutas específicas.

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

mainRouter.SetRoute(new Route(RouteMethod.Get, "/", "Mi ruta", IndexPage, null)
{
    BypassGlobalRequestHandlers = new IRequestHandler[]
    {
        myRequestHandler,                    // ok: la misma instancia de lo que está en los controladores de solicitudes globales
        new AuthenticateUserRequestHandler() // incorrecto: no saltará el controlador de solicitudes global
    }
});
```

> [!NOTE]
> Si estás omitiendo un controlador de solicitudes, debes usar la misma referencia de lo que instanciaste antes para saltar. Crear otra instancia de controlador de solicitudes no saltará el controlador de solicitudes global, ya que su referencia cambiará. Recuerda usar la misma referencia de controlador de solicitudes utilizada en ambos GlobalRequestHandlers y BypassGlobalRequestHandlers.