# Autenticación Básica

El paquete Basic Auth agrega un manejador de solicitudes capaz de manejar el esquema de autenticación básica en tu aplicación Sisk con muy poca configuración y esfuerzo.
La autenticación HTTP básica es una forma mínima de autenticar solicitudes mediante un identificador de usuario y una contraseña, donde la sesión es controlada exclusivamente por el cliente y no existen tokens de autenticación o acceso.

![Basic Auth](/assets/img/basic-auth.svg)

Lee más sobre el esquema de autenticación básica en la [especificación MDN](https://developer.mozilla.org/pt-BR/docs/es/Web/HTTP/Authentication).

## Instalación

Para comenzar, instala el paquete Sisk.BasicAuth en tu proyecto:

```bash
> dotnet add package Sisk.BasicAuth
```

Puedes ver más formas de instalarlo en tu proyecto en el [repositorio Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Creando tu manejador de autenticación

Puedes controlar el esquema de autenticación para todo un módulo o para rutas individuales. Para eso, primero escribamos nuestro primer manejador de autenticación básica.

En el ejemplo de abajo, se hace una conexión a la base de datos, se verifica si el usuario existe y si la contraseña es válida, y después, se almacena el usuario en la bolsa de contexto.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Para entrar a esta página, por favor, informe sus credenciales.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // en este caso, estamos usando el correo electrónico como campo de id de usuario, así que
        // vamos a buscar un usuario usando su correo electrónico.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("¡Lo siento! No se encontró ningún usuario con este correo electrónico.");
        }

        // valida que la contraseña de las credenciales sea válida para este usuario.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Credenciales inválidas.");
        }

        // agrega el usuario autenticado al contexto http
        // y continúa la ejecución
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Entonces, simplemente asocia este manejador de solicitudes con nuestra ruta o clase.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"¡Hola, {loggedUser.Name}!";
    }
}
```

O usando la clase [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // todas las rutas dentro de esta clase serán manejadas por
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }
    
    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = request.Bag.Get<User>();
        return $"¡Hola, {loggedUser.Name}!";
    }
}
```

## Observaciones

La responsabilidad principal de la autenticación básica se lleva a cabo en el lado del cliente. El almacenamiento, el control de caché y la encriptación se manejan localmente en el cliente. El servidor solo recibe las credenciales y valida si el acceso está permitido o no.

Ten en cuenta que este método no es uno de los más seguros porque coloca una responsabilidad significativa en el cliente, lo que puede dificultar rastrear y mantener la seguridad de sus credenciales. Además, es crucial que las contraseñas se transmitan en un contexto de conexión segura (SSL), ya que no tienen ninguna encriptación inherente. Una breve interceptación en los encabezados de una solicitud puede exponer las credenciales de acceso de tu usuario.

Opta por soluciones de autenticación más robustas para aplicaciones en producción y evita usar demasiados componentes de uso general, ya que pueden no adaptarse a las necesidades de tu proyecto y terminar exponiéndolo a riesgos de seguridad.