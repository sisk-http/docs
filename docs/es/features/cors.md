# Habilitando CORS (Compartición de Recursos entre Orígenes) en Sisk

Sisk tiene una herramienta que puede ser útil para manejar la [Compartición de Recursos entre Orígenes (CORS)](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Guides/CORS) cuando expones tu servicio públicamente. Esta característica no forma parte del protocolo HTTP sino que es una característica específica de los navegadores web definida por el W3C. Este mecanismo de seguridad evita que una página web haga solicitudes a un dominio diferente al que proporcionó la página web. Un proveedor de servicio puede permitir que ciertos dominios accedan a sus recursos, o solo uno.

## Misma Origen

Para que un recurso sea identificado como “misma origen”, una solicitud debe identificar la cabecera [Origin](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Reference/Headers/Origin) en su solicitud:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

Y el servidor remoto debe responder con una cabecera [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Headers/Access-Control-Allow-Origin) con el mismo valor que el origen solicitado:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Esta verificación es **explícita**: el host, puerto y protocolo deben ser los mismos que los solicitados. Verifica el ejemplo:

- Un servidor responde que su `Access-Control-Allow-Origin` es `https://example.com`:
    - `https://example.net` - el dominio es diferente.
    - `http://example.com` - el esquema es diferente.
    - `http://example.com:5555` - el puerto es diferente.
    - `https://www.example.com` - el host es diferente.

En la especificación, solo se permite la sintaxis para ambas cabeceras, tanto para solicitudes como respuestas. La ruta URL se ignora. El puerto también se omite si es un puerto predeterminado (80 para HTTP y 443 para HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Habilitando CORS

Nativamente, tienes el objeto [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) dentro de tu [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

Puedes configurar CORS al inicializar el servidor:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UseCors(new CrossOriginResourceSharingHeaders(
            allowOrigin: "http://example.com",
            allowHeaders: ["Authorization"],
            exposeHeaders: ["Content-Type"]))
        .Build();

    await app.StartAsync();
}
```

El código anterior enviará las siguientes cabeceras para **todas las respuestas**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Estas cabeceras deben enviarse para todas las respuestas a un cliente web, incluidos errores y redirecciones.

Puedes notar que la clase [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) tiene dos propiedades similares: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) y [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Ten en cuenta que una es plural, mientras que la otra es singular.

- La propiedad **AllowOrigin** es estática: solo el origen que especifiques se enviará para todas las respuestas.
- La propiedad **AllowOrigins** es dinámica: el servidor verifica si el origen de la solicitud está contenido en esta lista. Si se encuentra, se envía para la respuesta de ese origen.

### Caracteres comodín y cabeceras automáticas

Alternativamente, puedes usar un comodín (`*`) en el origen de la respuesta para indicar que cualquier origen está permitido acceder al recurso. Sin embargo, este valor no está permitido para solicitudes que tengan credenciales (cabeceras de autorización) y esta operación [resultará en un error](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Puedes solucionar este problema enumerando explícitamente los orígenes que serán permitidos a través de la propiedad [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) o también usar la constante [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) en el valor de [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Esta propiedad mágica definirá la cabecera `Access-Control-Allow-Origin` con el mismo valor que la cabecera `Origin` de la solicitud.

También puedes usar [AutoFromRequestMethod](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestMethod) y [AutoFromRequestHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoFromRequestHeaders) para un comportamiento similar a `AllowOrigin`, que responde automáticamente según las cabeceras enviadas.

```csharp
using var host = HttpServer.CreateBuilder()
    .UseCors(new CrossOriginResourceSharingHeaders(
        
        // Responde según la cabecera Origin de la solicitud
        allowOrigin: CrossOriginResourceSharingHeaders.AutoAllowOrigin,
        
        // Responde según la cabecera Access-Control-Request-Method o el método de la solicitud
        allowMethods: [CrossOriginResourceSharingHeaders.AutoFromRequestMethod],

        // Responde según la cabecera Access-Control-Request-Headers o las cabeceras enviadas
        allowHeaders: [CrossOriginResourceSharingHeaders.AutoFromRequestHeaders]))
```

## Otras Formas de Aplicar CORS

Si estás trabajando con [service providers](/docs/es/extensions/service-providers), puedes sobreescribir valores definidos en el archivo de configuración:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Sobrescribirá el origen definido en la configuración
            // archivo.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Deshabilitando CORS en Rutas Específicas

La propiedad `UseCors` está disponible tanto para rutas como para todos los atributos de ruta y puede desactivarse con el siguiente ejemplo:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    // GET /api/widgets/colors
    [RouteGet("/colors", UseCors = false)]
    public IEnumerable<string> GetWidgets() {
        return new[] { "Green widget", "Red widget" };
    }
}
```

## Reemplazando Valores en la Respuesta

Puedes reemplazar o eliminar valores explícitamente en una acción de enrutador:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Elimina la cabecera Access-Control-Allow-Credentials
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;
        
        // Reemplaza el Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Solicitudes Preflight

Una solicitud preflight es una solicitud de método [OPTIONS](https://developer.mozilla.org/en-US/docs/es/Web/HTTP/Reference/Methods/OPTIONS) que el cliente envía antes de la solicitud real.

El servidor Sisk siempre responderá a la solicitud con un `200 OK` y las cabeceras CORS aplicables, y luego el cliente puede proceder con la solicitud real. Esta condición solo no se aplica cuando existe una ruta para la solicitud con el [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) configurado explícitamente para `Options`.

## Deshabilitando CORS Globalmente

No es posible hacer esto. Para no usar CORS, no lo configures.