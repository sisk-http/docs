# Habilitar CORS (Compartir recursos de origen cruzado) en Sisk

Sisk tiene una herramienta que puede ser útil para manejar [Compartir recursos de origen cruzado (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) cuando se expone su servicio públicamente. Esta característica no es parte del protocolo HTTP, sino una característica específica de los navegadores web definida por la W3C. Este mecanismo de seguridad evita que una página web realice solicitudes a un dominio diferente al que proporcionó la página web. Un proveedor de servicios puede permitir que ciertos dominios accedan a sus recursos, o solo uno.

## Same Origin

Para que un recurso sea identificado como "same origin", una solicitud debe identificar el encabezado [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin) en su solicitud:

```http
GET /api/users HTTP/1.1
Host: example.com
Origin: http://example.com
...
```

Y el servidor remoto debe responder con un encabezado [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) con el mismo valor que el origen solicitado:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
...
```

Esta verificación es **explícita**: el host, el puerto y el protocolo deben ser los mismos que los solicitados. Verifique el ejemplo:

- Un servidor responde que su `Access-Control-Allow-Origin` es `https://example.com`:
    - `https://example.net` - el dominio es diferente.
    - `http://example.com` - el esquema es diferente.
    - `http://example.com:5555` - el puerto es diferente.
    - `https://www.example.com` - el host es diferente.

En la especificación, solo se permite la sintaxis para ambos encabezados, tanto para solicitudes como para respuestas. La ruta URL se ignora. El puerto también se omite si es un puerto predeterminado (80 para HTTP y 443 para HTTPS).

```http
Origin: null
Origin: <scheme>://<hostname>
Origin: <scheme>://<hostname>:<port>
```

## Habilitar CORS

Nativamente, tiene el objeto [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) dentro de su [ListeningHost](/api/Sisk.Core.Http.ListeningHost).

Puede configurar CORS al inicializar el servidor:

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

El código anterior enviará los siguientes encabezados para **todas las respuestas**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Headers: Authorization
Access-Control-Expose-Headers: Content-Type
```

Estos encabezados deben enviarse para todas las respuestas a un cliente web, incluidos errores y redirecciones.

Puede notar que la clase [CrossOriginResourceSharingHeaders](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders) tiene dos propiedades similares: [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin) y [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins). Note que una es plural, mientras que la otra es singular.

- La propiedad **AllowOrigin** es estática: solo el origen que especifique se enviará para todas las respuestas.
- La propiedad **AllowOrigins** es dinámica: el servidor verifica si el origen de la solicitud está contenido en esta lista. Si se encuentra, se envía para la respuesta de ese origen.

### Comodín en Origen

Alternativamente, puede usar un comodín (`*`) en el origen de la respuesta para especificar que cualquier origen puede acceder al recurso. Sin embargo, este valor no está permitido para solicitudes que tienen credenciales (encabezados de autorización) y esta operación [resultará en un error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).

Puede solucionar este problema enumerando explícitamente qué orígenes se permitirán a través de la propiedad [AllowOrigins](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigins) o también usar la constante [AutoAllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AutoAllowOrigin) en el valor de [AllowOrigin](/api/Sisk.Core.Entity.CrossOriginResourceSharingHeaders.AllowOrigin). Esta propiedad mágica definirá el encabezado `Access-Control-Allow-Origin` para el mismo valor que el encabezado `Origin` de la solicitud.

## Otras formas de aplicar CORS

Si está tratando con [proveedores de servicios](/docs/extensions/service-providers), puede anular los valores definidos en el archivo de configuración:

```csharp
static async Task Main(string[] args)
{
    using var app = HttpServer.CreateBuilder()
        .UsePortableConfiguration(...)
        .UseCors(cors => {
            // Anulará el origen definido en el archivo de configuración.
            cors.AllowOrigin = "http://example.com";
        })
        .Build();

    await app.StartAsync();
}
```

## Deshabilitar CORS en rutas específicas

La propiedad `UseCors` está disponible para rutas y todos los atributos de ruta y se puede deshabilitar con el siguiente ejemplo:

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

## Reemplazar valores en la respuesta

Puede reemplazar o eliminar valores explícitamente en una acción de enrutador:

```csharp
[RoutePrefix("api/widgets")]
public class WidgetController : Controller {

    public IEnumerable<string> GetWidgets(HttpRequest request) {

        // Elimina el encabezado Access-Control-Allow-Credentials
        request.Context.OverrideHeaders.AccessControlAllowCredentials = string.Empty;

        // Reemplaza el Access-Control-Allow-Origin
        request.Context.OverrideHeaders.AccessControlAllowOrigin = "https://contorso.com";

        return new[] { "Green widget", "Red widget" };
    }
}
```

## Solicitudes preflight

Una solicitud preflight es un método [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS) que el cliente envía antes de la solicitud real.

El servidor Sisk siempre responderá a la solicitud con un `200 OK` y los encabezados CORS aplicables, y luego el cliente puede proceder con la solicitud real. Esta condición solo no se aplica cuando existe una ruta para la solicitud con el [RouteMethod](/api/Sisk.Core.Routing.RouteMethod) configurado explícitamente para `Options`.

## Deshabilitar CORS globalmente

No es posible hacerlo. Para no usar CORS, no configurelo.