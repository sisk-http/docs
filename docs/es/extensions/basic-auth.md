# Autenticación Básica

El paquete de Autenticación Básica agrega un controlador de solicitudes capaz de manejar el esquema de autenticación básica en su aplicación Sisk con muy poca configuración y esfuerzo.
La autenticación HTTP básica es una forma minimalista de autenticar solicitudes mediante un identificador de usuario y una contraseña, donde la sesión es controlada exclusivamente
por el cliente y no hay tokens de autenticación o acceso.

<img src="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication/httpauth.png">

Lea más sobre el esquema de autenticación básica en la [especificación de MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Authentication).

## Instalación

Para empezar, instale el paquete Sisk.BasicAuth en su proyecto:

    > dotnet add package Sisk.BasicAuth

Puede ver más formas de instalarlo en su proyecto en el [repositorio de Nuget](https://www.nuget.org/packages/Sisk.BasicAuth/0.15.0).

## Creación de su controlador de autenticación

Puede controlar el esquema de autenticación para un módulo completo o para rutas individuales. Para ello, primero escribamos nuestro primer controlador de autenticación básica.

En el ejemplo a continuación, se establece una conexión con la base de datos, se verifica si el usuario existe y si la contraseña es válida, y después de eso, se almacena el usuario en la bolsa de contexto.

```cs
public class UserAuthHandler : BasicAuthenticateRequestHandler
{
    public UserAuthHandler() : base()
    {
        Realm = "Para entrar en esta página, por favor, informe sus credenciales.";
    }

    public override HttpResponse? OnValidating(BasicAuthenticationCredentials credentials, HttpContext context)
    {
        DbContext db = new DbContext();

        // en este caso, estamos utilizando el correo electrónico como el campo de identificador de usuario, así que
        // vamos a buscar un usuario utilizando su correo electrónico.
        User? user = db.Users.FirstOrDefault(u => u.Email == credentials.UserId);
        if (user == null)
        {
            return base.CreateUnauthorizedResponse("Lo sentimos, no se encontró ningún usuario con este correo electrónico.");
        }

        // valida que la contraseña de las credenciales sea válida para este usuario.
        if (!user.ValidatePassword(credentials.Password))
        {
            return base.CreateUnauthorizedResponse("Credenciales inválidas.");
        }

        // agrega el usuario conectado a la bolsa de contexto
        // y continúa la ejecución
        context.Bag.Add("loggedUser", user);
        return null;
    }
}
```

Así que solo asocie este controlador de solicitudes con nuestra ruta o clase.

```cs
public class UsersController
{
    [RouteGet("/")]
    [RequestHandler(typeof(UserAuthHandler))]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Hola, " + loggedUser.Name + "!";
    }
}
```

O utilizando la clase [RouterModule](/api/Sisk.Core.Routing.RouterModule):

```cs
public class UsersController : RouterModule
{
    public ClientModule()
    {
        // ahora todas las rutas dentro de esta clase serán manejadas por
        // UserAuthHandler.
        base.HasRequestHandler(new UserAuthHandler());
    }

    [RouteGet("/")]
    public string Index(HttpRequest request)
    {
        User loggedUser = (User)request.Context.RequestBag["loggedUser"];
        return "Hola, " + loggedUser.Name + "!";
    }
}
```

## Observaciones

La responsabilidad principal de la autenticación básica se lleva a cabo en el lado del cliente. El almacenamiento, el control de caché,
y el cifrado se manejan localmente en el cliente. El servidor solo recibe las credenciales y valida si se permite o no el acceso.

Tenga en cuenta que este método no es uno de los más seguros porque coloca una gran responsabilidad en
el cliente, lo que puede ser difícil de rastrear y mantener la seguridad de sus credenciales. Además, es
fundamental que las contraseñas se transmitan en un contexto de conexión segura (SSL), ya que no tienen cifrado inherente. Una breve intercepción en los encabezados de una solicitud puede exponer las credenciales de acceso de su usuario.

Opte por soluciones de autenticación más robustas para aplicaciones en producción y evite utilizar demasiados componentes prefabricados,
ya que pueden no adaptarse a las necesidades de su proyecto y terminar exponiéndolo a riesgos de seguridad.